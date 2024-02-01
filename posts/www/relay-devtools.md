---
date: 2024-02-01
title: firefox에서 Relay Devtools 사용
---

## 개요

1. 파이어폭스에서 [Relay Devtools](https://relay.dev/docs/debugging/relay-devtools/) 확장 프로그램이 [지원되지 않음](https://github.com/relayjs/relay-devtools/issues/39)
2. [README 설명을 따라 firefox용 확장 프로그램](https://github.com/relayjs/relay-devtools?tab=readme-ov-file#from-source)을 직접 빌드시 다양한 오류 발생

## 해결

### node 21에서 node-gyp 오류

- 원인: 노후화된 `fsevents` 패키지 빌드 실패
- 해결: node 18 사용 (`nvm use 18`)

### yarn v4에서 중복 workspaces명 오류

- 원인: v1과 v4 workspace 구조 차이
- 해결: yarn v1 사용 (`yarn set version classic`)

### 빌드 시 `error:0308010C:digital envelope routines::unsupported` 오류

- 원인: [webpack@v4에서 노후화된 OpenSSL사용](https://github.com/webpack/webpack/issues/14532#issuecomment-947012063)
- 해결: `NODE_OPTIONS=--openssl-legacy-provider` 환경 변수 추가

### `shells/firefox/build/RelayDevTools.zip` 확장 프로그램 설치 실패

- 원인: [인증 정책으로 인해 미인증 확장 프로그램 설치 불가](https://support.mozilla.org/ko/kb/add-on-signing-in-firefox?as=u&utm_source=inproduct)
- 해결: 동일 문서의 [서명 되지 않은 부가 기능을 사용하기 위한 옵션은 어떤것이 있나요? (고급 사용자용)](https://support.mozilla.org/ko/kb/add-on-signing-in-firefox?as=u&utm_source=inproduct#w_seomyeong-doeji-anheun-buga-gineungeul-sayonghagi-wihan-obsyeoneun-eoddeongeosi-issnayo-gogeub-sayongjayong) 항목 참고
  1. firefox developer edition 설치
  2. `about:config` 주소로 접근
  3. `xpinstall.signatures.required`을 `false`로 설정해 미인증 확장 프로그램 허용
