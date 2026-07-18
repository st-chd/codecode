# CodeMirror for SillyTavern

A fancier expanded text editor

## Fork changes

Modified on 2026-07-18:

- Added an accessible mobile search button to the bottom-right of the expanded editor.
- Made the CodeMirror search panel usable on narrow screens with 44px touch targets.
- Localized the CodeMirror search controls in Korean.
- Matched the mobile search button height and row alignment with the popup's OK button.
- Prevented duplicate editors when another compatible CodeMirror extension is enabled.
- Reused compatible editors safely and restored the original textarea when the dialog closes.
- Kept search-button state isolated from buttons owned by other extensions.
- Destroyed extension-owned editor instances when their dialog closes.
- Added automated tests for the mobile search control and deferred editor setup.

Development note: This fork was reviewed, tested, and updated with OpenAI Codex (GPT).

## How to use

1. Install the extension via the link:

```txt
https://github.com/SillyTavern/Extension-CodeMirror
```

2. Click on any of the "Expand text area" buttons in the SillyTavern UI (i.e. near the character description).

## How to build

1. Clone the repo
2. Run `npm install`
3. Run `npm run build`
4. Minimized extension bundle file will be in the `/dist` folder

## How to test

Run `npm test`.

## License

AGPLv3
