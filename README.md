# wetube-reloaded
Wetube Clone built using NodeJS, Express, Mongo and ES6 💗

### dev script
nodemon을 실행시키고 파일이 변할 때마다 서버를 재시작해주는 nodemon은 babel-node src/server.js를 실행하는 것.

### dependencies & devDependencies 
dependencies -> 프로젝트가 돌아가기 위해 필요한 package들

전제 node_modules 폴더는 공유할 필요가 없다. 
그래서 유저가 package.json이 있는 상태에서 npm i만 하면 express가 설치됨. 
npm이 dependencies, devDependencies를 찾아서 모든 걸 자동으로 설치해줌. 

devDependencies -> 개발자가 개발할 때 필요한 것들. 
ex.nodemon (파일을 보고 있다가 변화가 생기면 commend를 재시작해줌.)
ex.babel (server.js를 babel-node로 돌리게끔 변환해주는 역할. 
         babel-node가 서버를 작동해서 babel이 섹시한 JavaScript를 이해하고, 평범한 node.js방식으로 변환해서 node.js 서버를 작동시키는 역할.)
         babel-node를 사용하려면, bable.config.json파일을 만들어야 한다. babel에 추가하고 싶은 plugin(최신 javascript를 사용하게 해주는 기능)을 넣은 것.

### Server 
서버를 만들고 requests를 listen해주기만 하면 된다!!!!! ex. port4000을 listening하고 있는 상태에서 보면 cannot GET / (root page)
--- 서버에 똑똑 문(routes) 두드리는 중~ --- 

URL(route)를 통해서 requests를 전달하는 것.

<HTTP Method>
GET 
request의 뜻 --> 브라우저가 nico 서버를 호출하면, 서버가 response를 보내주는 것. (우리가 뭔가를 요청했기 때문에 페이지를 받은 것이다.)

#### 브라우저는 서버에게 페이지를 request하는 것!
```
const handleHome = () => console.log("home");
app.get("/", handleHome);
```
-> 서버가 이 request를 받아들이고, 브라우저에게 "그래, 홈페이지를 가져가도 좋아!"라고 하고, 누군가 홈페이지에 오려고 하면 서버는 handleHome 함수를 실행시킨다.
