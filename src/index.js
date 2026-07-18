import { EditorView } from 'codemirror';
import { highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, keymap } from '@codemirror/view';
export { EditorView } from '@codemirror/view';
import { Compartment, EditorState } from '@codemirror/state';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap, insertTab } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap, openSearchPanel } from '@codemirror/search';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { createMobileSearchButton, createThemeToggleButton } from './mobile-search.mjs';
import { hideTargetUntilDialogCloses, scheduleEditorSetup } from './deferred-setup.mjs';
import './style.css';

const { isMobile } = SillyTavern.getContext();
const pendingTargets = new WeakSet();
const lightTheme = EditorView.theme({
    '&': {
        color: '#24292f',
        backgroundColor: '#ffffff',
    },
    '.cm-content': { caretColor: '#24292f' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#24292f' },
    '&.cm-focused .cm-selectionBackground, ::selection': { backgroundColor: '#b6d7ff' },
    '.cm-gutters': {
        color: '#57606a',
        backgroundColor: '#f6f8fa',
        borderRight: '1px solid #d0d7de',
    },
    '.cm-activeLine': { backgroundColor: '#f6f8fa' },
    '.cm-activeLineGutter': { backgroundColor: '#eaeef2' },
    '.cm-panels': {
        color: '#24292f',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #d0d7de',
    },
    '.cm-textfield': {
        color: '#24292f',
        backgroundColor: '#ffffff',
        border: '1px solid #d0d7de',
    },
}, { dark: false });
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
                    // SillyTavern creates one maximized textarea per popup
                    // (public/scripts/chats.js, expanded editor handler).
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

// SillyTavern appends popup roots directly to body. Added wrappers are scanned
// for nested dialogs without observing every DOM mutation in the application.
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
    const isCss = target.dataset.for === 'customCSS';
    const themeCompartment = new Compartment();
    const editor = new EditorView({
        doc: target.value,
        extensions: [
            themeCompartment.of(lightTheme),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
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
                }
            }),
            isCss ? css() : [],
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
    addThemeToggleButton(host, editor, themeCompartment);

    const dialog = target.closest('dialog');
    dialog?.addEventListener('close', () => {
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
        // A foreign CodeMirror bundle may not accept this bundle's
        // openSearchPanel command, so trigger the editor's own keymap instead.
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

function addThemeToggleButton(host, editor, themeCompartment) {
    const dialog = host.closest('dialog');
    const buttonContainer = dialog?.querySelector('.popup-controls') ?? host;
    const existingButton = dialog?.querySelector('.cm-theme-toggle-button')
        ?? host.querySelector('.cm-theme-toggle-button');
    if (existingButton && existingButton.parentElement !== buttonContainer) {
        buttonContainer.appendChild(existingButton);
    }

    const themeButton = createThemeToggleButton({
        container: buttonContainer,
        onThemeChange: (dark) => editor.dispatch({
            effects: themeCompartment.reconfigure(dark ? oneDark : lightTheme),
        }),
    });

    if (themeButton) {
        host.classList.add('has-theme-toggle-button');
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
