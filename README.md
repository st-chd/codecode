[README(EN)](README-EN.md)
# SillyTavern용 CodeMirror

[SillyTavern의 확장 텍스트 편집기](https://github.com/SillyTavern/Extension-CodeMirror)를 개선한 포크입니다.

## 포크 수정 내역

수정일: 2026-07-18

- 확장 편집기 하단 오른쪽에 모바일 검색 버튼을 추가했습니다.
- 좁은 화면에서도 CodeMirror 검색 패널을 사용할 수 있도록 터치 영역을 개선했습니다.
- 검색 패널의 찾기·바꾸기 UI를 한국어로 표시합니다.
- 검색 버튼의 높이와 정렬을 팝업의 OK 버튼에 맞췄습니다.
- CodeMirror는 기본 라이트 테마를 사용하며, 팝업 하단의 버튼으로 다크 테마로 전환할 수 있습니다.
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

## 빌드 방법

1. 저장소를 복제합니다.
2. `npm install`을 실행합니다.
3. `npm run build`를 실행합니다.
4. 축소된 확장 번들은 `/dist` 폴더에 생성됩니다.

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
