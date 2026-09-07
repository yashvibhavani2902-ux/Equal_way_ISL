interface VercelRequest {
  method?: string;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: any) => VercelResponse;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'EqualWay Vercel API Engine'
  });
}
