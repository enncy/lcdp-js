<template>
	<div
		class="markdown-text"
		v-html="md"
	></div>
</template>
<script setup lang="ts">
import '../style/markdown-editor.css';
import 'video.js/dist/video-js.css';
import '../style/video.css';
import '../style/container.css';
import '../style/hljs.css';

import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import { markdownIt } from '../utils/markdown';

const props = defineProps<{
	content: string;
}>();

const md = computed(() => markdownIt.render(props.content));

/**
 *  解析视频
 */
const players = ref<VideoJsPlayer[]>([]);

onMounted(() => {
	nextTick(() => {
		const videos = Array.from(document.querySelectorAll('.video-js')) as HTMLElement[];
		for (const video of videos) {
			const options: VideoJsPlayerOptions = {
				bigPlayButton: true,
				controls: true,
				playbackRates: [1, 1.5, 2],
				fluid: true
			};
			const player = videojs(video, options);
			player.addClass('w-100');
			player.volume(0.3);
			players.value.push(player);
		}
	});
});

onBeforeUnmount(() => {
	for (const player of players.value) {
		player.dispose();
	}
});
</script>
<style scoped lang="less"></style>
