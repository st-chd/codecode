/**
 * Add the mobile search control to a CodeMirror host.
 * @param {object} options
 * @param {HTMLElement} options.container
 * @param {import('@codemirror/view').EditorView} options.editor
 * @param {(view: import('@codemirror/view').EditorView) => boolean} options.openSearchPanel
 * @param {() => void} [options.onSearchOpened]
 * @param {string} options.label
 * @param {boolean} options.mobile
 * @returns {HTMLButtonElement|null}
 */
const ownedButtonActions = new WeakMap();
const searchOpenedHandlers = new WeakMap();

export function createMobileSearchButton({ container, editor, openSearchPanel, onSearchOpened, label, mobile }) {
    if (!mobile) {
        return null;
    }

    const existingButton = container.querySelector('.cm-search-button');
    if (existingButton) {
        configureSearchButton(existingButton, label);
        // Only buttons created by this module use ownedButtonActions. A compatible
        // button from another extension keeps its own click handler.
        if (ownedButtonActions.has(existingButton)) {
            ownedButtonActions.set(existingButton, { editor, openSearchPanel });
        }
        addSearchOpenedHandler(existingButton, onSearchOpened);
        return existingButton;
    }

    const searchButton = container.ownerDocument.createElement('button');
    searchButton.classList.add('cm-search-button');
    configureSearchButton(searchButton, label);
    ownedButtonActions.set(searchButton, { editor, openSearchPanel });
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        const action = ownedButtonActions.get(searchButton);
        action.editor.focus();
        action.openSearchPanel(action.editor);
    });
    addSearchOpenedHandler(searchButton, onSearchOpened);
    container.appendChild(searchButton);

    return searchButton;
}

function configureSearchButton(button, label) {
    button.type = 'button';
    button.textContent = label;
    button.title = label;
    button.setAttribute('aria-label', label);
    button.classList.add('menu_button');
}

function addSearchOpenedHandler(button, onSearchOpened) {
    if (!onSearchOpened) {
        return;
    }

    searchOpenedHandlers.set(button, onSearchOpened);
    if (button.getAttribute('data-search-localization') === 'true') {
        return;
    }

    button.setAttribute('data-search-localization', 'true');
    button.addEventListener('click', () => {
        queueMicrotask(() => searchOpenedHandlers.get(button)?.());
    });
}
