import { CustomDecorator } from 'custom-decorator';

export type ParamMetadata = {
	name: string;
};

export function Param(name: string) {
	return CustomDecorator.parameterFactory(Param, { name });
}
