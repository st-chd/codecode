import assert from 'node:assert/strict';
import test from 'node:test';

import { hideTargetUntilDialogCloses, scheduleEditorSetup } from '../src/deferred-setup.mjs';

test('editor setup waits for competing dialog observers and coalesces duplicates', () => {
    const target = {};
    const pendingTargets = new WeakSet();
    const queuedTasks = [];
    const setupCalls = [];
    const schedule = (task) => queuedTasks.push(task);

    const firstScheduled = scheduleEditorSetup({
        target,
        pendingTargets,
        schedule,
        setup: (value) => setupCalls.push(value),
    });
    const secondScheduled = scheduleEditorSetup({
        target,
        pendingTargets,
        schedule,
        setup: (value) => setupCalls.push(value),
    });

    assert.equal(firstScheduled, true);
    assert.equal(secondScheduled, false);
    assert.deepEqual(setupCalls, []);
    assert.equal(queuedTasks.length, 1);

    queuedTasks[0]();

    assert.deepEqual(setupCalls, [target]);
    assert.equal(pendingTargets.has(target), false);
});

test('every reused target is shown again when its dialog closes', () => {
    const listeners = [];
    const dialog = {
        addEventListener(type, listener, options) {
            listeners.push({ type, listener, options });
        },
    };
    const target = {
        classList: {
            values: new Set(),
            add(value) { this.values.add(value); },
            remove(value) { this.values.delete(value); },
            contains(value) { return this.values.has(value); },
        },
    };

    hideTargetUntilDialogCloses(target, dialog);

    assert.equal(target.classList.contains('displayNone'), true);
    assert.deepEqual(listeners.map(({ type, options }) => ({ type, options })), [
        { type: 'close', options: { once: true } },
    ]);

    listeners[0].listener();

    assert.equal(target.classList.contains('displayNone'), false);
});
