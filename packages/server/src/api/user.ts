import { Controller } from 'core';
import { UserModel, User } from 'schema';
import { BaseApiController } from './interface';
import { Request, Response } from 'express';

@Controller({ path: '/user', model: UserModel })
export class UserController extends BaseApiController<User, Request, Response> {}
