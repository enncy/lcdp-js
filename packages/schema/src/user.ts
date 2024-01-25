import { Table, BaseSchema, Route, TableItem, createModel, createSchema } from 'core';

@Route({
	group: '用户管理',
	label: '用户列表',
	path: '/admin/user/list',
	icon: 'icon-user'
})
@Table<User, any>({
	name: '用户',
	renderInSearch: (s) => `${s.nickname}-${s.uid}`
})
export class User extends BaseSchema {
	@TableItem({ label: '昵称', searchable: true })
	nickname!: string;

	@TableItem({ label: '头像', render: (val) => val || '---' })
	avatar!: string;

	@TableItem({ label: '邮箱', searchable: true, render: (val) => val || '---' })
	email!: string;

	@TableItem({ label: '密码', searchable: true, render: (val) => val || '---' })
	password!: string;
}

export const UserModel = createModel<User>(
	User.name,
	createSchema<User>({
		nickname: { type: String, default: '无名称' },
		avatar: { type: String },
		email: { type: String, index: true, default: '' },
		password: { type: String, index: true, default: '' }
	})
);

console.log(UserModel);