import { Input, InputNumber, Textarea } from '@arco-design/web-vue';
import DateAndTime from './mapping/DateAndTime.vue';
import Provider from './mapping/Provider.vue';
import ArrayVue from './mapping/Array.vue';
import JSONVue from './mapping/JSON.vue';
import JSONEditor from './mapping/JSONEditor.vue';
import MarkdownEditorVue from './mapping/MarkdownEditor.vue';
import BooleanInput from './mapping/BooleanInput.vue';
import Select from './mapping/Select.vue';

type ComponentMappingItem = {
	type: string;
	name: string;
	component: any;
};

/**
 * 可编辑的组件类型
 */
export const componentModalInputMapping = [
	{
		type: 'text',
		name: '文本编辑器',
		component: Input
	},
	{
		type: 'number',
		name: '数字输入框',
		component: InputNumber
	},

	{
		type: 'textarea',
		name: '多行文本编辑器',
		component: Textarea
	},
	{
		type: 'boolean-input',
		name: '布尔值编辑器',
		component: BooleanInput
	},
	{
		type: 'select',
		name: '下拉选择框',
		component: Select
	},
	{
		type: 'date_time',
		name: '日期时间选择器',
		component: DateAndTime
	},
	{
		type: 'provider',
		name: '提供者选择器',
		component: Provider
	},
	{
		type: 'json-editor',
		name: 'JSON编辑器',
		component: JSONEditor
	},
	{
		type: 'markdown-editor',
		name: 'Markdown编辑器',
		component: MarkdownEditorVue
	}
] as ComponentMappingItem[];

export const componentPreviewMapping = [
	{
		type: 'array',
		name: '数组预览器',
		component: ArrayVue
	},
	{
		type: 'json',
		name: 'JSON预览',
		component: JSONVue
	}
] as ComponentMappingItem[];

/**
 * 搜索组件的映射
 */
export const componentSearchMapping = [
	{
		type: 'text',
		component: Input
	},
	{
		type: 'number',
		component: InputNumber
	},
	{
		type: 'boolean-input',
		component: BooleanInput
	},
	{
		type: 'select',
		component: Select
	}
];
