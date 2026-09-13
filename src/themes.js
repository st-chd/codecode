import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
export const themeLabels = {
    neo: 'neo',
    idea: 'idea',
    'solarized-light': 'solarized light',
    'duotone-light': 'duotone-light',
    nord: 'nord',
    'ayu-mirage': 'ayu-mirage',
    'material-darker': 'material-darker',
};

// CodeMirror 5 테마의 팔레트를 CodeMirror 6 테마와 구문 색상으로 적용한다.
const palettes = {
    neo: { bg: '#ffffff', fg: '#000000', gutter: '#f7f7f7', muted: '#555555', active: '#e8f2ff', selection: '#cce8ff', keyword: '#770088', string: '#aa1111', number: '#116644', comment: '#777777', property: '#0055aa', type: '#008855', dark: false },
    idea: { bg: '#ffffff', fg: '#000000', gutter: '#f4f4f4', muted: '#999999', active: '#fff3d6', selection: '#d6e9ff', keyword: '#000080', string: '#008000', number: '#0000ff', comment: '#808080', property: '#660e7a', type: '#000080', dark: false },
    'solarized-light': { bg: '#fdf6e3', fg: '#657b83', gutter: '#eee8d5', muted: '#93a1a1', active: '#eee8d5', selection: '#ded8c5', keyword: '#cb4b16', string: '#859900', number: '#d33682', comment: '#93a1a1', property: '#268bd2', type: '#6c71c4', dark: false },
    'duotone-light': { bg: '#faf8f5', fg: '#6a51b2', gutter: '#f2f0ec', muted: '#b29762', active: '#f0e9dd', selection: '#ded6c8', keyword: '#b29762', string: '#728c00', number: '#b29762', comment: '#b29762', property: '#6a51b2', type: '#b29762', dark: false },
    nord: { bg: '#2e3440', fg: '#d8dee9', gutter: '#2e3440', muted: '#7b88a1', active: '#3b4252', selection: '#434c5e', keyword: '#81a1c1', string: '#a3be8c', number: '#b48ead', comment: '#616e88', property: '#88c0d0', type: '#8fbcbb', dark: true },
    'ayu-mirage': { bg: '#1f2430', fg: '#cccac2', gutter: '#1f2430', muted: '#707a8c', active: '#242936', selection: '#33415e', keyword: '#ffcc66', string: '#bae67e', number: '#d4bfff', comment: '#5c6773', property: '#73d0ff', type: '#ffd580', dark: true },
    'material-darker': { bg: '#212121', fg: '#eeffff', gutter: '#212121', muted: '#546e7a', active: '#2c2c2c', selection: '#4a4a4a', keyword: '#c792ea', string: '#c3e88d', number: '#f78c6c', comment: '#546e7a', property: '#82aaff', type: '#ffcb6b', dark: true },
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
