import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api";

const RegisterComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6; // 6글자 이상이어야 함
  };

  const isValidInput = (input: string) => {
    const invalidChars = /[`<>"'{}]/;
    return !invalidChars.test(input) && input.trim() !== "";
  };

  const handleRegister = async () => {
    try {
      setErrors({ username: "", email: "", password: "" });

      let valid = true;

      if (!validateEmail(email) || !isValidInput(email)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "유효한 이메일 주소를 입력하세요.",
        }));
        valid = false;
      }

      if (!validatePassword(password) || !isValidInput(password)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "비밀번호는 6자 이상이어야 합니다.",
        }));
        valid = false;
      }

      if (!isValidInput(username) || !isValidInput(username)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "유효하지 않은 사용자명입니다.",
        }));
        valid = false;
      }

      if (valid) {
        const response = await fetch(`${BASE_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, email }),
        });

        if (response.ok) {
          console.log("Registration successful");
          navigate("/login");
        } else {
          console.error("Registration failed");
        }
      }
    } catch (error) {
      console.error("Error during registration", error);
    }
  };

  return (
    <div className="user-container">
      <h2>Welcome!</h2>
      {errors.email && <p className="error-message">{errors.email}</p>}
      <input
        className="user-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      {errors.password && <p className="error-message">{errors.password}</p>}
      <input
        className="user-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      {errors.username && <p className="error-message">{errors.username}</p>}
      <input
        className="user-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="닉네임"
      />

      <div className="user-submit-container">
        <button className="user-button" onClick={handleRegister}>
          회원가입
        </button>
        <Link className="user-link" to="/login">
          로그인
        </Link>
      </div>
    </div>
  );
};

export default RegisterComponent;
