# SillyTavern용 CodeMirror

[SillyTavern의 확장 텍스트 편집기](https://github.com/SillyTavern/Extension-CodeMirror)를 개선한 포크입니다.

## 미리 보기

|일반 텍스트 모드|줄번호 및 바꾸기 표시|
|---|---|
|<img src="https://raw.githubusercontent.com/st-chd/chd-asset/refs/heads/main/Asset/codecode-Preview_1.png">|<img src="https://raw.githubusercontent.com/st-chd/chd-asset/refs/heads/main/Asset/codecode-Preview_2.png"> |

## 포크 수정 내역

### version: 1.2.2 (2026-11-24)

- `줄 번호 표시`를 켜면 줄 번호를 눌러 그 줄 전체를 선택할 수 있습니다. 위아래로 끌면 여러 줄이 선택되고, Shift를 누른 채 누르면 그 줄까지 선택이 늘어납니다. 모바일에서도 됩니다.
- 편집기가 더 빨리 열립니다. 모바일에서는 열자마자 키보드가 올라오지 않고, 편집할 곳을 눌러야 올라옵니다.
- 검색에서 `전체`를 눌렀을 때, 하나만 선택되지 않고 일치하는 곳이 모두 선택됩니다.
- Tab 키는 CSS, JavaScript 같은 코드를 편집할 때만 탭 문자를 넣습니다. 일반 글에서는 다음 버튼으로 넘어갑니다.
- 설정 패널에서 Esc를 누르면 편집기 전체가 아니라 설정 패널만 닫힙니다.
- 확장을 삭제할 때 데이터 정리를 고르지 않았는데도 설정이 지워지던 문제를 고쳤습니다.
- 모바일에서 줄 번호를 끌 때 한 줄이 더 칠해지던 문제를 고쳤습니다.
- 좁은 화면(320px)에서 `대/소문자 구분` 같은 검색 옵션 글자가 잘리던 문제를 고쳤습니다.

<details>
<summary><h3>이전 변경 내역</h3></summary>

### version: 1.2.1 (2026-10-26)

- 편집기에서 타이핑할 때 반응이 늦던 현상을 줄였습니다. 긴 글일수록 차이가 큽니다.
- 원래 입력창에는 글자마다 반영하지 않고 입력이 멈추면 한 번에 반영합니다. 편집기를 닫으면 남은 내용도 바로 반영됩니다.

### version: 1.2.0 (2026-09-14)

- CodeMirror 6 기반 편집기를 SillyTavern의 확장 텍스트 입력창에 맞췄습니다.
- 입력창의 메타데이터와 내용 앞부분을 보고 CSS, JavaScript, Java, Markdown을 자동 감지합니다.
- `일반 텍스트 모드`를 켜면 구문 강조 없이 SillyTavern 기본 글꼴로 표시합니다. 끄면 자동 감지로 돌아갑니다.
- `neo`, `idea`, `solarized light`, `duotone-light`, `nord`, `ayu-mirage`, `material-darker` 테마를 고를 수 있습니다.
- 설정 패널에서 `줄 번호 표시`, `전체 선택`, `복사`를 사용할 수 있습니다. 글꼴 크기는 SillyTavern 설정을 따릅니다.
- 검색 패널을 한국어로 옮기고 찾기·바꾸기 입력창 높이와 검색 버튼 글꼴을 메인 폰트 크기에 맞췄습니다. `바꾸기`를 켤 때만 바꾸기 입력과 버튼을 표시합니다.
- 모바일 검색 버튼과 좁은 화면 레이아웃을 지원합니다. 데스크톱에서는 `Ctrl`+`F`로 검색 패널을 열 수 있습니다.
- 다른 CodeMirror 확장이 이미 편집기를 만든 경우 중복 생성하지 않고 호환 편집기의 검색 기능을 재사용합니다.
- 테마와 줄 번호 표시 설정은 새로고침 후에도 유지됩니다.

### version: 1.1.0 (2026-07-18)

- 확장 편집기 하단 오른쪽에 모바일 검색 버튼을 추가했습니다.
- 좁은 화면에서도 CodeMirror 검색 패널을 사용할 수 있도록 터치 영역을 개선했습니다.
- 검색 패널의 찾기·바꾸기 UI를 한국어로 표시합니다.
- 검색 버튼의 높이와 정렬을 팝업의 OK 버튼에 맞췄습니다.
- 기본 라이트 테마와 다크 테마 전환 기능을 추가했습니다. 현재 버전에서는 `설정`의 테마 선택으로 통합했습니다.
- 다른 CodeMirror 확장이 함께 활성화되어도 편집기가 중복 생성되지 않도록 했습니다.
</details>

## 사용 방법

1. 다음 링크에서 확장 프로그램을 설치합니다.

```txt
https://github.com/st-chd/codecode
```

2. SillyTavern 화면에서 캐릭터 설명 등 입력창 주변의 `텍스트 영역 확장` 버튼을 클릭합니다.

## 출처 및 크레딧

- 원본 프로젝트: [SillyTavern/Extension-CodeMirror](https://github.com/SillyTavern/Extension-CodeMirror)
- 코드 검토와 수정, 테스트에 Codex(GPT)와 Claude를 사용했습니다.

## 라이선스

AGPLv3
