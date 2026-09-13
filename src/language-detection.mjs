const aliases = {
    css: 'css', 'text/css': 'css',
    js: 'javascript', javascript: 'javascript', 'text/javascript': 'javascript',
    java: 'java', 'text/x-java': 'java',
    md: 'markdown', markdown: 'markdown', 'text/markdown': 'markdown',
    text: 'text', 'text/plain': 'text',
};

export function detectLanguage({ id = '', language = '', text = '' } = {}) {
    const explicit = aliases[language.toLowerCase()];
    if (explicit) return explicit;
    if (id === 'customCSS' || /(?:^|[-_])css(?:$|[-_])/i.test(id)) return 'css';
    if (/(?:^|[-_])(?:javascript|js)(?:$|[-_])/i.test(id)) return 'javascript';
    if (/(?:^|[-_])java(?:$|[-_])/i.test(id)) return 'java';

    // 긴 프롬프트 전체를 매 입력마다 분석하지 않도록 앞부분만 검사한다.
    const sample = text.slice(0, 16384).trim();
    if (/^(?:#{1,6}\s|```|~~~)/m.test(sample)) return 'markdown';
    if (/^\s*(?:package\s+[\w.]+\s*;|import\s+java\.|public\s+(?:(?:abstract|final)\s+)?class\s+\w+\s*[{<]|(?:public|private|protected)\s+(?:static\s+)?(?:void|String|int|boolean)\s+\w+)/m.test(sample)) return 'java';
    if (/^(?:\s*)(?:(?:export\s+(?:default\s+)?)?(?:async\s+)?function\s+\w+\s*\(|(?:export\s+)?(?:const|let|var)\s+[\w$]+\s*=|import\s+.+\s+from\s+['"]|(?:document|window|console)\.[\w$]+\s*\()/m.test(sample)
        || /(?:=>\s*\{|addEventListener\s*\(|^\s*class\s+\w+\s*(?:extends\s+\w+\s*)?\{)/m.test(sample)) return 'javascript';
    if (/^\s*@(import|charset|media|supports|layer|keyframes)\b/m.test(sample)
        || /(?:^|\})\s*[^{}\n]+\{\s*(?:\/\*[\s\S]*?\*\/\s*)?(?:--[\w-]+|[a-z][\w-]*)\s*:\s*[^{}]+[;}]/i.test(sample)) return 'css';
    return 'markdown';
}
