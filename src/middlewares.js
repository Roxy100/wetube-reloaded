// locals는 뭐든 할 수 있는 object.
// 내 템플릿이 locals object에 접근할 수 있다.
// 즉, pug 템플릿 어디에서든 접근할 수 있다.
// import나 render를 하지 않아도 된다.
// 그냥 locals 안에 넣기만 하면 pug 템플릿에서 쓸 수 있다.
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  next();
};
