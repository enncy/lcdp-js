import 'reflect-metadata';
import dayjs from 'dayjs';
import { Model, Schema, model, SchemaDefinition, SchemaDefinitionType, SchemaOptions, models } from 'mongoose';
import { env, uuid } from '../utils';
import { TableItem } from '../decorators';

export class BaseSchema {
	@TableItem({
		label: 'uid',
		render: (uid: string) => uid?.slice(0, 8),
		attributes: { disabled: true, level: -99 },
		searchable: true
	})
	uid!: string;

	@TableItem({
		label: '创建时间',
		type: 'date_time',
		attributes: { disabled: true, level: -99 },
		render: (time: number) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '无'),
		sort: -1
	})
	create_time!: number;

	@TableItem({
		label: '最近更新',
		type: 'date_time',
		attributes: { disabled: true, level: -99 },

		render: (time: number) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '无')
	})
	update_time!: number;
}

export function createModel<S extends BaseSchema>(name: string, schema: Schema) {
	return env({
		server() {
			return (models[name] as Model<S>) || model<S>(name, schema);
		},
		web() {
			return schema.obj as any;
		}
	});
}

export function createSchema<S extends BaseSchema>(
	definition: SchemaDefinition<SchemaDefinitionType<S>>,
	options?: SchemaOptions<any>
) {
	return new Schema(
		{
			uid: definition.uid || { type: String, default: () => uuid(), index: true, required: true, unique: true },
			create_time: {
				type: Number,
				index: true,
				default: (doc) => doc.toJSON().create_time || doc.toJSON().createTime
			},
			update_time: {
				type: Number,
				index: true,
				default: (doc) => doc.toJSON().update_time || doc.toJSON().updateTime
			},
			...definition
		} as SchemaDefinition<SchemaDefinitionType<S>>,
		{
			toJSON: {
				versionKey: false,
				transform(doc, ret) {
					delete ret._id;
				}
			},
			toObject: {
				versionKey: false,
				transform(doc, ret) {
					delete ret._id;
				}
			},
			timestamps: { createdAt: 'create_time', updatedAt: 'update_time' },
			...options
		} as SchemaOptions<any>
	);
}
