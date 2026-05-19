### Backend Worker 등록

0. Api Endpoint 생성
- taskObj
```javscript
const taskObj = {
  task_id, // mongo object id // new ObjectId()
  type: 'chat_product_export',
  values: {
    userId: user_id,
    webhook_url,
    scenes: [
      {
        scene_id: 0,
        state: "ready",
        L300_ai_model: {
          gpuGroup: "auto",
          gpuType: "auto",
        },
        text_ai_speak_ipa: { isTTS: false, tts: null },
        text_ai_speak: "",
        generate_info
      }
    ],
    skipModelValidation: true
  }
};
```
  - scene 배열 내부에 필요 데이터 적재
  - skipModelValidation: true -> 모델 검증 건너뛰기

1. Task Type 생성
> 0 단계에서 생성시 작성했던 type 등록 단계

`task_schedule_step.json`
- 스케쥴 등록
  ```json
  "chat_product_export": [
    {
      "type": "scene",
      "server_type": "worker-cpu",
      "worker_type": "chat_product_export",
      "is_gateway": true,
      "dedicate_server": true,
      "scene_end_state": "chat_product_export_end",
      "scene_state": [
        "ready",
        "chat_product_export_error"
      ]
    },
    {
      "type": "task",
      "worker_type": "chat_product_export_publish",
      "no_use_server": true,
      "scene_state": [
        "chat_product_export_end",
        "chat_product_export_publish_error"
      ],
      "is_last_step": true
    }
  ]
  ```
  - `type`: "scene" or "task" 타입
    - scene: taskObj에서 scenes에 들어있는 수만큼 병렬로 동작함
    - task: task 전체 동작
  - `worker_type`: 해당 스텝을 동작할 워커
  - `server_type`: 해당 워커가 동작할 서버
  - `is_gateway`: gateway로 전달하여 동작할지 여부 (default: false)
  - `dedicate_server`: 서버를 해당 테스크로 점유해서 동작할지 여부
  - `no_use_server`: 타 서버를 사용하지 않고 backend-worker 자체 처리 여부
  - `scene_state`: 배열내에 들어가있는 상태일경우 해당 스텝 실행
  - `scene_end_state`: 해당 스텝 종료시 상태지정
  - `is_last_step`: 최종 스텝 여부

`base_policy.json`
> 해당 테스크 타입을 실행 시킬수 있는 권한이 있는지 체크
또는 서버 할당갯수, 리트라이 횟수등을 정해둘 수 있다. (거즘 사용되지 않음.)

- apply_type에 해당 테스크타입 추가

2. Worker 생성
> 1에서 step에 작성한 워커 파일 생성

- lib/workers 하위에 생성
- lib/workers/index.js에 해당 파일 등록
- lib/workers/worker_config.json에 해당 파일 및 워커 등록
  - exec_type이 있는데 'require' or 'fork'가 있으나 Only **require**

[참고]
- `lib/workers/SomeThing/Somthing_worker.js` 파일 생성시
  worker 이름은 `SomeThing_Somthing`가 됨.
  - `lib/redis/task/task-runner.js` - `getWorkerInfo` 참고

3. Serverless 호출

```js
const serverlessEnabled = await canUseServerless(<server-type>);

if (serverlessEnabled) {
  const storageOptions = getServerlessStorageOptions(STORAGE_TARGET.<TARGET>, {
    save_path: ``,
    isTemporary: boolean // 임시 저장 여부
  });

  await setTaskStateChange({
    type: "progress",
    result: 0,
    data: {
      isGateway: true,
      ...reqData,
      ...storageOptions
    }
  });
}
```
- `progress` type으로 data에 isGateway: true로 전달시 Gateway queue에 잡 등록
