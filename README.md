# wetube-reloaded

Wetube Clone built using NodeJS, Express, Mongo and ES6 💗

### dev script

nodemon을 실행시키고 파일이 변할 때마다 서버를 재시작해주는 nodemon은 babel-node src/server.js를 실행하는 것.

### dependencies & devDependencies

#### dependencies -> 프로젝트가 돌아가기 위해 필요한 package들

- 전제 node_modules 폴더는 공유할 필요가 없다.
- 그래서 유저가 package.json이 있는 상태에서 npm i만 하면 express가 설치됨.
- npm이 dependencies, devDependencies를 찾아서 모든 걸 자동으로 설치해줌.

#### devDependencies -> 개발자가 개발할 때 필요한 것들.

- ex.nodemon (파일을 보고 있다가 변화가 생기면 commend를 재시작해줌.)
- ex.babel (server.js를 babel-node로 돌리게끔 변환해주는 역할.
  babel-node가 서버를 작동해서 babel이 섹시한 JavaScript를 이해하고, 평범한 node.js방식으로 변환해서 node.js 서버를 작동시키는 역할.)
- babel-node를 사용하려면, bable.config.json파일을 만들어야 한다. babel에 추가하고 싶은 plugin(최신 javascript를 사용하게 해주는 기능)을 넣은 것.

### Server

- 서버를 만들고 requests를 listen해주기만 하면 된다!!!!! ex. port4000을 listening하고 있는 상태에서 보면 cannot GET / (root page)
  --- 서버에 똑똑 문(routes) 두드리는 중~ ---

- URL(route)를 통해서 requests를 전달하는 것.

<HTTP Method>
GET 
request의 뜻 --> 브라우저가 nico 서버를 호출하면, 서버가 response를 보내주는 것. (우리가 뭔가를 요청했기 때문에 페이지를 받은 것이다.)

#### 브라우저는 서버에게 페이지를 request하는 것!

```
const handleHome = () => console.log("home");
app.get("/", handleHome);
```

-> 서버가 이 request를 받아들이고, 브라우저에게 "그래, 홈페이지를 가져가도 좋아!"라고 하고, 누군가 홈페이지에 오려고 하면 서버는 handleHome 함수를 실행시킨다.

### Router

: mini application

#### 도메인 별로 나누는 것이 필요~

#### 라우터는 작업중인 주제를 기반으로 URL을 그룹화해준다.

#### url이 어떻게 시작하는지에 딸 나누는 방법.

router가 없으면 url을 개별로 길게 길게 늘여서 쓰는 방법으로 코딩을 해야 하는데 그것은 매우 비효율적이다.

##### global Router

- / -> Home
- /join -> Join
- /login -> Login
- /search -> Search

##### user Router

- /users/:id -> See User
- /users/logout -> Log Out
- /users/edit -> Edit My Profile
- /users/delete -> Delete(Remove) My Profile

##### video Router

- /videos/:id -> See Video
- /videos/:id/edit -> Edit Video
- /videos/:id/delete -> Delete(Remove) Video
- /videos/upload -> Upload Video

##### more info...

- import할 때 경로설정 시
  "../" : 지금 있는 폴더에서 벗어나는 걸 의미함.
  "./" : 지금의 장소를 의미함.
- export default 할 1개의 경우는 'export default 경로';
- export default 할 여러 개의 경우는 여러개의 해당하는 코드 앞쪽에 export를 넣는다.
- 그리고 두 개의 다른 파일을 import할 때 object{}를 쓴다.

#### Router Parameter

- ":id"
  -> id = 변수, parameter(숫자 같은 url을 가지는 걸 가능하게 해주는 역할)
  -> : = 텍스트가 아니라 변수로 만들어주는 역할.
  express는 request object에 이 parameter를 보내준다.
  ```
  videoRouter.get("/upload", upload);
  videoRouter.get("/:id", see);
  videoRouter.get("/:id/edit", edit);
  ```

### Pug

#### pug라는 유저가 보여줄 html로 리턴해주는 파일이다.

- 아래와 같이 설정해줄 것!

  ```
  app.set("view engine", "pug");
  app.set("views", process.cwd() + "/src/views")
  ```

#### pug라는 템플릿에 어느 javascript code라도 넣을 수 있다. ex. footer.pug

#### 그 javascript code를 실행해서 그걸 유저에게 제공해주는 역할을 '렌더링'이라고 부른다.

#### 렌더링할 때 보내는 인수는 2가지인데, render("view의 이름", {템플릿에 보낼 변수} )

- 깔끔한 html을 작성하도록 해주기 때문이다.
- 우리의 html에 javascript를 포함시켜주기 때문이다.

#### pug의 변수를 적을 때는 #{} 이라고 쓴다.

#### includes(파일포함)

- 반복하지 않아도 되고 partials폴더를 사용하여 한 파일로 모든 템플릿을 업데이트 할 수 있기 때문이다. ex. include partials/footer.pug

#### inheritance(상속) with extends and block

- base.pug 기본 베이스에 따라 home, watch, edit은 extends(확장) 하게 될 것임. ex. extends base.pug

- base.pug에 content를 위한 공간이 마련되어야 함. ex. block content
  block: 창문 또는 문 이라 생각하자.

### MVP styles (Minimal Viable Product.css)

https://andybrewer.github.io/mvp/ 사용해서 base.pug에 넣는다.

- 꽤 괜찮은 스타일들을 HTML 태그에 입히는 역할을 함.

### Conditionals & Iteration & Mixin

- Conditional : 조건문 사용해보기
- Iteration: list의 모든 element들을 HTML에 보여주는 것.
  -> array의 모든 element에 대해 특정 행동을 취할 때 사용함.
- mixin: 다른 데이터를 포함하지만 같은 형태의 HTML을 보여주는 것.
  - footer.pug는 partial를 사용한 이유와 같지만, 이 부분은 보여주는 용도로 쓰일 뿐이다.
  - video.pug는 mixin을 사용하여, 보여줄 뿐만 아니라 데이터도 받을 수 있는 기능까지 추가한 이유이다. '+' 사용!
    -> 데이터를 받을 수 있는 일종의 미리 만들어진 Html block이라 볼 수 있다. Html코드를 재사용하는 기능.
- partial와 mixin은 template에 include 해줘야한다.

### GET & POST

- GET : 가져온다!
- POST : 수행한다!
- redirect : 다시보내다
- parameter : 매개변수

* express는 form으로 보낸 데이터를 읽지 못한다.
* input에 name설정을 해주지 않으면 데이터가 전송되지 않는다!!!

### MongoDB & Mongoose

1. wsl 터미널을 연다.
2. 'sudo apt update'을 입력하고,
3. 'sudo apt-get install mongodb'을 입력하고 설치한다.
4. 'mongod --version'을 입력하고 설치가 되어있는지 확인한다.
5. 반드시 몽고를 사용할 수 있게 서비스 시작!
   > sudo service mongodb start
6. 몽고 사용하기

   > mongo

7. 내가 가진 db 보기

   > show dbs

8. 현재 사용 중인 db 확인

   > db

9. 사용할 db 선택하기

   > use dbName
   > (현재 수업에서는 `use wetube`)

10. db 컬렉션 보기

    > show collections

11. db 컬렉션 안에 documents 보기

    > db.collectionName.find()
    > (현재 수업에서는 `db.videos.find()`)

12. db 컬렉션 안에 documents 모두 제거하기
    > db.collectionName.remove({})
    > (현재 수업에서는 `db.videos.find({})`)
13. 다 사용했으면 서비스를 종료!

    > sudo service mongodb stop

14. 지금 서비스가 실행중인지 알 수 있다.
    > sudo service mongodb status
    - ([OK] or not [Fail])

- CRUD -> Create / Read / Update / Delete

### Callback식 vs Promise식

- Callback식으로 하면,

```
console.log("start")   // 첫번째 순서,
Video.find({}, (error, videos) => {
  if(error) {
    return res.render("server-error")
  }
  return res.render("home", { pageTitle: "Home", videos });
});  // 세번째 순서
console.log("finished")   // 두번째 순서,
```

- Promise식으로 하면,

```
export const home = async (req, res) => {
  try {
    const videos = await Video.find({});  // await사용 때문에 이 코드부터 차례대로 실행됨.
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};
```

-> await사용시 해당함수가 async일 때만 가능하다.

#### return & render

1. return의 역할 : 본질적인 return의 역할보다는 function을 마무리짓는 역할로 사용되고 있음.

- 이러한 경우 return이 없어도 정상적으로 동작하지만 실수를 방지하기 위해 return을 사용.

2. render한 것은 다시 render할 수 없다.

- redirect(). sendStatus(). end() 등등 포함 (express에서 오류 발생하기 때문)

### More...

- Model.findByIdAndUpdate()로 불러오기와 수정을 한방에~
- Model.exists(id를 적용하는 코드) --- ex.Video.exists({\_id: id})
- 생성이나 업데이트 전 작동해야 할 function의 필요성 => Mongoose의 Middleware를 활용한다.

- Model.findOneAndDelete() >> Model.findOneAndRemove() delete를 사용할 것!
- 위 표현을 줄인 것이 : Model.findByIdAndDelete()

- 정규식 표현 regular expression

  - 연습사이트 : https://regex101.com/
  - MDN 공식 문서 : https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions
  - 정규표현식 주요사용 : https://www.regexpal.com
  - 몽고db regex : https://docs.mongodb.com/manual/reference/operator/query/regex
  - RegExp Mdn : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp

  - 예시 코드

  ```
  $regex: new RegExp(`keyword`, "i")  -> keyword 단어포함.
  $regex: new RegExp(`^${keyword}`, "i")  -> keyword로 시작하는 것만.
  $regex: new RegExp(`${keyword}$`, "i")  -> keyword로 끝나는 것만.
  ```

- req.params : video link를 클릭하면 url에 id를 받을 수 있다.
- req.body : form을 보내면 그 내용을 req.body로 받을 수 있다.
- req.query : search 화면에서 keyword를 받을 수 있다. 즉, URL에 있는 모든 정보들을 확인할 수 있다.
