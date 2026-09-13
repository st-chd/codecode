[README(EN)](README-EN.md)
# SillyTavern용 CodeMirror

[SillyTavern의 확장 텍스트 편집기](https://github.com/SillyTavern/Extension-CodeMirror)를 개선한 포크입니다.

## 포크 수정 내역

### 1.2.0 (2026-09-13)

- 확장 편집기의 원래 입력창 정보와 내용을 기반으로 CSS, JavaScript, Java, Markdown을 자동 감지합니다. 설정에서 언어를 직접 선택하거나 일반 텍스트로 전환할 수 있습니다.
- 기본 밝은색, One Dark, Dracula, Monokai, Solarized Light/Dark 테마를 제공합니다.
- 하단 `설정`에서 줄 번호 표시와 글꼴 크기(10~32px)를 조절할 수 있습니다. 테마와 표시 설정은 다음 편집기와 새로고침 후에도 유지됩니다.
- `전체 선택` 버튼을 추가했습니다. 검색창의 `전체`는 검색 결과만 선택합니다.
- 검색창은 찾기 기능만 먼저 표시하며, `바꾸기`를 체크했을 때만 바꿀 문자열과 바꾸기 버튼을 표시합니다. 검색창을 닫았다 다시 열면 바꾸기는 숨겨집니다.
- 모바일 검색창을 좁은 화면에 맞춰 정리했으며, 데스크톱에서는 Ctrl+F / Cmd+F로 같은 검색창을 열 수 있습니다.

자동 감지는 추정이므로 혼합된 문서에서는 직접 언어를 지정하세요. 수동 언어 선택은 현재 편집기에만 적용됩니다. 다른 CodeMirror 확장이 먼저 편집기를 생성하면 기존 호환 동작에 따라 검색 버튼만 추가합니다.

Dracula, Monokai, Solarized는 [CodeMirror 5 테마](https://codemirror.net/5/demo/theme.html)의 팔레트를 CodeMirror 6에 맞춰 적용하고 일부 색상의 대비를 조절했습니다.

### 이전 변경

수정일: 2026-07-18

- 확장 편집기 하단 오른쪽에 모바일 검색 버튼을 추가했습니다.
- 좁은 화면에서도 CodeMirror 검색 패널을 사용할 수 있도록 터치 영역을 개선했습니다.
- 검색 패널의 찾기·바꾸기 UI를 한국어로 표시합니다.
- 검색 버튼의 높이와 정렬을 팝업의 OK 버튼에 맞췄습니다.
- 기본 라이트 테마와 다크 테마 전환 기능을 추가했습니다. 현재 버전에서는 `설정`의 테마 선택으로 통합했습니다.
- 다른 CodeMirror 확장이 함께 활성화되어도 편집기가 중복 생성되지 않도록 했습니다.
- 호환 가능한 편집기를 안전하게 재사용하고, 팝업을 닫으면 원래 입력창을 복원합니다.
- 다른 확장이 소유한 검색 버튼의 동작을 변경하지 않도록 상태를 분리했습니다.
- 팝업이 닫힐 때 확장이 생성한 편집기 인스턴스를 정리합니다.
- 모바일 검색 기능과 지연된 편집기 초기화를 자동 테스트로 검증합니다.

## 사용 방법

1. 다음 링크에서 확장 프로그램을 설치합니다.

```txt
https://github.com/st-chd/codecode
```

2. SillyTavern 화면에서 캐릭터 설명 등 입력창 주변의 `텍스트 영역 확장` 버튼을 클릭합니다.

**사용자는 npm이나 별도 패키지를 설치할 필요가 없습니다.** 저장소에 포함된 `dist/index.js`에 편집기, 언어 지원, 테마와 스타일이 모두 들어 있습니다.

## 개발자용 빌드 및 배포

1. 저장소를 복제합니다.
2. `npm install`을 실행합니다.
3. `npm run build`를 실행합니다.
4. 축소된 확장 번들은 `/dist` 폴더에 생성됩니다.
5. 배포할 때 소스와 함께 `dist/index.js`, `manifest.json`, `package-lock.json` 변경사항도 포함하세요. `node_modules`는 배포하지 않습니다.

표시 설정은 SillyTavern의 `extension_settings.codecode`에 저장합니다. 브라우저 저장소나 별도 파일은 생성하지 않습니다. 확장 정리·삭제 훅을 지원하는 SillyTavern에서는 정리 또는 삭제 시 이 설정을 제거합니다. 이전 버전에서 훅을 지원하지 않으면 작은 설정 항목이 남을 수 있습니다.

## 테스트 방법

```bash
npm test
```

## 출처 및 크레딧

- 원본 프로젝트: [SillyTavern/Extension-CodeMirror](https://github.com/SillyTavern/Extension-CodeMirror)
- 이 저장소는 원본 프로젝트를 기반으로 수정한 포크입니다.
- 코드 검토·수정·테스트에 Codex(GPT)와 Claude를 사용했습니다.

## 라이선스

AGPLv3
