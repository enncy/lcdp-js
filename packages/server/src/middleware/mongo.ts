import mongoose from 'mongoose';

// 连接数据库
export function mongo(url: string) {
	return new Promise((resolve, reject) => {
		const prom = mongoose
			.connect(url, {})
			.then(() => {
				console.log('[mongo] server launched');
			})
			.catch((err) => console.error('[mongo] launch error : ' + err.message));

		resolve(prom);

		mongoose.connection.on('error', (err) => {
			console.error('[mongo] server error : ' + err.message);
		});
	});
}
