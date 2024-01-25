import { Request, Response } from 'express/index';

/** 控制器 */
export class BaseController<Req extends Request = Request, Res extends Response = Response> {
	/** express req */
	req!: Req;
	/** express res */
	res!: Res;
}
