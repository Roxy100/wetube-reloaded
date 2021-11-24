import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "lsgtubee/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "lsgtubee/videos",
  acl: "public-read",
});

// locals는 뭐든 할 수 있는 object.
// 내 템플릿이 locals object에 접근할 수 있다.
// 즉, pug 템플릿 어디에서든 접근할 수 있다.
// import나 render를 하지 않아도 된다.
// 그냥 locals 안에 넣기만 하면 pug 템플릿에서 쓸 수 있다.
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  // loggedInUser에 접근하려는데 로그인 되어 있지 않으면 생기는 에러라서.
  // loggedInUser가 undefined라는 콘솔 결과가 나옴.
  // 그래서 뒤에 or(||) 와 빈 object({})를 추가해준다.
  res.locals.isHeroku = isHeroku;
  next();
};

// <로그인 돼 있는 사람들만 접근 할 수 있게 하는 middleware.>
// User가 loggledIn 돼 있다면, 요청을 계속하게 하고
// loggedIn 돼 있지 않은 걸 확인하면, /login 페이지로 redirect 해준다.
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

// <로그인 돼 있지 않은 사람들만 접근 할 수 있게 하는 middleware.>
// User가 loggedIn 돼 있지 않다면, 요청을 계속하게 하고
// loggedIn 돼 있다면, 홈"/" 으로 redirect 해준다.
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

// User가 보낸 파일을 uploads/avatars 폴더에 저장하도록 설정된 middleware.
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

// User가 보낸 파일을 uploads/video 폴더에 저장하도록 설정된 middleware.
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 80000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});
