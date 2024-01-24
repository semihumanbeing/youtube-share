import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useRecoilState } from "recoil";
import {
  userState,
  accessTokenState,
  refreshTokenState,
} from "../state/states";

const useAuthFetch = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [refreshToken] = useRecoilState(refreshTokenState);
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const isTokenExpired = (token: string) => {
    try {
      const decoded: { exp?: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      return (decoded?.exp ?? 0) < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    let response = await fetch(url, {
      ...options,
      credentials: "include", // 쿠키 포함
    });

    // 401 상태 코드 및 토큰 만료 확인
    if (response.status === 401 || isTokenExpired(accessToken)) {
      const refreshResponse = await fetch(
        "http://localhost:8080/api/user/refresh",
        {
          method: "POST",
          credentials: "include", // 쿠키 포함
        }
      );

      if (refreshResponse.ok) {
        const refreshedTokens = await refreshResponse.json();
        setAccessToken(refreshedTokens.accessToken);
        setUser({ ...user, accessToken: refreshedTokens.accessToken });

        // 새로운 토큰으로 재요청
        response = await fetch(url, {
          ...options,
          credentials: "include",
        });
      } else {
        setUser(null);
        navigate("/login");
      }
    }

    return response;
  };

  return authFetch;
};
