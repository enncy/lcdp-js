import type { BaseSchema } from 'core';

/** 更的字段对象 */
export type UpdateForm<T extends BaseSchema = BaseSchema> = Partial<T> & {
	uid: BaseSchema['uid'];
	create_time: BaseSchema['update_time'];
};
