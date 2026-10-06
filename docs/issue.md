### CS 정리

#### CS07 - export가 큐에서 멈춤 - @max
- Studio 확인 필요 [Slack](https://deepbrain-ai.slack.com/archives/C056RH2R76E/p1786820851532429)
- 동시 처리에 걸린 것으로 예상됨.

#### CS29 - 영상 합성이 지나치게 오래 걸림 - 배포예정
- 해당 이슈는 CS22와 동일. Template에 과거 데이터가 있었고, 해당 데이터로 요청이 들어와 찾을 수 없던 상태였음
  Studio에서 내보내기 전 신규 데이터로 치환해서 백엔드 요청하도록 수정 진행 중 <- 배포예정 (@Max)

- 에러가 발생했지만, Error로 변경되지 않은이유
  - Backend에서 Project (studio DB)가 업데이트 되기 전 Error를 리턴해서, 업데이트가 되지않음. -> @dewei 수정 예정
