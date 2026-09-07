import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  Activity,
  RefreshCw,
  Lock,
  UserCheck,
  UserX,
  Scan,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
// Safe MediaPipe globals with browser fallbacks
const Holistic: any = typeof window !== 'undefined' ? (window as any).Holistic || null : null;
const Hands: any = typeof window !== 'undefined' ? (window as any).Hands || null : null;
import { ISL_ALPHABETS_DICT, ISL_WORDS_DICT } from '../data/islDictionary';
import {
  aiGestureEngine,
  RawMediaPipeHandData,
  RawMediaPipeLandmark,
} from '../utils/aiGestureEngine';
import {
  HandTelemetry,
  MultiHandDetectionResult,
  SingleHandData,
  SignBranchTag
} from '../types';

export type UserLockState = 'idle' | 'calibrating' | 'locked' | 'grace_period';

interface LockedUserReference {
  cx: number;
  cy: number;
  width: number;
  height: number;
  lastSeen: number;
}

interface LiveCameraViewportProps {
  onSignRecognized?: (result: {
    sign: string;
    confidence: number;
    type: 'word' | 'alphabet';
    tag: SignBranchTag;
    handCount: 1 | 2;
    telemetry: HandTelemetry;
    isStabilized: boolean;
  }) => void;
  targetSign?: string | null;
  viewportTitle?: string;
  accentColor?: string;
}

export const LiveCameraViewport: React.FC<LiveCameraViewportProps> = ({
  onSignRecognized,
  targetSign = null,
  viewportTitle = 'Live AI Camera Viewport',
  accentColor = '#0072B2',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Vision Pipeline Instances
  const holisticInstanceRef = useRef<Holistic | null>(null);
  const handsFallbackRef = useRef<Hands | null>(null);
  const isProcessingFrameRef = useRef(false);
  const isSimulationActiveRef = useRef(false);

  // Single-User Lock-On In-Memory Session References (NO biometric storage)
  const lockedRef = useRef<LockedUserReference | null>(null);
  const calibrationStartTimeRef = useRef<number>(0);
  const bestCalibrationCandidateRef = useRef<{
    cx: number;
    cy: number;
    width: number;
    height: number;
    score: number;
  } | null>(null);

  // Latest extracted hands for the LOCKED user ONLY
  const latestLockedHandsRef = useRef<RawMediaPipeHandData[]>([]);
  const hasFreshHandDataRef = useRef(false);

  // UI States
  const [isCapturing, setIsCapturing] = useState(false);
  const [userLockStatus, setUserLockStatus] = useState<UserLockState>('idle');
  const [calibrationCountdown, setCalibrationCountdown] = useState<number>(2);
  const [graceCountdown, setGraceCountdown] = useState<number>(3);
  const [handCountMode] = useState<'auto' | 1 | 2>('auto');
  const [showTelemetryDetails, setShowTelemetryDetails] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Camera Idle — Click "Start Multi-Hand Camera" to begin');
  const [simIndex, setSimIndex] = useState(0);

  // Classification State
  const [latestResult, setLatestResult] = useState<MultiHandDetectionResult | null>(null);

  const allSignsList = useRef<string[]>([
    ...Object.keys(ISL_WORDS_DICT),
    ...Object.keys(ISL_ALPHABETS_DICT),
  ]);

  const candidateRef = useRef<string | null>(null);
  const lastCommittedSignRef = useRef<string | null>(null);
  const lastCommitTimeRef = useRef<number>(0);

  // Calibration Window Duration: 2000ms (~2s)
  const CALIBRATION_DURATION_MS = 2000;
  // Grace Period Duration when locked user leaves frame: 3500ms (~3.5s)
  const GRACE_PERIOD_MS = 3500;
  // Maximum normalized spatial distance tolerance for natural posture movement
  const MAX_SPATIAL_DISPLACEMENT = 0.38;

  // Resize canvas according to container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width || 640;
      canvas.height = rect.height || 480;
    }
  }, []);

  /**
   * Reset the user lock session and trigger fresh 2-second calibration
   */
  const resetUserLock = useCallback(() => {
    lockedRef.current = null;
    bestCalibrationCandidateRef.current = null;
    calibrationStartTimeRef.current = Date.now();
    latestLockedHandsRef.current = [];
    hasFreshHandDataRef.current = false;
    setUserLockStatus('calibrating');
    setCalibrationCountdown(2);
    aiGestureEngine.resetStabilization();
    setStatusMessage('Detecting user... Face the camera to begin');
  }, []);

  /**
   * Evaluate a detected person's upper body pose during calibration.
   * Selects the largest and most centered user in frame.
   */
  const evaluateCalibrationFrame = (
    cx: number,
    cy: number,
    width: number,
    height: number
  ) => {
    const distToCenter = Math.hypot(cx - 0.5, cy - 0.5);
    const area = Math.max(0.01, width * height);
    // Center-biased area ranking: prioritizes the primary person directly in front of camera
    const score = area / (1.0 + distToCenter * 2.8);

    const prevBest = bestCalibrationCandidateRef.current;
    if (!prevBest || score > prevBest.score) {
      bestCalibrationCandidateRef.current = { cx, cy, width, height, score };
    }
  };

  /**
   * Draw individual 21-landmark hand skeleton
   * RIGHT Hand: Blue (#0072B2)
   * LEFT Hand: Purple (#9C27B0)
   */
  const drawSingleHandSkeleton = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      hand: SingleHandData,
      isDominant: boolean,
      isStabilized: boolean
    ) => {
      const landmarks = hand.landmarks;
      if (!landmarks || landmarks.length < 21) return;

      const isRight = hand.handedness === 'Right Hand';
      const handBaseColor = isRight ? '#0072B2' : '#9C27B0';
      const handGlowColor = isRight ? 'rgba(0, 114, 178, 0.4)' : 'rgba(156, 39, 176, 0.4)';
      const accentHighlight = isStabilized ? '#00E676' : isRight ? '#56B4E9' : '#CE93D8';

      // 1. Draw Bounding Box with Corner Reticles
      const pad = 14;
      const bx = Math.max(8, hand.box.x - pad);
      const by = Math.max(8, hand.box.y - pad);
      const bw = Math.min(w - bx - 8, hand.box.width + pad * 2);
      const bh = Math.min(h - by - 8, hand.box.height + pad * 2);

      ctx.strokeStyle = handBaseColor;
      ctx.lineWidth = isDominant ? 2.5 : 1.8;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.setLineDash([]);

      // Corner reticles
      const cornerLen = 14;
      ctx.lineWidth = 3;
      ctx.strokeStyle = isStabilized ? '#00E676' : handBaseColor;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(bx, by + cornerLen);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + cornerLen, by);
      // Top-Right
      ctx.moveTo(bx + bw - cornerLen, by);
      ctx.lineTo(bx + bw, by);
      ctx.lineTo(bx + bw, by + cornerLen);
      // Bottom-Left
      ctx.moveTo(bx, by + bh - cornerLen);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx + cornerLen, by + bh);
      // Bottom-Right
      ctx.moveTo(bx + bw - cornerLen, by + bh);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx + bw, by + bh - cornerLen);
      ctx.stroke();

      // Hand Role Badge Banner above Box
      ctx.fillStyle = handBaseColor;
      const badgeWidth = Math.min(bw, 190);
      ctx.fillRect(bx, Math.max(0, by - 24), badgeWidth, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px system-ui, sans-serif';
      const roleText = hand.role === 'Single Hand' ? 'SINGLE HAND' : hand.role;
      ctx.fillText(
        `${isRight ? '✋ RIGHT (BLUE)' : '🤚 LEFT (PURPLE)'} • ${roleText}`,
        bx + 6,
        Math.max(14, by - 9)
      );

      // 2. Palm Root Connections
      ctx.strokeStyle = handBaseColor;
      ctx.lineWidth = isDominant ? 3.5 : 2.5;
      ctx.beginPath();
      [1, 5, 9, 13, 17].forEach((idx) => {
        ctx.moveTo(landmarks[0][0], landmarks[0][1]);
        ctx.lineTo(landmarks[idx][0], landmarks[idx][1]);
      });
      // Palm knuckle bridge
      ctx.moveTo(landmarks[5][0], landmarks[5][1]);
      ctx.lineTo(landmarks[9][0], landmarks[9][1]);
      ctx.lineTo(landmarks[13][0], landmarks[13][1]);
      ctx.lineTo(landmarks[17][0], landmarks[17][1]);
      ctx.stroke();

      // 3. 5 Finger Bones
      const chains = [
        [1, 2, 3, 4], // Thumb
        [5, 6, 7, 8], // Index
        [9, 10, 11, 12], // Middle
        [13, 14, 15, 16], // Ring
        [17, 18, 19, 20], // Pinky
      ];

      chains.forEach((chain) => {
        ctx.strokeStyle = accentHighlight;
        ctx.lineWidth = isDominant ? 4 : 3;
        ctx.beginPath();
        for (let i = 0; i < chain.length - 1; i++) {
          const from = landmarks[chain[i]];
          const to = landmarks[chain[i + 1]];
          ctx.moveTo(from[0], from[1]);
          ctx.lineTo(to[0], to[1]);
        }
        ctx.stroke();
      });

      // 4. 21 Joint Landmark Nodes
      landmarks.forEach((pt, idx) => {
        const isTip = [4, 8, 12, 16, 20].includes(idx);
        const isWrist = idx === 0;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], isTip ? 6.5 : isWrist ? 7 : 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isStabilized ? '#009E73' : handBaseColor;
        ctx.stroke();

        // Pulsing tip halos
        if (isTip) {
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], 10, 0, Math.PI * 2);
          ctx.strokeStyle = isStabilized ? 'rgba(0, 230, 118, 0.7)' : handGlowColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    },
    []
  );

  /**
   * Main Render Loop & Single-User Lock-On Verification
   */
  const renderLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw mirrored video feed
    if (video && video.readyState >= 2) {
      ctx.save();
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, w, h);
      ctx.restore();

      // Trigger MediaPipe Holistic frame processing
      if (!isProcessingFrameRef.current) {
        if (holisticInstanceRef.current) {
          isProcessingFrameRef.current = true;
          holisticInstanceRef.current
            .send({ image: video })
            .catch(() => {})
            .finally(() => {
              isProcessingFrameRef.current = false;
            });
        } else if (handsFallbackRef.current) {
          isProcessingFrameRef.current = true;
          handsFallbackRef.current
            .send({ image: video })
            .catch(() => {})
            .finally(() => {
              isProcessingFrameRef.current = false;
            });
        }
      }
    } else {
      ctx.fillStyle = '#0D1117';
      ctx.fillRect(0, 0, w, h);
    }

    const now = Date.now();

    // 2. Lock-On State Machine & Calibration Management
    if (userLockStatus === 'calibrating') {
      const elapsed = now - calibrationStartTimeRef.current;
      const remainingSec = Math.max(0, Math.ceil((CALIBRATION_DURATION_MS - elapsed) / 1000));
      setCalibrationCountdown(remainingSec);

      // Draw subtle calibration scanning crosshairs/guide
      ctx.strokeStyle = 'rgba(0, 114, 178, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(w * 0.2, h * 0.15, w * 0.6, h * 0.7);
      ctx.setLineDash([]);

      // Transition to locked once calibration window completes and candidate is found
      if (elapsed >= CALIBRATION_DURATION_MS) {
        const candidate = bestCalibrationCandidateRef.current;
        if (candidate) {
          lockedRef.current = {
            cx: candidate.cx,
            cy: candidate.cy,
            width: candidate.width,
            height: candidate.height,
            lastSeen: now,
          };
          setUserLockStatus('locked');
          setStatusMessage('Tracking active — Single user locked');
        } else {
          // If no user was in frame during calibration, lock onto center reference
          lockedRef.current = {
            cx: 0.5,
            cy: 0.45,
            width: 0.35,
            height: 0.45,
            lastSeen: now,
          };
          setUserLockStatus('locked');
          setStatusMessage('Tracking active — Single user locked');
        }
      }
    } else if (userLockStatus === 'locked' || userLockStatus === 'grace_period') {
      // Check if locked user left frame
      if (lockedRef.current) {
        const timeSinceLastSeen = now - lockedRef.current.lastSeen;
        if (timeSinceLastSeen > GRACE_PERIOD_MS) {
          // Grace period expired: release lock and return to calibration
          resetUserLock();
        } else if (timeSinceLastSeen > 1000) {
          setUserLockStatus('grace_period');
          const remainingGrace = Math.max(1, Math.ceil((GRACE_PERIOD_MS - timeSinceLastSeen) / 1000));
          setGraceCountdown(remainingGrace);
          setStatusMessage(`User out of frame — Resetting lock in ${remainingGrace}s`);
        } else if (userLockStatus === 'grace_period') {
          setUserLockStatus('locked');
          setStatusMessage('Tracking active — Single user locked');
        }
      }
    }

    // 3. Target candidate evaluation
    const candidate =
      targetSign ||
      candidateRef.current ||
      allSignsList.current[simIndex % allSignsList.current.length] ||
      'HELLO';

    // 4. Multi-Hand Detection & 6-Stage Pipeline (ONLY for LOCKED person)
    let result: MultiHandDetectionResult;

    if (userLockStatus === 'locked' && hasFreshHandDataRef.current) {
      // Process real detected MediaPipe hands for the locked user
      result = aiGestureEngine.processRealHands(
        latestLockedHandsRef.current,
        w,
        h,
        candidate,
        handCountMode
      );
    } else if (isSimulationActiveRef.current) {
      // Virtual test hands
      result = aiGestureEngine.detectMultiHands(
        video,
        w,
        h,
        candidate,
        handCountMode,
        true
      );
    } else {
      // Empty result if calibrating or no hands for locked person
      result = {
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
        statusMessage: userLockStatus === 'calibrating' ? 'Detecting user...' : 'Waiting for hands in frame...',
      };
    }

    setLatestResult(result);

    // 5. Draw Visual Skeleton Layer ONLY for the locked user's verified hands
    if (result.presenceState !== 'no-hands' && result.hands && result.hands.length > 0) {
      result.hands.forEach((hand) => {
        const isDominant = hand.role === 'Dominant (Acting)' || hand.role === 'Single Hand';
        drawSingleHandSkeleton(ctx, w, h, hand, isDominant, result.isStabilized);
      });
    }

    // 6. Stage 5: Confidence-Gated Lock & Dispatch
    if (
      userLockStatus === 'locked' &&
      result.presenceState !== 'no-hands' &&
      result.isStabilized &&
      result.confidence >= 86 &&
      result.classifiedSign
    ) {
      const signToCommit = result.classifiedSign;
      const isDifferent = lastCommittedSignRef.current !== signToCommit;
      const isCoolDownExpired = now - lastCommitTimeRef.current > 1200;

      if ((isDifferent || isCoolDownExpired) && onSignRecognized) {
        lastCommittedSignRef.current = signToCommit;
        lastCommitTimeRef.current = now;

        const primaryHand =
          result.hands.find((h) => h.role === 'Dominant (Acting)') || result.hands[0];

        if (primaryHand) {
          onSignRecognized({
            sign: signToCommit,
            confidence: result.confidence,
            type: ISL_WORDS_DICT[signToCommit] ? 'word' : 'alphabet',
            tag: result.tag,
            handCount: result.handCount || 1,
            telemetry: {
              angles: primaryHand.angles,
              states: primaryHand.states,
              fingerConfidence: primaryHand.fingerConfidence,
              handedness: primaryHand.handedness,
              confidence: result.confidence,
              handPosition: {
                x: primaryHand.box.x,
                y: primaryHand.box.y,
                width: primaryHand.box.width,
                height: primaryHand.box.height,
                detected: true,
              },
              branchTag: result.tag,
              handCount: result.handCount,
            },
            isStabilized: true,
          });
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(renderLoop);
  }, [targetSign, simIndex, handCountMode, drawSingleHandSkeleton, onSignRecognized, userLockStatus, resetUserLock]);

  // Start webcam with MediaPipe Holistic Single-Person Engine
  const startCamera = async () => {
    setStatusMessage('⌛ Initializing Single-User Vision Pipeline...');
    isSimulationActiveRef.current = false;
    hasFreshHandDataRef.current = false;
    latestLockedHandsRef.current = [];

    // Initialize 2-second calibration
    lockedRef.current = null;
    bestCalibrationCandidateRef.current = null;
    calibrationStartTimeRef.current = Date.now();
    setUserLockStatus('calibrating');
    setCalibrationCountdown(2);

    try {
      // 1. Initialize MediaPipe Holistic Pipeline (tracks pose + face + leftHand + rightHand on single person)
      try {
        const holistic = new Holistic({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
        });

        holistic.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          refineFaceLandmarks: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        holistic.onResults((results: HolisticResults) => {
          const now = Date.now();
          const detected: RawMediaPipeHandData[] = [];

          // Derive upper body reference from poseLandmarks or faceLandmarks
          let personPresent = false;
          let personCx = 0.5;
          let personCy = 0.45;
          let personWidth = 0.35;
          let personHeight = 0.45;

          if (results.poseLandmarks && results.poseLandmarks.length >= 13) {
            personPresent = true;
            const nose = results.poseLandmarks[0];
            const leftShoulder = results.poseLandmarks[11];
            const rightShoulder = results.poseLandmarks[12];

            personCx = (nose.x + leftShoulder.x + rightShoulder.x) / 3;
            personCy = (nose.y + leftShoulder.y + rightShoulder.y) / 3;
            personWidth = Math.max(0.15, Math.abs(leftShoulder.x - rightShoulder.x) * 1.6);
            personHeight = Math.max(0.2, Math.abs(personCy - nose.y) * 2.5);
          } else if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            personPresent = true;
            const nose = results.faceLandmarks[1] || results.faceLandmarks[0];
            personCx = nose.x;
            personCy = nose.y;
          }

          // Calibration Phase: Select the largest & most centered user
          if (lockedRef.current === null) {
            if (personPresent) {
              evaluateCalibrationFrame(personCx, personCy, personWidth, personHeight);
            }
          } else {
            // Locked Phase: Spatial Continuity Check (Only process locked person's hands)
            if (personPresent) {
              const currentLocked = lockedRef.current;
              const dist = Math.hypot(personCx - currentLocked.cx, personCy - currentLocked.cy);

              if (dist <= MAX_SPATIAL_DISPLACEMENT) {
                // Spatial continuity satisfied: smooth update session position
                currentLocked.cx = 0.85 * currentLocked.cx + 0.15 * personCx;
                currentLocked.cy = 0.85 * currentLocked.cy + 0.15 * personCy;
                currentLocked.lastSeen = now;

                // Extract ONLY the locked person's hands from Holistic
                // Mirrored coordinate handling:
                // Subject's Right Hand = results.rightHandLandmarks
                if (results.rightHandLandmarks && results.rightHandLandmarks.length === 21) {
                  detected.push({
                    landmarks: results.rightHandLandmarks as RawMediaPipeLandmark[],
                    handedness: 'Right',
                    confidence: 0.95,
                  });
                }

                // Subject's Left Hand = results.leftHandLandmarks
                if (results.leftHandLandmarks && results.leftHandLandmarks.length === 21) {
                  detected.push({
                    landmarks: results.leftHandLandmarks as RawMediaPipeLandmark[],
                    handedness: 'Left',
                    confidence: 0.95,
                  });
                }
              }
            }
          }

          latestLockedHandsRef.current = detected;
          hasFreshHandDataRef.current = true;
        });

        holisticInstanceRef.current = holistic;
      } catch (holisticErr) {
        console.warn('Holistic setup note, initializing hands fallback:', holisticErr);

        // Fallback to Hands with spatial locking
        const hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: MPResults) => {
          const now = Date.now();
          const detected: RawMediaPipeHandData[] = [];

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            if (lockedRef.current) {
              lockedRef.current.lastSeen = now;
            }

            results.multiHandLandmarks.forEach((lms, idx) => {
              const handednessLabel =
                results.multiHandedness?.[idx]?.label || (idx === 0 ? 'Left' : 'Right');
              const handedness: 'Right' | 'Left' = handednessLabel === 'Left' ? 'Right' : 'Left';
              detected.push({
                landmarks: lms as RawMediaPipeLandmark[],
                handedness,
                confidence: results.multiHandedness?.[idx]?.score || 0.95,
              });
            });
          }

          latestLockedHandsRef.current = detected;
          hasFreshHandDataRef.current = true;
        });

        handsFallbackRef.current = hands;
      }

      // 2. Start Video Stream
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      }

      setIsCapturing(true);
      resizeCanvas();
    } catch (err) {
      console.warn('Webcam initialization notice:', err);
      setIsCapturing(true);
      resizeCanvas();
    }
  };

  // Stop camera
  const stopCamera = () => {
    setIsCapturing(false);
    setUserLockStatus('idle');
    setStatusMessage('Camera Idle — Click "Start Multi-Hand Camera" to begin');
    aiGestureEngine.resetStabilization();
    isSimulationActiveRef.current = false;
    hasFreshHandDataRef.current = false;
    latestLockedHandsRef.current = [];
    lockedRef.current = null;
    bestCalibrationCandidateRef.current = null;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (holisticInstanceRef.current) {
      try {
        holisticInstanceRef.current.close();
      } catch {}
      holisticInstanceRef.current = null;
    }

    if (handsFallbackRef.current) {
      try {
        handsFallbackRef.current.close();
      } catch {}
      handsFallbackRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Trigger test gesture switch (enables test simulation if user clicks it)
  const triggerTestGesture = (specificSign?: string) => {
    isSimulationActiveRef.current = true;
    if (!isCapturing) {
      setIsCapturing(true);
      setUserLockStatus('locked');
      resizeCanvas();
    }
    if (specificSign) {
      candidateRef.current = specificSign;
    } else {
      setSimIndex((prev) => prev + 1);
    }
    aiGestureEngine.resetStabilization();
    lastCommittedSignRef.current = null;
    setStatusMessage('🟡 Test Virtual Hands Active — Right (Blue) & Left (Purple)');
  };

  useEffect(() => {
    if (isCapturing) {
      animFrameRef.current = requestAnimationFrame(renderLoop);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isCapturing, renderLoop]);

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const activeHand =
    latestResult?.hands.find((h) => h.role === 'Dominant (Acting)') ||
    latestResult?.hands[0];

  return (
    <div className="w-full space-y-4">
      {/* Hand Telemetry & Single-User Lock-On Legend Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs flex-wrap">
        {/* Left: Hand Color Legend */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200">
          <span className="inline-flex items-center gap-1.5 text-[#0072B2]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0072B2]"></span> Right (Blue)
          </span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center gap-1.5 text-[#9C27B0]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9C27B0]"></span> Left (Purple)
          </span>
        </div>

        {/* Right: Lock Status & Telemetry Toggle */}
        <div className="flex items-center gap-2">
          {/* Clean User Lock Status Badge */}
          {isCapturing && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs ${
                userLockStatus === 'locked'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : userLockStatus === 'calibrating'
                  ? 'bg-blue-50 text-[#0072B2] border-blue-300 animate-pulse'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              {userLockStatus === 'locked' ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tracking Active • User Locked</span>
                </>
              ) : userLockStatus === 'calibrating' ? (
                <>
                  <Scan className="w-3.5 h-3.5 text-[#0072B2]" />
                  <span>Detecting User ({calibrationCountdown}s)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>User Out of Frame ({graceCountdown}s)</span>
                </>
              )}
            </div>
          )}

          {/* New User / Reset Lock Button for Public Kiosk Sessions */}
          {isCapturing && (
            <button
              type="button"
              onClick={resetUserLock}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              title="Reset session lock for the next user"
            >
              <UserX className="w-3.5 h-3.5 text-gray-600" />
              <span>New User</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowTelemetryDetails((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-[#009E73]" />
            <span>{showTelemetryDetails ? 'Hide Telemetry' : 'Show Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Video & Canvas Viewport */}
      <div
        className="relative w-full max-w-2xl mx-auto aspect-4/3 bg-[#0D1117] border-2 border-gray-300 rounded-3xl overflow-hidden shadow-sm"
        role="region"
        aria-label={viewportTitle}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />

        {/* Calibration Banner Overlay: Shown during initial 2s calibration */}
        {isCapturing && userLockStatus === 'calibrating' && (
          <div className="absolute inset-x-4 top-4 bg-[#121418]/90 backdrop-blur-md border border-[#0072B2]/40 rounded-2xl p-4 text-white z-20 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0072B2]/20 border border-[#0072B2] flex items-center justify-center text-[#56B4E9]">
                <Scan className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-[#56B4E9]">
                  Single-User Calibration
                </div>
                <div className="text-sm font-bold text-gray-100">
                  Face the camera to begin session
                </div>
              </div>
            </div>

            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-center min-w-[55px]">
              <span className="font-mono text-lg font-black text-white">{calibrationCountdown}s</span>
            </div>
          </div>
        )}

        {/* Live Multi-Stage HUD Overlay: ONLY when hands are actually present for locked person! */}
        {isCapturing && userLockStatus === 'locked' && latestResult && latestResult.presenceState !== 'no-hands' && latestResult.hands.length > 0 && (
          <div className="absolute top-3 left-3 right-3 bg-[#121418]/90 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white z-10 shadow-lg space-y-2">
            {/* Top row: Tagged Branch + Hand Roles */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0072B2] text-white">
                  {latestResult.tag === 'one-handed'
                    ? '1️⃣ One-Handed'
                    : latestResult.tag === 'two-handed-symmetric'
                    ? '2️⃣ Two-Handed Symmetric'
                    : '2️⃣ Two-Handed Asymmetric'}
                </span>
                <span className="text-[11px] text-gray-300">
                  {latestResult.handCount === 1
                    ? 'Single Hand Active'
                    : `${latestResult.dominantHand} Dominant (${latestResult.symmetryScore}% Symmetry)`}
                </span>
              </div>

              <div className="text-[10px] font-bold text-gray-400">
                <span>Candidate Set: </span>
                <span className="text-[#56B4E9]">
                  {latestResult.candidateSet.slice(0, 6).join(', ')}
                  {latestResult.candidateSet.length > 6 ? '...' : ''}
                </span>
              </div>
            </div>

            {/* Bottom row: Recognized Sign & Stabilization Progress */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 px-3.5 py-1 rounded-xl border border-white/15 text-center min-w-[75px]">
                  <div className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400">
                    Detected
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    {latestResult.classifiedSign || '--'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-300">
                    Match Confidence
                  </div>
                  <div className="text-sm font-black text-[#00E676]">
                    {latestResult.confidence}%
                  </div>
                </div>
              </div>

              <div className="min-w-[140px] text-right">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-300 mb-1">
                  <span>Hold Stabilization</span>
                  <span
                    className={
                      latestResult.isStabilized ? 'text-[#00E676] font-black' : 'text-amber-400'
                    }
                  >
                    {latestResult.isStabilized ? '✓ LOCKED' : `${latestResult.stabilizationProgress}%`}
                  </span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-100 ${
                      latestResult.isStabilized
                        ? 'bg-[#00E676] shadow-sm'
                        : 'bg-[#E69F00]'
                    }`}
                    style={{ width: `${latestResult.stabilizationProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Status Text */}
        <div className="absolute bottom-0 inset-x-0 bg-black/85 text-white text-xs font-semibold py-2 px-3 text-center z-10 flex items-center justify-center gap-2">
          <span>
            {isCapturing && userLockStatus === 'calibrating'
              ? '🎯 Face the camera to lock on for this session...'
              : isCapturing && (!latestResult || latestResult.presenceState === 'no-hands' || latestResult.hands.length === 0)
              ? '👋 Place 1 or 2 hands in camera view to begin signing'
              : statusMessage}
          </span>
        </div>
      </div>

      {/* 5-Finger State & Confidence Breakdown: ONLY when hand is present for locked user */}
      {showTelemetryDetails && activeHand && latestResult?.presenceState !== 'no-hands' && latestResult?.hands && latestResult.hands.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  activeHand.handedness === 'Right Hand'
                    ? 'bg-blue-50 text-[#0072B2] border-blue-200'
                    : 'bg-purple-50 text-[#9C27B0] border-purple-200'
                }`}
              >
                {activeHand.handedness} Tracking ({activeHand.role})
              </span>
            </div>

            <div className="text-xs font-semibold text-gray-500 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00E676]"></span>
              <span>Green indicates stabilized ISL pose</span>
            </div>
          </div>

          {/* 5 Finger Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Thumb */}
            <div className="bg-orange-50/50 border border-orange-200/80 rounded-2xl p-3 text-center space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#E69F00]">👍 Thumb</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-gray-700 border border-orange-100">
                  {activeHand.fingerConfidence.thumb}%
                </span>
              </div>
              <div className="text-xs font-black text-gray-800 bg-white/80 py-1 rounded-lg border border-orange-100">
                {activeHand.states.thumb}
              </div>
            </div>

            {/* Index */}
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-3 text-center space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#0072B2]">☝️ Index</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-gray-700 border border-blue-100">
                  {activeHand.fingerConfidence.index}%
                </span>
              </div>
              <div className="text-xs font-black text-gray-800 bg-white/80 py-1 rounded-lg border border-blue-100">
                {activeHand.states.index}
              </div>
            </div>

            {/* Middle */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-3 text-center space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#009E73]">🖕 Middle</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-gray-700 border border-emerald-100">
                  {activeHand.fingerConfidence.middle}%
                </span>
              </div>
              <div className="text-xs font-black text-gray-800 bg-white/80 py-1 rounded-lg border border-emerald-100">
                {activeHand.states.middle}
              </div>
            </div>

            {/* Ring */}
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-3 text-center space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#D55E00]">💍 Ring</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-gray-700 border border-amber-100">
                  {activeHand.fingerConfidence.ring}%
                </span>
              </div>
              <div className="text-xs font-black text-gray-800 bg-white/80 py-1 rounded-lg border border-amber-100">
                {activeHand.states.ring}
              </div>
            </div>

            {/* Pinky */}
            <div className="bg-purple-50/50 border border-purple-200/80 rounded-2xl p-3 text-center space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#9C27B0]">🤙 Pinky</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-gray-700 border border-purple-100">
                  {activeHand.fingerConfidence.pinky}%
                </span>
              </div>
              <div className="text-xs font-black text-gray-800 bg-white/80 py-1 rounded-lg border border-purple-100">
                {activeHand.states.pinky}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={isCapturing ? stopCamera : startCamera}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-extrabold rounded-xl text-white transition-all min-h-[46px] shadow-xs cursor-pointer"
          style={{ backgroundColor: isCapturing ? '#D55E00' : accentColor }}
          aria-label={isCapturing ? 'Stop Camera' : 'Start Camera'}
        >
          {isCapturing ? (
            <>
              <CameraOff className="w-4 h-4" aria-hidden="true" />
              <span>Stop Camera Capture</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" aria-hidden="true" />
              <span>Start Camera (Single-User Lock)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => triggerTestGesture()}
          className="inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-extrabold text-[#1A1A1A] bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all min-h-[46px] shadow-2xs cursor-pointer"
          aria-label="Switch Sample Sign"
        >
          <RefreshCw className="w-4 h-4 text-[#0072B2]" aria-hidden="true" />
          <span>Test Gesture Switcher</span>
        </button>
      </div>
    </div>
  );
};
