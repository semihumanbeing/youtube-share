import React, { useState } from "react";
import { LoginProps } from "../props/LoginProps";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../state/states";
import { ERROR_MESSAGES } from "../props/ErrorMessages";

interface ErrorState {
  general?: string;
  email?: string;
  password?: string;
}

const Login = ({ email, password }: LoginProps) => {
  const [emailInput, setEmailInput] = useState(email);
  const [passwordInput, setPasswordInput] = useState(password);
  const [errors, setErrors] = useState<ErrorState>({});
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    if (!validateEmail(emailInput)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email address is not valid.",
      }));
      return;
    }
    if (!validatePassword(passwordInput)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be a minimum of 6 characters.",
      }));
      return;
    }

    await fetch(`${process.env.REACT_APP_BASE_URL}/user/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.data) {
          const errorCode = response.errorCode as string;
          const errorMessage = ERROR_MESSAGES[errorCode] || "login failed.";
          setErrors({ ...errors, general: errorMessage });
          return;
        }
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
      })
      .catch((error: any) => {
        console.error("Error during login", error);
        setErrors({ ...errors, general: "login failed." });
        return;
      });
  };

  return (
    <div className="user-container">
      <h2>Log in</h2>
      {errors.general && <p className="error-message">{errors.general}</p>}
      {errors.email && <p className="error-message">{errors.email}</p>}
      <input
        className="user-input"
        type="email"
        value={emailInput}
        onChange={(e) => {
          setEmailInput(e.target.value);
          setErrors((prev) => ({ ...prev, email: "" }));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin();
          }
        }}
        placeholder="Email"
      />
      {errors.password && <p className="error-message">{errors.password}</p>}
      <input
        className="user-input"
        type="password"
        value={passwordInput}
        onChange={(e) => {
          setPasswordInput(e.target.value);
          setErrors((prev) => ({ ...prev, password: "" }));
        }}
        placeholder="Password"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin();
          }
        }}
      />

      <div className="user-submit-container">
        <button className="user-button" onClick={handleLogin}>
          Log In
        </button>
        <Link className="user-link" to="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
