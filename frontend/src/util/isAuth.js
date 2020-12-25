import jwt from "jwt-decode";

const isLoggedIn = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedData = jwt(token);
      if (decodedData.exp * 1000 > Date.now()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const isAdmin = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedData = jwt(token);
      if (
        decodedData.name === "Admin" &&
        decodedData.userEmail === "admin@gmail.com"
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const username = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedData = jwt(token);
    return decodedData;
  }
};

export { isAdmin, isLoggedIn, username };
