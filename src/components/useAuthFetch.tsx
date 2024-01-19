import { useContext } from "react";
import { User, useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuthFetch = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const isTokenExpired = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // decoded.exp가 undefined일 경우를 고려하여 안전하게 처리
      return (decoded?.exp ?? 0) < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // 디코딩 중 에러가 발생하면 토큰을 만료된 것으로 간주
    }
  };
  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!user) {
      throw new Error("No user available");
    }

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (response.status === 401 && isTokenExpired(user.accessToken)) {
      const refreshResponse = await fetch(
        "http://localhost:8080/api/user/refresh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: user.refreshToken }),
        }
      );

      if (refreshResponse.ok) {
        const refreshedTokens: { accessToken: string } =
          await refreshResponse.json();
        setUser(
          (prev) =>
            ({
              ...prev,
              accessToken: refreshedTokens.accessToken,
            } as User)
        );

        response = await fetch(url, {
          credentials: "include",
          ...options,
          headers: {
            ...options.headers,
          },
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

export default useAuthFetch;
