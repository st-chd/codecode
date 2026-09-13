export const defaultSettings = { theme: 'light', lineNumbers: false, fontSize: 14 };

export function normalizeSettings(value, themes) {
    const settings = value && typeof value === 'object' ? value : {};
    return {
        theme: themes.includes(settings.theme) ? settings.theme : defaultSettings.theme,
        lineNumbers: typeof settings.lineNumbers === 'boolean' ? settings.lineNumbers : defaultSettings.lineNumbers,
        fontSize: Number.isFinite(settings.fontSize) ? Math.min(32, Math.max(10, Math.round(settings.fontSize))) : defaultSettings.fontSize,
    };
}

export function createEditorSettings({ host, container, settings, themes, languages, detectedLanguage, onChange, onLanguageChange, onSelectAll }) {
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
    const languageSelect = addSelect('언어', languages, 'auto', onLanguageChange);
    const updateDetectedLanguage = (language) => {
        languageSelect.options[0].textContent = `자동 감지 (${languages[language]})`;
    };
    updateDetectedLanguage(detectedLanguage);
    addSelect('테마', themes, settings.theme, (theme) => onChange({ theme }));
    const lineLabel = doc.createElement('label');
    const lines = doc.createElement('input');
    lines.type = 'checkbox';
    lines.checked = settings.lineNumbers;
    lines.addEventListener('change', () => onChange({ lineNumbers: lines.checked }));
    lineLabel.append(lines, doc.createTextNode(' 줄 번호 표시'));
    panel.appendChild(lineLabel);

    const fontRow = doc.createElement('div');
    fontRow.className = 'codecode-font-controls';
    const size = doc.createElement('output');
    size.setAttribute('aria-live', 'polite');
    const smaller = doc.createElement('button');
    const larger = doc.createElement('button');
    const updateSize = () => {
        size.textContent = `글꼴 ${settings.fontSize}px`;
        smaller.disabled = settings.fontSize <= 10;
        larger.disabled = settings.fontSize >= 32;
    };
    for (const [control, label, delta] of [[smaller, '글꼴 크기 줄이기', -1], [larger, '글꼴 크기 키우기', 1]]) {
        control.type = 'button';
        control.textContent = delta < 0 ? 'A−' : 'A+';
        control.setAttribute('aria-label', label);
        control.addEventListener('click', () => {
            onChange({ fontSize: Math.min(32, Math.max(10, settings.fontSize + delta)) });
            updateSize();
        });
    }
    updateSize();
    fontRow.append(smaller, size, larger);
    panel.appendChild(fontRow);

    const selectAll = doc.createElement('button');
    selectAll.type = 'button';
    selectAll.className = 'menu_button codecode-select-all-button';
    selectAll.textContent = '전체 선택';
    selectAll.addEventListener('click', () => {
        panel.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        onSelectAll();
    });
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
    container.append(selectAll, button);
    return { updateDetectedLanguage, destroy: () => { panel.remove(); button.remove(); selectAll.remove(); } };
}
