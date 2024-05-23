import { IncomingMessage, ServerResponse } from "http";

const jsonParser = (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
      return resolve(); // Resolve without modifying req.body
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Received data:', data);
        (req as any).body = data; // TypeScript workaround to add body property to req
        resolve();
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
      reject(new Error('Internal Server Error'));
    });
  });
};

export default jsonParser;
