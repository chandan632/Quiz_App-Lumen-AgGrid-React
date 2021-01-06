import jwt from "jwt-decode";

const isLoggedIn = () => {
  try {
    // const token = localStorage.getItem("token");
    const token = getCookie("token");
    if (token) {
      const decodedData = jwt(token);
      return decodedData.exp * 1000 > Date.now();
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const isAdmin = () => {
  try {
    // const token = localStorage.getItem("token");
    const token = getCookie("token");
    if (token) {
      const decodedData = jwt(token);
      return (
        decodedData.name === "Admin" &&
        decodedData.userEmail === "admin@gmail.com"
      );
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const username = () => {
  // const token = localStorage.getItem("token");
  const token = getCookie("token");
  if (token) {
    const decodedData = jwt(token);
    return decodedData;
  }
};

const setCookie = (name, value, day) => {
  const d = new Date();
  d.setTime(d.getTime() + day * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toGMTString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

const getCookie = (name) => {
  const decodedCookie = decodeURIComponent(document.cookie);
  console.log("decoded", decodedCookie);
  const ca = decodedCookie.split(";");
  console.log("ca", ca);
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(`${name}=`) == 0) {
      return c.substring(`${name}=`.length, c.length);
    }
  }
  return "";
};

const expireCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export { isAdmin, isLoggedIn, username, setCookie, getCookie, expireCookie };
