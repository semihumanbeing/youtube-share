import React, { useState } from "react";
import { LoginProps } from "../props/LoginProps";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const BASE_URL = "http://localhost:8080/api";

const LoginComponent = ({ email, password }: LoginProps) => {
  const [emailInput, setEmailInput] = useState(email);
  const [passwordInput, setPasswordInput] = useState(password);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { setUser } = useUser();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    // 유효성 검사
    if (!validateEmail(emailInput)) {
      setErrors((prev) => ({
        ...prev,
        email: "유효하지 않은 이메일 형식입니다.",
      }));
      return;
    }
    if (!validatePassword(passwordInput)) {
      setErrors((prev) => ({
        ...prev,
        password: "비밀번호는 최소 6자 이상이어야 합니다.",
      }));
      return;
    }

    await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("success");
        setUser(response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="user-container">
      <h2>Log in</h2>
      {errors.email && <p className="error-message">{errors.email}</p>}
      <input
        className="user-input"
        type="email"
        value={emailInput}
        onChange={(e) => {
          setEmailInput(e.target.value);
          setErrors((prev) => ({ ...prev, email: "" }));
        }}
        placeholder="이메일"
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
        placeholder="비밀번호"
      />

      <div className="user-submit-container">
        <button className="user-button" onClick={handleLogin}>
          로그인
        </button>
        <Link className="user-link" to="/signup">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginComponent;
