import { useContext } from "react";
import { User, useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

interface AuthFetchOptions extends RequestInit {
  skipAuthRefresh?: boolean;
}

const useAuthFetch = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const authFetch = async (url: string, options: AuthFetchOptions = {}) => {
    if (!user) {
      throw new Error("No user available");
    }

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (response.status === 401 && !options.skipAuthRefresh) {
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
