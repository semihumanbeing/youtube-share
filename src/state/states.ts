import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: JSON.parse(localStorage.getItem("user") || "{}"),
});

export const accessTokenState = atom({
  key: "accessTokenState",
  default: localStorage.getItem("accessToken") || "",
});

export const refreshTokenState = atom({
  key: "refreshTokenState",
  default: localStorage.getItem("refreshToken") || "",
});
