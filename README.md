# Youtube share WEB
![image](https://github.com/semihumanbeing/youtube-share/assets/99929191/63dad01e-07bf-45ad-93f2-78514263880b)

친구들과 음악을 함께 들으며 채팅할 수 있는 웹사이트 

---
### stacks
Front-end: React.js, Typescript <br>
Back-end: Java, SpringBoot, Websocket, Redis, MariaDB <br>
Server: Google cloud platform, Nginx <br>

---
배포방법
- npm run build
- GCP에서 ./web_deploy

---
### 대시보드
- [x]  채팅방 리스트
- [x]  비밀번호가 있으면 비번을 입력하고 들어가야함
- [x]  방에 들어갈때 로그인 여부 확인
- [x]  내 방을 삭제할 수 있는 기능

### 채팅

- [x]  리액트 웹소켓설정
- [x]  채팅 컴포넌트만들기
- [x]  엔터를 누르면 채팅이 올라가도록하기

### 유투브 화면

[npm: react-player](https://www.npmjs.com/package/react-player)

- [x]  각각의 유투브 페이지는 해당하는 방 안에서 재생됨
- [x]  유투브 화면 표시하기
- [x]  플레이리스트의 첫번째 동영상 재생, 재생 완료 시 다음 동영상으로 이동
- [x]  사용자는 유투브 화면을 조작할 수 없음
- [x]  다음 버튼을 누르면 다음 동영상 재생
- [ ]  현재 보고있는 시간은 사용자 전체가 동일해야함
- [x]  동영상이 없으면 추가하라는 메시지가 담긴 빈 화면 넣기

### 플레이리스트

- [x]  전체 리스트 조회
- [x]  큐 형태로 제작
- [x]  리스트 내에서 추가 제거 기능
- [x]  추가 제거 기능이 전체 사용자에게 동기화

### 동영상 검색

- [x]  modal 띄우기
- [x]  동영상은 한번에 30개 볼 수 있음
- [x]  유투브 검색하고 선택한 값을 플레이리스트에 추가

### 방

방 안에는 유투브와 채팅 컴포넌트가 있음

- [x]  인덱스에서 방으로 이동하면 채팅창과 유투브 화면이 있는 방으로 이동함
- [x]  매 방은 플레이리스트가 있고 사용자는 유투브 검색을 해 플레이리스트에 추가함
- [ ]  방의 주소를 공유하는 기능
