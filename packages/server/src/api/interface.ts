import { ApiController, BaseSchema } from 'core';
import { Request, Response } from 'express';

/**
 * 通用Api控制器
 */
export class BaseApiController<S extends BaseSchema = BaseSchema, Req extends Request = Request, Res extends Response = Response> extends ApiController<S, Req, Res> {}
