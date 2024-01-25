import { RequestHandler } from 'express';

export function cors(origin?: string): RequestHandler {
	return (req, res, next) => {
		let allow = '';

		if (req.path === '/query') {
			allow = origin || req.headers.origin || 'unknown';
		} else if (req.hostname.includes('192.168')) {
			allow = origin || req.headers.origin || 'unknown';
		} else if (req.hostname.includes('localhost')) {
			allow = 'http://localhost:5173';
		} else {
			allow = 'unknown';
		}

		if (allow) {
			res.setHeader('Access-Control-Allow-Origin', allow);
			res.setHeader('Access-Control-Allow-Credentials', 'true');
		}

		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, if-none-match');
		res.setHeader('Access-Control-Allow-Methods', '*');
		if (req.method === 'OPTIONS') {
			res.sendStatus(204);
			return;
		}
		next();
	};
}
