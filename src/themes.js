import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { oneDark } from '@codemirror/theme-one-dark';

export const themeLabels = {
    light: '기본 밝은색',
    oneDark: 'One Dark',
    dracula: 'Dracula',
    monokai: 'Monokai',
    solarizedLight: 'Solarized Light',
    solarizedDark: 'Solarized Dark',
};

// CodeMirror 5 테마의 팔레트를 CodeMirror 6 테마와 구문 색상으로 적용한다.
const palettes = {
    light: { bg: '#ffffff', fg: '#24292f', gutter: '#f6f8fa', muted: '#57606a', active: '#f6f8fa', selection: '#b6d7ff', keyword: '#770088', string: '#aa1111', number: '#116644', comment: '#666666', property: '#0055aa', type: '#008855', dark: false },
    dracula: { bg: '#282a36', fg: '#f8f8f2', gutter: '#282a36', muted: '#a0a8c0', active: '#343746', selection: '#44475a', keyword: '#ff79c6', string: '#f1fa8c', number: '#bd93f9', comment: '#8999cb', property: '#66d9ef', type: '#ffb86c', dark: true },
    monokai: { bg: '#272822', fg: '#f8f8f2', gutter: '#272822', muted: '#b0afa3', active: '#373831', selection: '#49483e', keyword: '#f92672', string: '#e6db74', number: '#ae81ff', comment: '#a09c88', property: '#a6e22e', type: '#66d9ef', dark: true },
    solarizedLight: { bg: '#fdf6e3', fg: '#657b83', gutter: '#eee8d5', muted: '#657b83', active: '#eee8d5', selection: '#ded8c5', keyword: '#cb4b16', string: '#687800', number: '#d33682', comment: '#586e75', property: '#16877d', type: '#6c71c4', dark: false },
    solarizedDark: { bg: '#002b36', fg: '#93a1a1', gutter: '#073642', muted: '#93a1a1', active: '#073642', selection: '#164956', keyword: '#e07945', string: '#a5af35', number: '#ec67ae', comment: '#839496', property: '#2aa198', type: '#9298e0', dark: true },
};

function createTheme(p) {
    return [EditorView.theme({
        '&': { color: p.fg, backgroundColor: p.bg },
        '.cm-content': { caretColor: p.fg },
        '.cm-cursor, .cm-dropCursor': { borderLeftColor: p.fg },
        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: p.selection },
        '.cm-gutters': { color: p.muted, backgroundColor: p.gutter, borderRight: 'none' },
        '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: p.active },
        '.cm-panels': { color: p.fg, backgroundColor: p.bg },
        '.cm-textfield, .cm-button': { color: p.fg, backgroundColor: p.gutter, border: `1px solid ${p.muted}` },
        '.cm-searchMatch': { backgroundColor: p.selection, outline: `1px solid ${p.muted}` },
        '.cm-searchMatch.cm-searchMatch-selected': { outline: `2px solid ${p.keyword}` },
    }, { dark: p.dark }), syntaxHighlighting(HighlightStyle.define([
        { tag: [tags.keyword, tags.operator, tags.tagName], color: p.keyword },
        { tag: [tags.string, tags.regexp], color: p.string },
        { tag: [tags.number, tags.bool, tags.null, tags.atom], color: p.number },
        { tag: tags.comment, color: p.comment, fontStyle: 'italic' },
        { tag: [tags.propertyName, tags.attributeName, tags.function(tags.variableName)], color: p.property },
        { tag: [tags.typeName, tags.className], color: p.type },
        { tag: tags.heading, color: p.keyword, fontWeight: 'bold' },
        { tag: tags.link, color: p.property, textDecoration: 'underline' },
        { tag: tags.strong, fontWeight: 'bold' },
        { tag: tags.emphasis, fontStyle: 'italic' },
        { tag: tags.invalid, textDecoration: 'underline wavy', textDecorationColor: p.keyword },
    ]))];
}

export const themes = Object.fromEntries(Object.entries(palettes).map(([name, palette]) => [name, createTheme(palette)]));
themes.oneDark = oneDark;
