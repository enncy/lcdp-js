<template>
	<div style="min-width: 400px">
		<a-radio-group
			type="button"
			v-model="mode"
		>
			<a-radio value="preview"> 预览 </a-radio>
			<a-radio value="code"> 代码 </a-radio>
			<a-radio value="default"> 编辑 </a-radio>
		</a-radio-group>
		<div
			ref="jsoneditor"
			style="max-height: 50vh; height: 50vh"
		></div>
	</div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import JSONEditor, { JSONEditorMode } from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';

const props = withDefaults(
	defineProps<{
		modelValue?: any;
		disabled?: boolean;
	}>(),
	{
		modelValue: undefined
	}
);

const emits = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const mode = ref<JSONEditorMode | 'default' | undefined>(props.disabled ? 'preview' : 'code');
const jsoneditor = ref();
let editor: JSONEditor | undefined;

onMounted(() => {
	nextTick(() => {
		editor = createJSONEditor(mode.value);

		// 监听类型变化
		watch(mode, (mode) => {
			editor?.destroy();
			editor = createJSONEditor(mode);
		});
	});
});

function createJSONEditor(mode: JSONEditorMode | 'default' | undefined) {
	const editor = new JSONEditor(jsoneditor.value, {
		autocomplete: {
			caseSensitive: true,
			trigger: 'keydown'
		},
		colorPicker: true,
		history: true,
		indentation: 2,
		mode: mode === 'default' ? undefined : mode,
		onChangeText(str) {
			try {
				emits('update:modelValue', JSON.parse(str));
			} catch {}
		}
	});
	console.log(editor);

	editor.set(props.modelValue || '');
	editor.expandAll?.();

	return editor;
}
</script>
<style scoped lang="less"></style>
