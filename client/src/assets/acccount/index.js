// ! что-то все идет по кривой
setInterval(function () {
  //get payload and check expire time

  let t_payload = JSON.parse(
    window.atob(localStorage.getItem("token")) // window.atob
  );
  if (t_payload.exp - 10 < Math.floor(Date.now() / 1000)) {
    get_new_tokens();
  }
}, 3000);

async function get_new_tokens() {
  let data_to_send = JSON.stringify({
    token: localStorage.getItem("token"),
    refresh_token: localStorage.getItem("refresh_token"),
  });
  let response = await fetch("/refresh_token", {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: data_to_send,
  });
  let result = await response.json();
  if (result.token) {
    localStorage.setItem("token", result.token);
    localStorage.setItem("refresh_token", result.refresh_token);
  } else {
    console.log(result);
  }
}

//sign_in("username","email","password");
async function sign_in(username, email, password) {
  let data_to_send = JSON.stringify({
    username: username,
    email: email,
    password: password,
  });
  let response = await fetch("/sign_in", {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: data_to_send,
  });
  let result = await response.json();
  console.log(result);
}

//log_in("email","password");
async function log_in(email, password) {
  let data_to_send = JSON.stringify({ email: email, password: password });
  let response = await fetch("/log_in", {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: data_to_send,
  });
  let result = await response.json();
  if (result.token) {
    localStorage.setItem("token", result.token);
    localStorage.setItem("refresh_token", result.refresh_token);
  } else {
    console.log(result);
  }
}

export { sign_in, log_in };
