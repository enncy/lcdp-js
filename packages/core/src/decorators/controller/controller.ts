import { Model } from 'mongoose';
import { BaseSchema } from '../../schema';
import { CustomDecorator } from 'custom-decorator';
export type ControllerMetadata<S extends BaseSchema = BaseSchema> = {
	/** 实体类 */
	path: string;
	/** 数据库模型 */
	model?: Model<S>;
};

export function Controller<S extends BaseSchema = BaseSchema>(controller: string | ControllerMetadata<S>): ClassDecorator {
	return CustomDecorator.classFactory(Controller, controller);
}
