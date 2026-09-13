export function compactSearchPanel(panel) {
    if (!panel || panel.querySelector('.codecode-replace-toggle')) return;
    const replace = panel.querySelector('input[name="replace"]');
    if (!replace) return;
    panel.classList.add('codecode-compact-search');
    const doc = panel.ownerDocument;
    const label = doc.createElement('label');
    label.className = 'codecode-replace-toggle';
    const toggle = doc.createElement('input');
    toggle.type = 'checkbox';
    toggle.name = 'codecode-replace';
    toggle.setAttribute('aria-label', '바꾸기 사용');
    toggle.addEventListener('change', () => {
        panel.classList.toggle('codecode-replace-visible', toggle.checked);
    });
    label.append(toggle, doc.createTextNode(' 바꾸기'));
    panel.insertBefore(label, replace);
}
