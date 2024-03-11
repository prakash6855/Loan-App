export const isUserLoggedIn = () => {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {});

  return cookies.token && cookies.userID && cookies.isAdmin === "false";
};

export const getUserDataFromCookie = () => {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {});

  const userData = {
    userID: cookies.userID || null,
    token: cookies.token || null,
  };

  return userData;
};

export const logout = () => {
  // Clear all cookies by setting their expiration date to a past date
  document.cookie.split(";").forEach((cookie) => {
    const [name, _] = cookie.split("="); // Split cookie into name and value
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};
