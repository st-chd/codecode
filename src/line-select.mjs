import { lineNumbers, EditorView, Decoration } from '@codemirror/view';
import { StateEffect, StateField } from '@codemirror/state';

// 포커스가 없는 동안(모바일에서 키보드를 띄우기 전)에는 브라우저 선택이 보이지 않아, 드래그 범위를 줄 배경으로 대신 보여 준다.
const setPreview = StateEffect.define();
const previewField = StateField.define({
    create: () => Decoration.none,
    update(deco, tr) {
        for (const effect of tr.effects) {
            if (!effect.is(setPreview)) continue;
            if (!effect.value) return Decoration.none;
            const { from, to } = effect.value;
            const ranges = [];
            for (let pos = from; pos <= to;) {
                const line = tr.state.doc.lineAt(pos);
                ranges.push(Decoration.line({ class: 'cm-codecode-lineSelect' }).range(line.from));
                pos = line.to + 1;
            }
            return Decoration.set(ranges);
        }
        return deco.map(tr.changes);
    },
    provide: (field) => EditorView.decorations.from(field),
});

const EDGE = 32;

function lineEnd(doc, line) {
    return line.number < doc.lines ? line.to + 1 : line.to;
}

function lineAtY(view, clientY) {
    return view.state.doc.lineAt(view.lineBlockAtHeight(clientY - view.documentTop).from);
}

// 줄 번호를 누르면 그 줄 전체를, 끌면 지나간 줄들을 선택한다. Shift+클릭은 기존 선택 시작점부터 넓힌다.
function startLineSelect(view, block, event) {
    if (event.button !== 0) return false;
    const doc = view.state.doc;
    const startLine = doc.lineAt(block.from);
    const extendFrom = event.shiftKey ? view.state.selection.main.anchor : null;
    if (event.pointerType === 'mouse') view.focus();
    const preview = !view.hasFocus;
    let lastY = event.clientY;
    let frame = 0;

    const select = (line) => {
        let anchor;
        let head;
        if (extendFrom !== null) {
            anchor = extendFrom;
            head = anchor <= line.from ? lineEnd(doc, line) : line.from;
        } else if (line.number >= startLine.number) {
            anchor = startLine.from;
            head = lineEnd(doc, line);
        } else {
            anchor = lineEnd(doc, startLine);
            head = line.from;
        }
        const effects = preview ? setPreview.of({ from: Math.min(anchor, head), to: Math.max(anchor, head) }) : [];
        view.dispatch({ selection: { anchor, head }, effects });
    };

    // 손가락이나 마우스를 편집기 위아래 끝에 두면 계속 스크롤하며 선택을 넓힌다.
    const autoScroll = () => {
        frame = 0;
        const rect = view.scrollDOM.getBoundingClientRect();
        let delta = 0;
        if (lastY < rect.top + EDGE) delta = -Math.min(EDGE, rect.top + EDGE - lastY);
        else if (lastY > rect.bottom - EDGE) delta = Math.min(EDGE, lastY - (rect.bottom - EDGE));
        if (!delta) return;
        view.scrollDOM.scrollTop += delta;
        select(lineAtY(view, Math.max(rect.top, Math.min(rect.bottom - 1, lastY))));
        frame = requestAnimationFrame(autoScroll);
    };

    const move = (e) => {
        if (e.pointerId !== event.pointerId) return;
        lastY = e.clientY;
        select(lineAtY(view, lastY));
        if (!frame) frame = requestAnimationFrame(autoScroll);
    };
    const end = (e) => {
        if (e.pointerId !== event.pointerId) return;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', end);
        window.removeEventListener('pointercancel', end);
        cancelAnimationFrame(frame);
        if (preview) {
            view.dispatch({ effects: setPreview.of(null) });
            view.focus();
        }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    select(startLine);
    return true;
}

export function lineNumberGutter() {
    return [
        previewField,
        lineNumbers({ domEventHandlers: { pointerdown: startLineSelect } }),
    ];
}
