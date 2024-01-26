import MarkdownIt from 'markdown-it';
import Anchor from 'markdown-it-anchor';
import { markdownContainer } from './markdown.container';
import hljs from 'highlight.js';

// @ts-ignore full options list (defaults)
export const markdownIt: MarkdownIt = MarkdownIt({
	html: true,
	xhtmlOut: false,
	breaks: true,
	langPrefix: 'language-',
	linkify: true,
	typographer: true,
	quotes: '“”‘’',
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return (
					'<pre class="hljs"><code>' +
					hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
					'</code></pre>'
				);
			} catch (__) {}
		}

		return '<pre class="hljs"><code>' + markdownIt.utils.escapeHtml(str) + '</code></pre>';
	}
});

markdownIt
	// 自定义 container
	.use(markdownContainer)
	// 锚点
	.use(Anchor, {
		permalink: true,
		permalinkBefore: true,
		// 锚点标识
		permalinkSymbol: '#'
	});
