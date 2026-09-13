import { EditorView } from 'codemirror';
import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, dropCursor, highlightActiveLine, keymap } from '@codemirror/view';
export { EditorView } from '@codemirror/view';
import { Compartment, EditorState } from '@codemirror/state';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap, insertTab, selectAll } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap, openSearchPanel, searchPanelOpen } from '@codemirror/search';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { markdown } from '@codemirror/lang-markdown';
import { createMobileSearchButton } from './mobile-search.mjs';
import { compactSearchPanel } from './compact-search.mjs';
import { createEditorSettings, normalizeSettings } from './editor-settings.mjs';
import { detectLanguage } from './language-detection.mjs';
import { themes, themeLabels } from './themes.js';
import { hideTargetUntilDialogCloses, scheduleEditorSetup } from './deferred-setup.mjs';
import './style.css';

const { isMobile, extensionSettings, saveSettingsDebounced } = SillyTavern.getContext();
const pendingTargets = new WeakSet();
const languageExtensions = { css: css(), javascript: javascript(), java: java(), markdown: markdown(), text: [] };

export function cleanup() {
    delete extensionSettings.codecode;
    saveSettingsDebounced();
}
const searchLabels = {
    find: '찾기',
    replace: '바꾸기',
    next: '다음',
    previous: '이전',
    all: '전체',
    matchCase: '대/소문자 구분',
    regexp: '정규식',
    byWord: '단어 단위',
    replaceAll: '모두 바꾸기',
    close: '닫기',
};
const searchPhrases = {
    Find: searchLabels.find,
    Replace: searchLabels.replace,
    next: searchLabels.next,
    previous: searchLabels.previous,
    all: searchLabels.all,
    'match case': searchLabels.matchCase,
    regexp: searchLabels.regexp,
    'by word': searchLabels.byWord,
    replace: searchLabels.replace,
    'replace all': searchLabels.replaceAll,
    close: searchLabels.close,
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof Element)) {
                    return;
                }

                const dialogs = node instanceof HTMLDialogElement
                    ? [node]
                    : node.querySelectorAll('dialog');
                dialogs.forEach((dialog) => {
                    // SillyTavern의 확장 편집기는 팝업마다 입력창 하나를 생성한다.
                    const target = dialog.querySelector('textarea.maximized_textarea');
                    if (target) {
                        scheduleEditorSetup({
                            target,
                            pendingTargets,
                            setup: setupCodeMirror,
                        });
                    }
                });
            });
        }
    });
});

// 팝업 루트만 관찰해 채팅 전체의 DOM 변경을 감시하지 않는다.
observer.observe(document.body, {
    childList: true,
});

/**
 * Setup CodeMirror for the target textarea element.
 * @param {HTMLTextAreaElement} target
 */
function setupCodeMirror(target) {
    const parent = target.parentElement;
    if (!parent) {
        return;
    }

    const existingHost = parent.querySelector('.codemirror-host');
    if (existingHost) {
        reuseCompatibleEditor(existingHost, target);
        return;
    }

    const host = document.createElement('div');
    host.classList.add('codemirror-host');
    target.classList.add('displayNone');
    parent.appendChild(host);
    const source = document.getElementById(target.dataset.for);
    const settings = normalizeSettings(extensionSettings.codecode, Object.keys(themes));
    const themeCompartment = new Compartment();
    const languageCompartment = new Compartment();
    const lineNumbersCompartment = new Compartment();
    let languageChoice = 'auto';
    let languageTimer;
    let closed = false;
    let controls;
    const detect = (text) => detectLanguage({
        id: target.dataset.for,
        language: source?.dataset.language || source?.dataset.mode || '',
        text,
    });
    let currentLanguage = detect(target.value);
    const updateLanguage = () => {
        if (closed) return;
        const detected = detect(editor.state.doc.sliceString(0, 16384));
        const language = languageChoice === 'auto' ? detected : languageChoice;
        if (language !== currentLanguage) {
            currentLanguage = language;
            editor.dispatch({ effects: languageCompartment.reconfigure(languageExtensions[language]) });
        }
        host.dataset.language = language;
        host.classList.toggle('codecode-plain-text-mode', languageChoice === 'text');
    };
    host.dataset.language = currentLanguage;
    host.classList.toggle('codecode-plain-text-mode', languageChoice === 'text');
    const editor = new EditorView({
        doc: target.value,
        extensions: [
            themeCompartment.of(themes[settings.theme]),
            languageCompartment.of(languageExtensions[currentLanguage]),
            lineNumbersCompartment.of(settings.lineNumbers ? lineNumbers() : []),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            dropCursor(),
            EditorState.phrases.of(searchPhrases),
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            bracketMatching(),
            closeBrackets(),
            highlightActiveLine(),
            EditorView.lineWrapping,
            highlightSelectionMatches(),
            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                { key: 'Tab', run: insertTab },
            ]),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    target.value = update.state.doc.toString();
                    target.dispatchEvent(new Event('input', { bubbles: true }));
                    if (languageChoice === 'auto') {
                        clearTimeout(languageTimer);
                        languageTimer = setTimeout(updateLanguage, 300);
                    }
                }
                if (searchPanelOpen(update.state) && !searchPanelOpen(update.startState)) {
                    queueMicrotask(() => { if (!closed) localizeSearchPanel(host); });
                }
            }),
        ],
        parent: host,
    });

    editor.dispatch({
        selection: {
            anchor: editor.state.doc.length,
            head: editor.state.doc.length,
        },
    });
    editor.focus();

    addMobileSearchButton(host, editor);
    const container = target.closest('dialog')?.querySelector('.popup-controls') ?? host;
    host.classList.add('has-codecode-settings');
    controls = createEditorSettings({
        host, container, settings, themes: themeLabels,
        onChange: (patch) => {
            Object.assign(settings, patch);
            const effects = [];
            if ('theme' in patch) effects.push(themeCompartment.reconfigure(themes[settings.theme]));
            if ('lineNumbers' in patch) effects.push(lineNumbersCompartment.reconfigure(settings.lineNumbers ? lineNumbers() : []));
            editor.dispatch({ effects });
            extensionSettings.codecode = { ...settings };
            saveSettingsDebounced();
        },
        onLanguageChange: (language) => {
            languageChoice = language;
            clearTimeout(languageTimer);
            updateLanguage();
        },
        onSelectAll: () => { selectAll(editor); editor.focus(); },
        onCopy: () => copyTextToClipboard(host.ownerDocument, editor.state.doc.toString()),
    });

    const dialog = target.closest('dialog');
    dialog?.addEventListener('close', () => {
        closed = true;
        clearTimeout(languageTimer);
        controls.destroy();
        editor.destroy();
        host.remove();
        target.classList.remove('displayNone');
    }, { once: true });
}

function reuseCompatibleEditor(host, target) {
    const attachSearchButton = () => {
        const editorElement = host.querySelector('.cm-editor');
        const editor = editorElement ? EditorView.findFromDOM(editorElement) : null;
        if (!editor) {
            return false;
        }

        hideTargetUntilDialogCloses(target, target.closest('dialog'));
        // 다른 번들의 명령과 상태가 호환되지 않을 수 있어 해당 편집기의 단축키를 사용한다.
        addMobileSearchButton(host, editor, () => openSearchWithEditorKeymap(host));
        return true;
    };

    if (attachSearchButton()) {
        return;
    }

    const hostObserver = new MutationObserver(() => {
        if (attachSearchButton()) {
            hostObserver.disconnect();
        }
    });
    hostObserver.observe(host, { childList: true, subtree: true });
    target.closest('dialog')?.addEventListener('close', () => hostObserver.disconnect(), { once: true });
}

function addMobileSearchButton(host, editor, searchCommand = openSearchPanel) {
    const dialog = host.closest('dialog');
    const buttonContainer = dialog?.querySelector('.popup-controls') ?? host;
    const existingButton = dialog?.querySelector('.cm-search-button')
        ?? host.querySelector('.cm-search-button');
    if (existingButton && existingButton.parentElement !== buttonContainer) {
        buttonContainer.appendChild(existingButton);
    }

    const searchButton = createMobileSearchButton({
        container: buttonContainer,
        editor,
        openSearchPanel: searchCommand,
        onSearchOpened: () => localizeSearchPanel(host),
        label: '검색',
        mobile: isMobile() || window.matchMedia('(max-width: 600px)').matches,
    });

    if (searchButton) {
        host.classList.add('has-mobile-search-button');
    }
}

function localizeSearchPanel(host) {
    const panel = host.querySelector('.cm-panel.cm-search');
    if (!panel) {
        return;
    }

    setSearchInputText(panel, 'search', searchLabels.find);
    setSearchInputText(panel, 'replace', searchLabels.replace);
    setSearchButtonText(panel, 'next', searchLabels.next);
    setSearchButtonText(panel, 'prev', searchLabels.previous);
    setSearchButtonText(panel, 'select', searchLabels.all);
    setSearchButtonText(panel, 'replace', searchLabels.replace);
    setSearchButtonText(panel, 'replaceAll', searchLabels.replaceAll);
    setSearchButtonText(panel, 'close', '×', searchLabels.close);
    setSearchLabelText(panel, 'case', searchLabels.matchCase);
    setSearchLabelText(panel, 're', searchLabels.regexp);
    setSearchLabelText(panel, 'word', searchLabels.byWord);
    compactSearchPanel(panel);
}

async function copyTextToClipboard(doc, text) {
    if (doc.defaultView.navigator.clipboard?.writeText) {
        try {
            await doc.defaultView.navigator.clipboard.writeText(text);
            return;
        } catch {
            // 클립보드 권한이 없는 컨텍스트에서는 기존 복사 방식을 사용한다.
        }
    }

    const textarea = doc.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0;';
    doc.body.appendChild(textarea);
    textarea.select();
    doc.execCommand('copy');
    textarea.remove();
}

function setSearchInputText(panel, name, text) {
    const input = panel.querySelector(`input[name="${name}"]`);
    if (!input) {
        return;
    }

    input.placeholder = text;
    input.setAttribute('aria-label', text);
}

function setSearchButtonText(panel, name, text, ariaLabel = text) {
    const button = panel.querySelector(`button[name="${name}"]`);
    if (!button) {
        return;
    }

    button.textContent = text;
    button.setAttribute('aria-label', ariaLabel);
}

function setSearchLabelText(panel, name, text) {
    const input = panel.querySelector(`input[name="${name}"]`);
    const label = input?.closest('label');
    const textNode = [...(label?.childNodes ?? [])].find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
        textNode.textContent = ` ${text}`;
    }
}

function openSearchWithEditorKeymap(host) {
    const content = host.querySelector('.cm-content');
    if (!content) {
        return;
    }

    const hostWindow = host.ownerDocument.defaultView;
    if (!hostWindow) {
        return;
    }

    const platform = hostWindow.navigator.platform || hostWindow.navigator.userAgent;
    const usesCommandKey = /Mac|iPhone|iPad|iPod/i.test(platform);
    content.dispatchEvent(new hostWindow.KeyboardEvent('keydown', {
        key: 'f',
        code: 'KeyF',
        ctrlKey: !usesCommandKey,
        metaKey: usesCommandKey,
        bubbles: true,
        cancelable: true,
    }));
}
