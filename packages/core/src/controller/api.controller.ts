import { FilterQuery, Model, SortOrder } from 'mongoose';
import { Api, Param } from '../decorators';
import { BaseSchema } from '../schema';
import { BaseController } from './index';
import { CommonResponse, ListApiCondition, Page, Pagination } from './interface';
import { json } from './utils';
import { Request, Response } from 'express/index';
import { uuid } from '../utils';

export class ApiController<S extends BaseSchema = BaseSchema, Req extends Request = Request, Res extends Response = Response> extends BaseController<Req, Res> {
	/** 数据库模型 */
	model!: Model<S>;

	/**
	 * 查询数据
	 * @param query 实体类属性查询器
	 * @param {Condition} condition 条件
	 * @param {Pagination} pagination 分页
	 * @returns
	 */
	@Api('post', '/list')
	async list(filter: FilterQuery<S>, condition: ListApiCondition, pagination: Pagination): Promise<CommonResponse<Page<S>>> {
		/** 构造查询器 */
		const wrapper: Record<keyof BaseSchema, any> = Object.create({});
		for (const key in filter) {
			if (Object.prototype.hasOwnProperty.call(filter, key)) {
				let value: any = Reflect.get(filter, key);
				if (typeof value === 'string') {
					value = RegExp(value);
				}
				Reflect.set(wrapper, key, value);
			}
		}

		// 最多数据展示1000行
		const validSize = Math.min(pagination?.size || 10, 1000);
		const validPage = Math.max((pagination?.current ?? 0) - 1, 0);

		const { create_time_range, update_time_range, sorter } = condition || {};

		// 过滤时间范围
		if (create_time_range && create_time_range[0] && create_time_range[1]) {
			wrapper.create_time = {
				$gte: new Date(create_time_range[0]).getTime(),
				$lte: new Date(create_time_range[1]).getTime()
			};
		}
		if (update_time_range && update_time_range[0] && update_time_range[1]) {
			wrapper.update_time = {
				$gte: new Date(update_time_range[0]).getTime(),
				$lte: new Date(update_time_range[1]).getTime()
			};
		}

		// 删除默认排序
		if (sorter) {
			for (const key in sorter) {
				if (Object.prototype.hasOwnProperty.call(sorter, key)) {
					if (sorter[key] === 0) {
						Reflect.deleteProperty(sorter, key);
					}
				}
			}
		}

		const count = await this.model.count(wrapper);

		return json({
			data: await this.model
				.find(wrapper)
				.sort(sorter as { [key: string]: SortOrder })
				.skip(validPage * validSize)
				.limit(validSize)
				.allowDiskUse(true),
			current: validPage + 1,
			size: validSize,
			total: count
		});
	}

	@Api('post', '/insert')
	async insert(@Param('data') data: Omit<S, 'uid' | 'update_time' | 'create_time'>): Promise<CommonResponse<S>> {
		const t = Date.now();
		const entity = new this.model({
			...data,
			uid: uuid(),
			create_time: t,
			update_time: t
		});
		console.log('data', data, entity);
		const res = await entity.save();
		return json(res.toJSON() as S);
	}

	@Api('post', '/update-by-id')
	async updateById(@Param('data') { uid, ...data }: Partial<Omit<S, 'uid' | 'update_time'>> & { uid: S['uid'] }) {
		return json((await this.model.updateOne({ uid }, { $set: { update_time: Date.now(), ...data } })).acknowledged);
	}

	@Api('post', '/find-by-id')
	async findById(uid: string): Promise<CommonResponse<S | null>> {
		return json(await this.model.findOne({ uid }));
	}

	@Api('post', '/remove-by-id')
	async removeById(uid: string) {
		return json((await this.model.deleteOne({ uid })).acknowledged);
	}

	@Api('post', '/count')
	async count(@Param('filter') filter?: FilterQuery<S>) {
		return json(filter ? await this.model.count(filter) : await this.model.count());
	}
}
