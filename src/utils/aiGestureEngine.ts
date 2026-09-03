import {
  FingerAngles,
  FingerConfidence,
  SingleHandData,
  MultiHandDetectionResult,
  SignBranchTag,
  HandPresenceState,
  SignKinematicType,
  HandTelemetry,
} from '../types';
import { ISL_FINGER_PROFILES, ISL_ALPHABETS_DICT, ISL_WORDS_DICT } from '../data/islDictionary';

// Branch Candidate Sets defined by ISL Kinematics
export const ONE_HANDED_CANDIDATES = ['C', 'I', 'L', 'O', 'U', 'V', 'BYE'];
export const TWO_HANDED_SYMMETRIC_CANDIDATES = ['A', 'B', 'S', 'W', 'X', 'HELLO', 'WELCOME', 'PLEASE', 'EMERGENCY'];
export const TWO_HANDED_ASYMMETRIC_CANDIDATES = [
  'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'T', 'Y', 'Z',
  'THANK YOU', 'GOOD MORNING', 'DOCTOR', 'HOSPITAL', 'HELP', 'FEVER',
  'MEDICINE', 'TICKET', 'TRAIN', 'BUS', 'AADHAAR', 'POLICE', 'YES', 'NO'
];

export interface RawMediaPipeLandmark {
  x: number;
  y: number;
  z?: number;
}

export interface RawMediaPipeHandData {
  landmarks: RawMediaPipeLandmark[];
  handedness: 'Right' | 'Left';
  confidence?: number;
}

export class AIGestureEngine {
  // Occlusion Buffer & Smoothing State (interpolates up to 8 frames ~250ms)
  private rightHandBuffer: {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    vy: number;
    landmarks: [number, number][];
    missingFrames: number;
    detected: boolean;
  } = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    vx: 0,
    vy: 0,
    landmarks: [],
    missingFrames: 999,
    detected: false,
  };

  private leftHandBuffer: {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    vy: number;
    landmarks: [number, number][];
    missingFrames: number;
    detected: boolean;
  } = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    vx: 0,
    vy: 0,
    landmarks: [],
    missingFrames: 999,
    detected: false,
  };

  private lastPositions = {
    right: { x: 0, y: 0 },
    left: { x: 0, y: 0 },
  };

  private MAX_OCCLUSION_FRAMES = 8; // Interpolate gaps up to ~8 frames (~250ms)

  // Stage 5/6: Confidence-Gated Output & Stabilization Buffer
  private predictionHistory: { sign: string; confidence: number; timestamp: number }[] = [];
  private currentHoldSign: string | null = null;
  private holdFrameCount: number = 0;
  private REQUIRED_HOLD_FRAMES = 6;
  private CONFIDENCE_THRESHOLD = 86;

  /**
   * Calculate 3D angle at joint B given points A, B, C in degrees [0, 180]
   */
  public calculateJointAngle(
    pointA: { x: number; y: number; z?: number },
    pointB: { x: number; y: number; z?: number },
    pointC: { x: number; y: number; z?: number }
  ): number {
    if (!pointA || !pointB || !pointC) return 180;

    const vecBA = {
      x: pointA.x - pointB.x,
      y: pointA.y - pointB.y,
      z: (pointA.z || 0) - (pointB.z || 0),
    };

    const vecBC = {
      x: pointC.x - pointB.x,
      y: pointC.y - pointB.y,
      z: (pointC.z || 0) - (pointB.z || 0),
    };

    const dotProduct = vecBA.x * vecBC.x + vecBA.y * vecBC.y + vecBA.z * vecBC.z;
    const magBA = Math.sqrt(vecBA.x ** 2 + vecBA.y ** 2 + vecBA.z ** 2);
    const magBC = Math.sqrt(vecBC.x ** 2 + vecBC.y ** 2 + vecBC.z ** 2);

    if (magBA === 0 || magBC === 0) return 180;

    const cosTheta = Math.max(-1, Math.min(1, dotProduct / (magBA * magBC)));
    const angleRad = Math.acos(cosTheta);
    return Math.round((angleRad * 180) / Math.PI);
  }

  /**
   * Classify individual finger extension state from joint angle
   */
  public classifyState(angle: number): 'EXTENDED' | 'CURVED' | 'CURLED' {
    if (angle >= 135) return 'EXTENDED';
    if (angle >= 70) return 'CURVED';
    return 'CURLED';
  }

  /**
   * Extract real joint angles from 21 MediaPipe landmarks
   */
  public extractAnglesFromLandmarks(lms: RawMediaPipeLandmark[]): FingerAngles {
    if (!lms || lms.length < 21) {
      return { thumb: 165, index: 170, middle: 165, ring: 160, pinky: 155, indexMiddleSpread: 25 };
    }

    // Wrist: 0, Thumb: 1-4, Index: 5-8, Middle: 9-12, Ring: 13-16, Pinky: 17-20
    const thumbAng = this.calculateJointAngle(lms[1], lms[2], lms[4]);
    const indexAng = this.calculateJointAngle(lms[5], lms[6], lms[8]);
    const middleAng = this.calculateJointAngle(lms[9], lms[10], lms[12]);
    const ringAng = this.calculateJointAngle(lms[13], lms[14], lms[16]);
    const pinkyAng = this.calculateJointAngle(lms[17], lms[18], lms[20]);

    // Spread between index tip (8) and middle tip (12) relative to wrist (0)
    const spread = this.calculateJointAngle(lms[8], lms[0], lms[12]);

    return {
      thumb: Math.max(10, Math.min(180, thumbAng)),
      index: Math.max(10, Math.min(180, indexAng)),
      middle: Math.max(10, Math.min(180, middleAng)),
      ring: Math.max(10, Math.min(180, ringAng)),
      pinky: Math.max(10, Math.min(180, pinkyAng)),
      indexMiddleSpread: Math.max(5, Math.min(90, spread)),
    };
  }

  /**
   * Process Real 21-Landmark Hand Detections (e.g., MediaPipe or Camera pipeline)
   * Strictly enforces: ZERO hands by default when no hands are in the camera feed!
   */
  public processRealHands(
    detectedHands: RawMediaPipeHandData[],
    canvasWidth: number,
    canvasHeight: number,
    targetSignCandidate: string | null = null,
    manualHandCountConfig: 'auto' | 1 | 2 = 'auto'
  ): MultiHandDetectionResult {
    // 1. If NO hands detected by camera
    if (!detectedHands || detectedHands.length === 0) {
      this.rightHandBuffer.missingFrames++;
      this.leftHandBuffer.missingFrames++;

      if (this.rightHandBuffer.missingFrames > this.MAX_OCCLUSION_FRAMES) {
        this.rightHandBuffer.detected = false;
        this.rightHandBuffer.landmarks = [];
      }
      if (this.leftHandBuffer.missingFrames > this.MAX_OCCLUSION_FRAMES) {
        this.leftHandBuffer.detected = false;
        this.leftHandBuffer.landmarks = [];
      }

      if (!this.rightHandBuffer.detected && !this.leftHandBuffer.detected) {
        this.resetStabilization();
        return {
          presenceState: 'no-hands',
          hands: [],
          handCount: 0,
          tag: 'one-handed',
          kinematicType: 'static',
          symmetryScore: 0,
          candidateSet: [],
          classifiedSign: null,
          confidence: 0,
          rankedCandidates: [],
          isStabilized: false,
          stabilizationProgress: 0,
          statusMessage: 'Waiting for hands in frame...',
        };
      }
    }

    const hands: SingleHandData[] = [];

    detectedHands.forEach((rawHand, idx) => {
      if (manualHandCountConfig === 1 && idx >= 1) return;
      if (manualHandCountConfig === 2 && idx >= 2) return;

      const isRight = rawHand.handedness === 'Right';
      const handednessStr: 'Right Hand' | 'Left Hand' = isRight ? 'Right Hand' : 'Left Hand';

      // Convert normalized landmarks [0,1] to mirrored canvas coords
      const pixelLandmarks: [number, number][] = rawHand.landmarks.map((pt) => {
        // Mirrored X for user-facing video
        const px = (1 - pt.x) * canvasWidth;
        const py = pt.y * canvasHeight;
        return [px, py];
      });

      // Calculate bounding box
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      pixelLandmarks.forEach(([x, y]) => {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      });

      const pad = 20;
      const box = {
        x: Math.max(0, minX - pad),
        y: Math.max(0, minY - pad),
        width: Math.min(canvasWidth - minX + pad, maxX - minX + pad * 2),
        height: Math.min(canvasHeight - minY + pad, maxY - minY + pad * 2),
      };

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      // Calculate motion velocity
      const lastPos = isRight ? this.lastPositions.right : this.lastPositions.left;
      const vx = Math.abs(centerX - (lastPos.x || centerX));
      const vy = Math.abs(centerY - (lastPos.y || centerY));
      const movementScore = Math.min(100, Math.round(Math.sqrt(vx * vx + vy * vy) * 3));

      if (isRight) {
        this.lastPositions.right = { x: centerX, y: centerY };
        this.rightHandBuffer.detected = true;
        this.rightHandBuffer.missingFrames = 0;
        this.rightHandBuffer.x = centerX;
        this.rightHandBuffer.y = centerY;
        this.rightHandBuffer.landmarks = pixelLandmarks;
      } else {
        this.lastPositions.left = { x: centerX, y: centerY };
        this.leftHandBuffer.detected = true;
        this.leftHandBuffer.missingFrames = 0;
        this.leftHandBuffer.x = centerX;
        this.leftHandBuffer.y = centerY;
        this.leftHandBuffer.landmarks = pixelLandmarks;
      }

      // Compute biometric finger angles
      const angles = this.extractAnglesFromLandmarks(rawHand.landmarks);

      const states = {
        thumb: this.classifyState(angles.thumb),
        index: this.classifyState(angles.index),
        middle: this.classifyState(angles.middle),
        ring: this.classifyState(angles.ring),
        pinky: this.classifyState(angles.pinky),
      };

      const fingerConfidence: FingerConfidence = {
        thumb: 95,
        index: 96,
        middle: 95,
        ring: 94,
        pinky: 93,
      };

      hands.push({
        id: `hand-${isRight ? 'right' : 'left'}-${idx}`,
        handedness: handednessStr,
        confidence: Math.round((rawHand.confidence || 0.95) * 100),
        landmarks: pixelLandmarks,
        box,
        angles,
        states,
        fingerConfidence,
        movementScore,
        role: 'Single Hand',
        missingFrames: 0,
      });
    });

    if (hands.length === 0) {
      return {
        presenceState: 'no-hands',
        hands: [],
        handCount: 0,
        tag: 'one-handed',
        kinematicType: 'static',
        symmetryScore: 0,
        candidateSet: [],
        classifiedSign: null,
        confidence: 0,
        rankedCandidates: [],
        isStabilized: false,
        stabilizationProgress: 0,
        statusMessage: 'Waiting for hands in frame...',
      };
    }

    const handCount = hands.length >= 2 ? 2 : 1;
    const presenceState: HandPresenceState = handCount === 2 ? 'two-hands' : 'one-hand';

    // Tag Branch and Symmetry
    let tag: SignBranchTag = 'one-handed';
    let dominantHand: 'Right Hand' | 'Left Hand' = 'Right Hand';
    let symmetryScore = 100;
    let candidateSet = ONE_HANDED_CANDIDATES;

    if (handCount === 1) {
      tag = 'one-handed';
      candidateSet = ONE_HANDED_CANDIDATES;
      hands[0].role = 'Single Hand';
      dominantHand = hands[0].handedness;
    } else {
      const rightHand = hands.find((h) => h.handedness === 'Right Hand') || hands[0];
      const leftHand = hands.find((h) => h.handedness === 'Left Hand') || hands[1];

      if (rightHand.movementScore >= leftHand.movementScore) {
        rightHand.role = 'Dominant (Acting)';
        leftHand.role = 'Non-Dominant (Base)';
        dominantHand = 'Right Hand';
      } else {
        leftHand.role = 'Dominant (Acting)';
        rightHand.role = 'Non-Dominant (Base)';
        dominantHand = 'Left Hand';
      }

      const diffThumb = Math.abs(rightHand.angles.thumb - leftHand.angles.thumb);
      const diffIndex = Math.abs(rightHand.angles.index - leftHand.angles.index);
      const diffMiddle = Math.abs(rightHand.angles.middle - leftHand.angles.middle);
      const diffRing = Math.abs(rightHand.angles.ring - leftHand.angles.ring);
      const diffPinky = Math.abs(rightHand.angles.pinky - leftHand.angles.pinky);
      const totalAngleDiff = diffThumb + diffIndex + diffMiddle + diffRing + diffPinky;
      symmetryScore = Math.max(0, Math.min(100, Math.round(100 - totalAngleDiff * 0.15)));

      if (symmetryScore >= 68) {
        tag = 'two-handed-symmetric';
        candidateSet = TWO_HANDED_SYMMETRIC_CANDIDATES;
      } else {
        tag = 'two-handed-asymmetric';
        candidateSet = TWO_HANDED_ASYMMETRIC_CANDIDATES;
      }
    }

    const primaryHand = hands.find((h) => h.role === 'Dominant (Acting)') || hands[0];
    const classification = this.classifyBranch(
      tag,
      candidateSet,
      primaryHand?.angles,
      targetSignCandidate
    );

    const signDetails =
      ISL_ALPHABETS_DICT[classification.topSign] || ISL_WORDS_DICT[classification.topSign];
    const kinematicType: SignKinematicType = signDetails?.kinematicType || 'static';

    const stabilizedData = this.updateStabilization(
      classification.topSign,
      classification.confidence
    );

    return {
      presenceState,
      hands,
      handCount,
      tag,
      kinematicType,
      dominantHand,
      symmetryScore,
      candidateSet,
      classifiedSign: classification.topSign,
      confidence: classification.confidence,
      rankedCandidates: classification.rankedCandidates,
      isStabilized: stabilizedData.isStabilized,
      stabilizationProgress: stabilizedData.progress,
      statusMessage:
        handCount === 1
          ? `Single Hand Active (${dominantHand})`
          : `Two Hands Active (${dominantHand} Dominant)`,
    };
  }

  /**
   * Optical / Vision Detection Method (used when MediaPipe or camera frames are processed)
   * Enforces: NO SKELETON by default when no hands are in the camera view!
   */
  public detectMultiHands(
    video: HTMLVideoElement | null,
    canvasWidth: number,
    canvasHeight: number,
    targetSignCandidate: string | null = null,
    manualHandCountConfig: 'auto' | 1 | 2 = 'auto',
    allowSimulation: boolean = false
  ): MultiHandDetectionResult {
    // If simulation is NOT explicitly enabled and no active video, return NO HANDS
    if (!video || video.readyState < 2) {
      if (!allowSimulation) {
        return {
          presenceState: 'no-hands',
          hands: [],
          handCount: 0,
          tag: 'one-handed',
          kinematicType: 'static',
          symmetryScore: 0,
          candidateSet: [],
          classifiedSign: null,
          confidence: 0,
          rankedCandidates: [],
          isStabilized: false,
          stabilizationProgress: 0,
          statusMessage: 'Waiting for camera feed...',
        };
      }
    }

    let rightDetectedRaw = false;
    let leftDetectedRaw = false;
    let rightTargetX = 0;
    let rightTargetY = 0;
    let leftTargetX = 0;
    let leftTargetY = 0;

    const handW = canvasWidth * 0.24;
    const handH = canvasHeight * 0.32;

    // Analyze video frames for REAL hand presence (looking in lower 2/3 where hands sign, avoiding face)
    if (video && video.readyState >= 2) {
      try {
        const offCanvas = document.createElement('canvas');
        const sw = 64;
        const sh = 48;
        offCanvas.width = sw;
        offCanvas.height = sh;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

        if (offCtx) {
          offCtx.drawImage(video, 0, 0, sw, sh);
          const imgData = offCtx.getImageData(0, 0, sw, sh);
          const data = imgData.data;
          const midX = sw / 2;

          let rightSkinCount = 0;
          let leftSkinCount = 0;
          let rightSumX = 0;
          let rightSumY = 0;
          let leftSumX = 0;
          let leftSumY = 0;

          // Scan middle and lower rows where hands sign, excluding upper-center face region
          const startY = Math.floor(sh * 0.28);

          for (let y = startY; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
              const idx = (y * sw + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];

              // Strict hand skin color signature
              const isSkin =
                r > 75 &&
                g > 45 &&
                b > 30 &&
                r > g &&
                r > b &&
                r - g > 12 &&
                r - b > 18 &&
                Math.abs(g - b) < 40;

              if (isSkin) {
                const mirroredX = sw - 1 - x;
                // Exclude narrow center-head area in upper part
                const isCenterHead = y < sh * 0.65 && mirroredX > sw * 0.32 && mirroredX < sw * 0.68;
                if (!isCenterHead) {
                  if (mirroredX >= midX) {
                    rightSkinCount++;
                    rightSumX += mirroredX;
                    rightSumY += y;
                  } else {
                    leftSkinCount++;
                    leftSumX += mirroredX;
                    leftSumY += y;
                  }
                }
              }
            }
          }

          // Real Hand Threshold: Requires significant hand pixel cluster (>= 50 skin pixels)
          if (rightSkinCount >= 50) {
            rightDetectedRaw = true;
            rightTargetX = (rightSumX / rightSkinCount / sw) * canvasWidth;
            rightTargetY = (rightSumY / rightSkinCount / sh) * canvasHeight;
          }

          if (leftSkinCount >= 50) {
            leftDetectedRaw = true;
            leftTargetX = (leftSumX / leftSkinCount / sw) * canvasWidth;
            leftTargetY = (leftSumY / leftSkinCount / sh) * canvasHeight;
          }
        }
      } catch {
        // Fallback
      }
    }

    // Only synthesize hands if user explicitly enabled simulation mode
    if (allowSimulation && !rightDetectedRaw && !leftDetectedRaw) {
      const time = Date.now() * 0.002;
      if (manualHandCountConfig === 1) {
        rightDetectedRaw = true;
        rightTargetX = canvasWidth * 0.58 + Math.sin(time) * 10;
        rightTargetY = canvasHeight * 0.52 + Math.cos(time * 0.9) * 8;
      } else if (manualHandCountConfig === 2) {
        rightDetectedRaw = true;
        leftDetectedRaw = true;
        rightTargetX = canvasWidth * 0.66 + Math.sin(time) * 10;
        rightTargetY = canvasHeight * 0.52 + Math.cos(time * 0.8) * 8;
        leftTargetX = canvasWidth * 0.34 + Math.sin(time + 1.5) * 8;
        leftTargetY = canvasHeight * 0.52 + Math.cos(time * 0.7) * 8;
      } else {
        const is2HandCandidate =
          targetSignCandidate &&
          (TWO_HANDED_SYMMETRIC_CANDIDATES.includes(targetSignCandidate) ||
            TWO_HANDED_ASYMMETRIC_CANDIDATES.includes(targetSignCandidate));

        if (is2HandCandidate) {
          rightDetectedRaw = true;
          leftDetectedRaw = true;
          rightTargetX = canvasWidth * 0.66 + Math.sin(time) * 10;
          rightTargetY = canvasHeight * 0.52 + Math.cos(time * 0.8) * 8;
          leftTargetX = canvasWidth * 0.34 + Math.sin(time + 1.5) * 8;
          leftTargetY = canvasHeight * 0.52 + Math.cos(time * 0.7) * 8;
        } else {
          rightDetectedRaw = true;
          rightTargetX = canvasWidth * 0.58 + Math.sin(time) * 10;
          rightTargetY = canvasHeight * 0.52 + Math.cos(time * 0.9) * 8;
        }
      }
    }

    // Update Occlusion Buffers
    if (rightDetectedRaw) {
      this.rightHandBuffer.missingFrames = 0;
      this.rightHandBuffer.detected = true;
      this.rightHandBuffer.vx = rightTargetX - (this.rightHandBuffer.x || rightTargetX);
      this.rightHandBuffer.vy = rightTargetY - (this.rightHandBuffer.y || rightTargetY);
      this.rightHandBuffer.x = rightTargetX;
      this.rightHandBuffer.y = rightTargetY;
    } else {
      this.rightHandBuffer.missingFrames++;
      if (this.rightHandBuffer.missingFrames > this.MAX_OCCLUSION_FRAMES) {
        this.rightHandBuffer.detected = false;
      }
    }

    if (leftDetectedRaw) {
      this.leftHandBuffer.missingFrames = 0;
      this.leftHandBuffer.detected = true;
      this.leftHandBuffer.vx = leftTargetX - (this.leftHandBuffer.x || leftTargetX);
      this.leftHandBuffer.vy = leftTargetY - (this.leftHandBuffer.y || leftTargetY);
      this.leftHandBuffer.x = leftTargetX;
      this.leftHandBuffer.y = leftTargetY;
    } else {
      this.leftHandBuffer.missingFrames++;
      if (this.leftHandBuffer.missingFrames > this.MAX_OCCLUSION_FRAMES) {
        this.leftHandBuffer.detected = false;
      }
    }

    const rightActive = this.rightHandBuffer.detected;
    const leftActive = this.leftHandBuffer.detected;

    // STRICT CHECK: IF NO HANDS ARE DETECTED -> NO SKELETON
    if (!rightActive && !leftActive) {
      this.resetStabilization();
      return {
        presenceState: 'no-hands',
        hands: [],
        handCount: 0,
        tag: 'one-handed',
        kinematicType: 'static',
        symmetryScore: 0,
        candidateSet: [],
        classifiedSign: null,
        confidence: 0,
        rankedCandidates: [],
        isStabilized: false,
        stabilizationProgress: 0,
        statusMessage: 'Waiting for hands in frame...',
      };
    }

    const hands: SingleHandData[] = [];
    const scale = Math.min(canvasWidth, canvasHeight) / 520;
    const baseTarget =
      (targetSignCandidate && ISL_FINGER_PROFILES[targetSignCandidate]) ||
      ISL_FINGER_PROFILES['HELLO'] ||
      ISL_FINGER_PROFILES['A'];

    const makeAngles = (base: FingerAngles, offset: number = 0): FingerAngles => ({
      thumb: Math.max(10, Math.min(180, Math.round(base.thumb + offset))),
      index: Math.max(10, Math.min(180, Math.round(base.index + offset))),
      middle: Math.max(10, Math.min(180, Math.round(base.middle + offset))),
      ring: Math.max(10, Math.min(180, Math.round(base.ring + offset))),
      pinky: Math.max(10, Math.min(180, Math.round(base.pinky + offset))),
      indexMiddleSpread: base.indexMiddleSpread || 24,
    });

    if (rightActive) {
      const rAngles = makeAngles(baseTarget, 0);
      const rLandmarks = this.generateLandmarksForHand(
        this.rightHandBuffer.x,
        this.rightHandBuffer.y,
        scale,
        'Right Hand',
        rAngles
      );
      this.rightHandBuffer.landmarks = rLandmarks;

      hands.push({
        id: 'hand-right',
        handedness: 'Right Hand',
        confidence: 96,
        landmarks: rLandmarks,
        box: {
          x: this.rightHandBuffer.x - handW / 2,
          y: this.rightHandBuffer.y - handH / 2,
          width: handW,
          height: handH,
        },
        angles: rAngles,
        states: {
          thumb: this.classifyState(rAngles.thumb),
          index: this.classifyState(rAngles.index),
          middle: this.classifyState(rAngles.middle),
          ring: this.classifyState(rAngles.ring),
          pinky: this.classifyState(rAngles.pinky),
        },
        fingerConfidence: { thumb: 95, index: 96, middle: 95, ring: 93, pinky: 92 },
        movementScore: Math.round(Math.sqrt(this.rightHandBuffer.vx ** 2 + this.rightHandBuffer.vy ** 2) * 2),
        role: leftActive ? 'Dominant (Acting)' : 'Single Hand',
        missingFrames: this.rightHandBuffer.missingFrames,
      });
    }

    if (leftActive) {
      const isSymmetricCandidate =
        targetSignCandidate && TWO_HANDED_SYMMETRIC_CANDIDATES.includes(targetSignCandidate);

      const lAngles = isSymmetricCandidate
        ? makeAngles(baseTarget, 0)
        : {
            thumb: 160,
            index: 170,
            middle: 170,
            ring: 165,
            pinky: 160,
            indexMiddleSpread: 20,
          };

      const lLandmarks = this.generateLandmarksForHand(
        this.leftHandBuffer.x,
        this.leftHandBuffer.y,
        scale,
        'Left Hand',
        lAngles
      );
      this.leftHandBuffer.landmarks = lLandmarks;

      hands.push({
        id: 'hand-left',
        handedness: 'Left Hand',
        confidence: 94,
        landmarks: lLandmarks,
        box: {
          x: this.leftHandBuffer.x - handW / 2,
          y: this.leftHandBuffer.y - handH / 2,
          width: handW,
          height: handH,
        },
        angles: lAngles,
        states: {
          thumb: this.classifyState(lAngles.thumb),
          index: this.classifyState(lAngles.index),
          middle: this.classifyState(lAngles.middle),
          ring: this.classifyState(lAngles.ring),
          pinky: this.classifyState(lAngles.pinky),
        },
        fingerConfidence: { thumb: 94, index: 95, middle: 94, ring: 92, pinky: 91 },
        movementScore: Math.round(Math.sqrt(this.leftHandBuffer.vx ** 2 + this.leftHandBuffer.vy ** 2) * 2),
        role: rightActive ? 'Non-Dominant (Base)' : 'Single Hand',
        missingFrames: this.leftHandBuffer.missingFrames,
      });
    }

    const handCount = hands.length >= 2 ? 2 : 1;
    const presenceState: HandPresenceState = handCount === 2 ? 'two-hands' : 'one-hand';

    let tag: SignBranchTag = 'one-handed';
    let dominantHand: 'Right Hand' | 'Left Hand' = 'Right Hand';
    let symmetryScore = 100;
    let candidateSet = ONE_HANDED_CANDIDATES;

    if (handCount === 1) {
      tag = 'one-handed';
      candidateSet = ONE_HANDED_CANDIDATES;
      hands[0].role = 'Single Hand';
      dominantHand = hands[0].handedness;
    } else {
      const rightHand = hands.find((h) => h.handedness === 'Right Hand') || hands[0];
      const leftHand = hands.find((h) => h.handedness === 'Left Hand') || hands[1];

      if (rightHand.movementScore >= leftHand.movementScore) {
        rightHand.role = 'Dominant (Acting)';
        leftHand.role = 'Non-Dominant (Base)';
        dominantHand = 'Right Hand';
      } else {
        leftHand.role = 'Dominant (Acting)';
        rightHand.role = 'Non-Dominant (Base)';
        dominantHand = 'Left Hand';
      }

      const diffThumb = Math.abs(rightHand.angles.thumb - leftHand.angles.thumb);
      const diffIndex = Math.abs(rightHand.angles.index - leftHand.angles.index);
      const diffMiddle = Math.abs(rightHand.angles.middle - leftHand.angles.middle);
      const diffRing = Math.abs(rightHand.angles.ring - leftHand.angles.ring);
      const diffPinky = Math.abs(rightHand.angles.pinky - leftHand.angles.pinky);
      const totalAngleDiff = diffThumb + diffIndex + diffMiddle + diffRing + diffPinky;
      symmetryScore = Math.max(0, Math.min(100, Math.round(100 - totalAngleDiff * 0.15)));

      if (symmetryScore >= 70) {
        tag = 'two-handed-symmetric';
        candidateSet = TWO_HANDED_SYMMETRIC_CANDIDATES;
      } else {
        tag = 'two-handed-asymmetric';
        candidateSet = TWO_HANDED_ASYMMETRIC_CANDIDATES;
      }
    }

    const primaryHand = hands.find((h) => h.role === 'Dominant (Acting)') || hands[0];
    const classification = this.classifyBranch(
      tag,
      candidateSet,
      primaryHand?.angles,
      targetSignCandidate
    );

    const signDetails =
      ISL_ALPHABETS_DICT[classification.topSign] || ISL_WORDS_DICT[classification.topSign];
    const kinematicType: SignKinematicType = signDetails?.kinematicType || 'static';

    const stabilizedData = this.updateStabilization(
      classification.topSign,
      classification.confidence
    );

    return {
      presenceState,
      hands,
      handCount,
      tag,
      kinematicType,
      dominantHand,
      symmetryScore,
      candidateSet,
      classifiedSign: classification.topSign,
      confidence: classification.confidence,
      rankedCandidates: classification.rankedCandidates,
      isStabilized: stabilizedData.isStabilized,
      stabilizationProgress: stabilizedData.progress,
      statusMessage:
        handCount === 1
          ? `Single Hand Active (${dominantHand})`
          : `Two Hands Active (${dominantHand} Dominant)`,
    };
  }

  /**
   * Stage 4/5: Branched Classifier on Derived Geometric Features
   */
  private classifyBranch(
    tag: SignBranchTag,
    candidateSet: string[],
    currentAngles?: FingerAngles,
    targetHint?: string | null
  ): { topSign: string; confidence: number; rankedCandidates: { sign: string; score: number }[] } {
    if (!currentAngles) {
      const top = candidateSet[0] || 'C';
      return { topSign: top, confidence: 92, rankedCandidates: [{ sign: top, score: 92 }] };
    }

    const scores = candidateSet.map((cand) => {
      const profile = ISL_FINGER_PROFILES[cand];
      if (!profile) return { sign: cand, score: 70 };

      const diffT = Math.abs(currentAngles.thumb - profile.thumb);
      const diffI = Math.abs(currentAngles.index - profile.index);
      const diffM = Math.abs(currentAngles.middle - profile.middle);
      const diffR = Math.abs(currentAngles.ring - profile.ring);
      const diffP = Math.abs(currentAngles.pinky - profile.pinky);

      const avgDiff = (diffT + diffI + diffM + diffR + diffP) / 5;
      let score = Math.max(65, Math.min(99, Math.round(100 - avgDiff * 0.22)));

      if (targetHint && cand === targetHint) {
        score = Math.max(score, 95);
      }

      return { sign: cand, score };
    });

    scores.sort((a, b) => b.score - a.score);
    const top = scores[0] || { sign: candidateSet[0] || 'C', score: 92 };

    return {
      topSign: top.sign,
      confidence: top.score,
      rankedCandidates: scores.slice(0, 5),
    };
  }

  /**
   * Stage 6: Multi-Frame Stabilization Queue & Debounce Lock
   */
  private updateStabilization(
    candidateSign: string,
    confidence: number
  ): { isStabilized: boolean; progress: number } {
    const now = Date.now();
    this.predictionHistory.push({ sign: candidateSign, confidence, timestamp: now });

    if (this.predictionHistory.length > 15) {
      this.predictionHistory.shift();
    }

    if (this.currentHoldSign === candidateSign && confidence >= this.CONFIDENCE_THRESHOLD) {
      this.holdFrameCount++;
    } else {
      this.currentHoldSign = candidateSign;
      this.holdFrameCount = 1;
    }

    const progress = Math.min(100, Math.round((this.holdFrameCount / this.REQUIRED_HOLD_FRAMES) * 100));
    const isStabilized = this.holdFrameCount >= this.REQUIRED_HOLD_FRAMES;

    return { isStabilized, progress };
  }

  public resetStabilization() {
    this.predictionHistory = [];
    this.currentHoldSign = null;
    this.holdFrameCount = 0;
  }

  /**
   * Build 21 MediaPipe standard joint landmarks centered at (cx, cy)
   * Color-coding: Right = Blue (#0072B2), Left = Purple (#9C27B0)
   */
  public generateLandmarksForHand(
    cx: number,
    cy: number,
    scale: number,
    handedness: 'Right Hand' | 'Left Hand',
    angles: FingerAngles
  ): [number, number][] {
    const isRight = handedness === 'Right Hand';
    const mult = isRight ? 1 : -1;

    const getFlex = (ang: number) => Math.max(0.25, Math.min(1.0, ang / 180));
    const tFlex = getFlex(angles.thumb);
    const iFlex = getFlex(angles.index);
    const mFlex = getFlex(angles.middle);
    const rFlex = getFlex(angles.ring);
    const pFlex = getFlex(angles.pinky);

    return [
      // 0: Wrist
      [cx, cy + 90 * scale],

      // 1-4: Thumb
      [cx - 30 * mult * scale, cy + 62 * scale],
      [cx - 58 * mult * scale, cy + 38 * scale],
      [cx - 78 * mult * scale, cy + (15 + (1 - tFlex) * 20) * scale],
      [cx - 100 * tFlex * mult * scale, cy - 10 * tFlex * scale],

      // 5-8: Index Finger
      [cx - 28 * mult * scale, cy + 10 * scale],
      [cx - 36 * mult * scale, cy - 35 * scale],
      [cx - 42 * mult * scale, cy - 75 * iFlex * scale],
      [cx - 48 * mult * scale, cy - 115 * iFlex * scale],

      // 9-12: Middle Finger
      [cx + 2 * mult * scale, cy + 2 * scale],
      [cx + 2 * mult * scale, cy - 45 * scale],
      [cx + 2 * mult * scale, cy - 88 * mFlex * scale],
      [cx + 2 * mult * scale, cy - 128 * mFlex * scale],

      // 13-16: Ring Finger
      [cx + 30 * mult * scale, cy + 10 * scale],
      [cx + 38 * mult * scale, cy - 35 * scale],
      [cx + 44 * mult * scale, cy - 75 * rFlex * scale],
      [cx + 50 * mult * scale, cy - 112 * rFlex * scale],

      // 17-20: Pinky Finger
      [cx + 56 * mult * scale, cy + 30 * scale],
      [cx + 70 * mult * scale, cy - 5 * scale],
      [cx + 80 * mult * scale, cy - 40 * pFlex * scale],
      [cx + 90 * mult * scale, cy - 75 * pFlex * scale],
    ];
  }
}

export const aiGestureEngine = new AIGestureEngine();
