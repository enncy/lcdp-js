<template>
	<div style="max-width: 90vw">
		<div class="mb-3 d-flex align-items-center">
			Markdown编辑器
			<a-divider direction="vertical" />
			<a-button
				type="primary"
				ghost
				shape="round"
				size="small"
			>
				使用说明 <IconQuestionCircle />
			</a-button>
			<a-divider direction="vertical" />
			编辑模式：
			<a-radio-group
				v-model="editor.type"
				size="small"
				type="button"
			>
				<a-radio :value="1">双栏</a-radio>
				<a-radio :value="2">源码</a-radio>
				<a-radio :value="3">预览</a-radio>
			</a-radio-group>

			<slot name="actions"></slot>
		</div>

		<a-row :gutter="[12, 12]">
			<a-col
				:xs="24"
				:md="12"
				v-show="editor.type === 1 || editor.type === 2"
			>
				<div>
					<textarea
						ref="textarea"
						:style="{ minHeight: height + 'px' }"
						class="markdown-editor"
						v-model="editor.content"
					></textarea>
				</div>
			</a-col>
			<a-col
				:xs="24"
				:md="12"
				v-show="editor.type === 1 || editor.type === 3"
			>
				<div ref="preview">
					<MarkdownText
						:style="{ minHeight: height + 'px' }"
						class="markdown-body border rounded"
						:content="editor.content"
					></MarkdownText>
				</div>
			</a-col>
		</a-row>
	</div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch, nextTick } from 'vue';
import MarkdownText from '../../components/MarkdownText.vue';
import { IconQuestionCircle } from '@arco-design/web-vue/es/icon';

const props = withDefaults(
	defineProps<{
		modelValue?: string;
		height?: number;
	}>(),
	{
		modelValue: '',
		height: 600
	}
);

const emits = defineEmits<{
	(e: 'update:modelValue', content: string): void;
}>();

const editor = reactive({
	type: 1,
	content: props.modelValue
});

const textarea = ref<HTMLTextAreaElement>();
const preview = ref<HTMLDivElement>();

onMounted(() => {
	nextTick(() => {
		// 绑定两个栏的高度
		function outputsize() {
			if (preview.value && textarea.value) {
				const body = preview.value.querySelector('.markdown-body');
				if (textarea.value.clientHeight > 0) {
					// @ts-ignore
					body.style.height = `${textarea.value.clientHeight}px`;
				}
			}
		}
		outputsize();
		if (textarea.value) {
			new ResizeObserver(outputsize).observe(textarea.value);

			// 启用 tab 键
			textarea.value.addEventListener('keydown', function (e) {
				if (e.key == 'Tab') {
					e.preventDefault();
					var start = this.selectionStart;
					var end = this.selectionEnd;

					// set textarea value to: text before caret + tab + text after caret
					editor.content = editor.content.substring(0, start) + '    ' + editor.content.substring(end);

					// put caret at right position again
					nextTick(() => {
						this.selectionStart = this.selectionEnd = start + 4;
					});
				}
			});
		}
	});
});

watch(
	() => editor.content,
	(c) => {
		emits('update:modelValue', c);
	}
);
</script>
<style scoped lang="less">
.markdown-editor,
.markdown-body {
	height: 100%;
	width: 100%;
	overflow: auto;
}

.markdown-editor {
	resize: both;
}
</style>
