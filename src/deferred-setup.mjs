/**
 * Defer editor setup until other dialog observers have run. This lets the
 * extension reuse a compatible CodeMirror host instead of creating a duplicate.
 */
export function scheduleEditorSetup({
    target,
    setup,
    pendingTargets,
    schedule = queueMicrotask,
}) {
    if (pendingTargets.has(target)) {
        return false;
    }

    pendingTargets.add(target);
    schedule(() => {
        pendingTargets.delete(target);
        setup(target);
    });

    return true;
}

/**
 * Hide a textarea while a compatible editor is active and always restore it
 * when the owning dialog closes.
 * @param {HTMLTextAreaElement} target
 * @param {HTMLDialogElement|null} dialog
 */
export function hideTargetUntilDialogCloses(target, dialog) {
    target.classList.add('displayNone');
    dialog?.addEventListener('close', () => {
        target.classList.remove('displayNone');
    }, { once: true });
}
