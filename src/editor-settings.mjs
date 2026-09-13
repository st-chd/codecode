export const defaultSettings = { theme: 'neo', lineNumbers: false };

export function normalizeSettings(value, themes) {
    const settings = value && typeof value === 'object' ? value : {};
    return {
        theme: themes.includes(settings.theme) ? settings.theme : defaultSettings.theme,
        lineNumbers: typeof settings.lineNumbers === 'boolean' ? settings.lineNumbers : defaultSettings.lineNumbers,
    };
}

export function createEditorSettings({ host, container, settings, themes, onChange, onLanguageChange, onSelectAll, onCopy }) {
    const doc = host.ownerDocument;
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'menu_button codecode-settings-button';
    button.textContent = '설정';
    button.setAttribute('aria-expanded', 'false');
    const panel = doc.createElement('div');
    panel.className = 'codecode-settings-panel';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', '편집기 설정');
    panel.hidden = true;

    const addSelect = (labelText, options, value, change) => {
        const label = doc.createElement('label');
        label.textContent = labelText;
        const select = doc.createElement('select');
        select.setAttribute('aria-label', labelText);
        for (const [id, label] of Object.entries(options)) {
            const option = doc.createElement('option');
            option.value = id;
            option.textContent = label;
            select.appendChild(option);
        }
        select.value = value;
        select.addEventListener('change', () => change(select.value));
        label.appendChild(select);
        panel.appendChild(label);
        return select;
    };
    addSelect('테마', themes, settings.theme, (theme) => onChange({ theme }));
    const languageLabel = doc.createElement('label');
    languageLabel.className = 'codecode-language-control';
    const plainText = doc.createElement('input');
    plainText.type = 'checkbox';
    languageLabel.append(plainText, doc.createTextNode(' 일반 텍스트 모드'));
    panel.appendChild(languageLabel);
    plainText.addEventListener('change', () => {
        onLanguageChange(plainText.checked ? 'text' : 'auto');
    });
    const lineLabel = doc.createElement('label');
    const lines = doc.createElement('input');
    lines.type = 'checkbox';
    lines.checked = settings.lineNumbers;
    lines.addEventListener('change', () => onChange({ lineNumbers: lines.checked }));
    lineLabel.append(lines, doc.createTextNode(' 줄 번호 표시'));
    panel.appendChild(lineLabel);

    const actions = doc.createElement('div');
    actions.className = 'codecode-editor-actions';
    const selectAll = doc.createElement('button');
    selectAll.type = 'button';
    selectAll.className = 'menu_button codecode-select-all-button';
    selectAll.textContent = '전체 선택';
    selectAll.addEventListener('click', () => {
        onSelectAll();
    });
    const copy = doc.createElement('button');
    copy.type = 'button';
    copy.className = 'menu_button codecode-copy-button';
    copy.textContent = '복사';
    copy.addEventListener('click', () => {
        onCopy();
    });
    actions.append(selectAll, copy);
    panel.appendChild(actions);
    button.addEventListener('click', () => {
        panel.hidden = !panel.hidden;
        button.setAttribute('aria-expanded', String(!panel.hidden));
    });
    panel.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.stopPropagation();
            panel.hidden = true;
            button.setAttribute('aria-expanded', 'false');
            button.focus();
        }
    });
    host.prepend(panel);
    container.append(button);
    return { destroy: () => { panel.remove(); button.remove(); selectAll.remove(); copy.remove(); } };
}
