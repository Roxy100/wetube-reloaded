import User from "../models/User";
// node-fetch: fetch엔 서버에는 없고 브라우저에만 존재하니깐 만든 것.
import fetch from "node-fetch";
// because password compare
import bcrypt from "bcrypt";

// <Join>
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

// <Login>
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  // check if account exists
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An Account with this username does not exists.",
    });
  }
  // check if password correct
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  // user가 로그인하면 그 유저에 대한 정보를 세션에 담는다.
  req.session.loggedIn = true;
  // DB에서 찾은 user 정보를 추가해서 세션에 저장한다.
  req.session.user = user;
  return res.redirect("/");
};

// <Social Login by Github>
// Github에 user를 보낸다.
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
// User가 "예" 라고 하면,
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code, // Github가 준 code
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  // 그 URL로 POST request를 보낸다.
  // Github은 User에게 access_token을 준다.
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  // access_token은 Github API와 상호작용 할 때 쓴다.
  // access_token만 있다면, Github API에 어떤 method를 보내더라도 응답을 보내준다.
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    // User 프로필을 받기 위해 요청할 수 있다.
    // 그 요청은 `${apiUrl}/user`로 갈 것이다.
    // access_token을 보내면, User 데이터를 받을 수 있을 것이다.
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // email API에게도 요청도 보내야 한다.
    // access_token을 보내면,
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // email array를 줄 것이다.
    // email array에서 primary이면서 verified된 email을 찾을 것이다.
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    // 만일 찾지 못한다면, User를 login페이지로 돌아가게 만든다.
    if (!emailObj) {
      // set notification
      return res.redirect("/login");
    }
    // 만일 email 조건을 찾게 된다면, DB에서 해당 email을 찾을 것인데...
    let user = await User.findOne({ email: emailObj.email });
    // 해당 email을 찾지 못했을 경우, 그 email로 User를 만들 것이다.
    if (!user) {
      // Create account (해당 email과 Github이 보낸 모든 데이터를 가지고)
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    // 해당 email을 찾았을 경우, User를 login 시킬 것이다.
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

// <Log out>
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

// <Edit Profile>
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = (req, res) => {
  return res.render("edit-profile");
};
export const edit = (req, res) => res.send("Edit User");
export const see = (req, res) => res.send("See User");
