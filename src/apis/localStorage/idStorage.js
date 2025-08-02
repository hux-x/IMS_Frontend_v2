export const storeuserId = (userId) => {
  localStorage.setItem("userId", userId);
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

export const removeUserId = () => {
  localStorage.removeItem("userId");
};