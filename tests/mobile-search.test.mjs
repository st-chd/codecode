import assert from 'node:assert/strict';
import test from 'node:test';

import { createMobileSearchButton } from '../src/mobile-search.mjs';

class FakeClassList {
    #classes = new Set();

    add(...classes) {
        classes.forEach((className) => this.#classes.add(className));
    }

    contains(className) {
        return this.#classes.has(className);
    }
}

class FakeElement {
    constructor(tagName, ownerDocument) {
        this.tagName = tagName.toUpperCase();
        this.ownerDocument = ownerDocument;
        this.classList = new FakeClassList();
        this.children = [];
        this.attributes = new Map();
        this.listeners = new Map();
        this.textContent = '';
        this.title = '';
        this.type = '';
    }

    append(...children) {
        this.children.push(...children);
    }

    appendChild(child) {
        this.append(child);
        return child;
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    getAttribute(name) {
        return this.attributes.get(name) ?? null;
    }

    addEventListener(type, listener) {
        const listeners = this.listeners.get(type) ?? [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
    }

    querySelector(selector) {
        if (selector !== '.cm-search-button') {
            throw new Error(`Unsupported selector in test: ${selector}`);
        }

        return this.children.find((child) => child.classList.contains('cm-search-button')) ?? null;
    }

    click() {
        const event = { preventDefault() {} };
        (this.listeners.get('click') ?? []).forEach((listener) => listener(event));
    }
}

class FakeDocument {
    createElement(tagName) {
        return new FakeElement(tagName, this);
    }
}

function createHost() {
    const document = new FakeDocument();
    return document.createElement('div');
}

test('mobile user gets one accessible search button that opens CodeMirror search', () => {
    const host = createHost();
    const calls = [];
    const editor = { focus: () => calls.push('focus') };
    const openSearchPanel = (view) => {
        assert.equal(view, editor);
        calls.push('open-search');
    };

    const firstButton = createMobileSearchButton({
        container: host,
        editor,
        openSearchPanel,
        label: 'Search',
        mobile: true,
    });
    const secondButton = createMobileSearchButton({
        container: host,
        editor,
        openSearchPanel,
        label: 'Search',
        mobile: true,
    });

    assert.equal(secondButton, firstButton);
    assert.equal(host.children.length, 1);
    assert.equal(firstButton.type, 'button');
    assert.equal(firstButton.getAttribute('aria-label'), 'Search');
    assert.equal(firstButton.title, 'Search');

    firstButton.click();

    assert.deepEqual(calls, ['focus', 'open-search']);
});

test('an existing search button is reused and upgraded for accessibility', () => {
    const host = createHost();
    const calls = [];
    const existingButton = host.ownerDocument.createElement('button');
    existingButton.classList.add('cm-search-button');
    existingButton.addEventListener('click', () => calls.push('existing-handler'));
    host.appendChild(existingButton);

    const button = createMobileSearchButton({
        container: host,
        editor: { focus: () => calls.push('extension-focus') },
        openSearchPanel: () => calls.push('extension-search'),
        label: 'Search',
        mobile: true,
    });

    assert.equal(button, existingButton);
    assert.equal(host.children.length, 1);
    assert.equal(button.textContent, 'Search');
    assert.equal(button.type, 'button');
    assert.equal(button.getAttribute('aria-label'), 'Search');
    assert.equal(button.title, 'Search');

    button.click();
    assert.deepEqual(calls, ['existing-handler']);
});

test('desktop user does not get a floating search button', () => {
    const host = createHost();

    const button = createMobileSearchButton({
        container: host,
        editor: { focus() {} },
        openSearchPanel() {},
        label: 'Search',
        mobile: false,
    });

    assert.equal(button, null);
    assert.equal(host.children.length, 0);
});

test('a reused extension button runs the latest editor and search command', () => {
    const host = createHost();
    const calls = [];
    const firstEditor = { focus: () => calls.push('focus-first') };
    const secondEditor = { focus: () => calls.push('focus-second') };

    const button = createMobileSearchButton({
        container: host,
        editor: firstEditor,
        openSearchPanel: () => calls.push('search-first'),
        label: 'Search',
        mobile: true,
    });
    createMobileSearchButton({
        container: host,
        editor: secondEditor,
        openSearchPanel: () => calls.push('search-second'),
        label: 'Search',
        mobile: true,
    });

    button.click();

    assert.deepEqual(calls, ['focus-second', 'search-second']);
});

test('a reused button runs the latest post-open localization callback', async () => {
    const host = createHost();
    const calls = [];
    const options = {
        container: host,
        editor: { focus() {} },
        openSearchPanel() {},
        label: 'Search',
        mobile: true,
    };

    const button = createMobileSearchButton({
        ...options,
        onSearchOpened: () => calls.push('first'),
    });
    createMobileSearchButton({
        ...options,
        onSearchOpened: () => calls.push('second'),
    });

    button.click();
    await new Promise((resolve) => queueMicrotask(resolve));

    assert.deepEqual(calls, ['second']);
});
