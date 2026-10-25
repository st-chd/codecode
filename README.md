# SillyTavern용 CodeMirror

[SillyTavern의 확장 텍스트 편집기](https://github.com/SillyTavern/Extension-CodeMirror)를 개선한 포크입니다.

## 포크 수정 내역

### version: 1.2.1 (2026-10-26)

- 편집기에서 타이핑할 때 반응이 늦던 현상을 줄였습니다. 긴 글일수록 차이가 큽니다.
- 입력창에 글자마다 반영하지 않고 입력이 멈추면 한 번에 반영합니다. 편집기를 닫을 때 남은 내용도 바로 반영되니 입력한 내용이 사라지지 않습니다.

<details>
<summary><h3>이전 변경 내역</h3></summary>

### version: 1.2.0 (2026-09-14)

- CodeMirror 6 기반 편집기를 SillyTavern의 확장 텍스트 입력창에 맞췄습니다.
- 입력창의 메타데이터와 내용 앞부분을 보고 CSS, JavaScript, Java, Markdown을 자동 감지합니다.
- `일반 텍스트 모드`를 켜면 구문 강조 없이 SillyTavern 기본 글꼴로 표시합니다. 끄면 자동 감지로 돌아갑니다.
- `neo`, `idea`, `solarized light`, `duotone-light`, `nord`, `ayu-mirage`, `material-darker` 테마를 고를 수 있습니다. 밝은 테마 4개와 어두운 테마 3개입니다.
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
- 코드 검토·수정·테스트에 Codex(GPT)와 Claude를 사용했습니다.

## 라이선스

AGPLv3
