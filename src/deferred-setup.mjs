// 다른 옵저버가 처리한 뒤 기존 CodeMirror 호스트를 재사용한다.
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

// 호환 편집기 사용 중 textarea를 숨기고 대화상자 종료 시 복원한다.
export function hideTargetUntilDialogCloses(target, dialog) {
    target.classList.add('displayNone');
    dialog?.addEventListener('close', () => {
        target.classList.remove('displayNone');
    }, { once: true });
}
