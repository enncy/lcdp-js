import { CustomDecorator } from 'custom-decorator';

export interface ApiMetadata {
	url: string;
	method: 'get' | 'post';
}

export function Api(method: 'get' | 'post', url: string) {
	return CustomDecorator.methodFactory(Api, { url, method });
}
