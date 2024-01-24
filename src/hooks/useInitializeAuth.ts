// hooks/useInitializeAuth.js

import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  userState,
  accessTokenState,
  refreshTokenState,
} from "../state/states";

const useInitializeAuth = () => {
  const [, setUser] = useRecoilState(userState);
  const [, setAccessToken] = useRecoilState(accessTokenState);
  const [, setRefreshToken] = useRecoilState(refreshTokenState);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (user && accessToken && refreshToken) {
      setUser(JSON.parse(user));
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    } else {
      setUser(null);
      setAccessToken("");
      setRefreshToken("");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }, [setUser, setAccessToken, setRefreshToken]);
};

export default useInitializeAuth;
