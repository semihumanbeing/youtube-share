import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
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

  const validateUsername = (username: string) => {
    return username.length <= 10; // 10글자 이하여야 함
  };

  const validatePasswordLength = (password: string) => {
    return password.length >= 6; // 6글자 이상이어야 함
  };
  const validatePasswordCheck = (password: string, passwordCheck: string) => {
    return password == passwordCheck;
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
          email: "Email address is not valid.",
        }));
        valid = false;
      }

      if (!validatePasswordLength(password) || !isValidInput(password)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be a minimum of 6 characters.",
        }));
        valid = false;
      }

      if (
        !validatePasswordCheck(password, passwordCheck) ||
        !isValidInput(password)
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password does not match.",
        }));
        valid = false;
      }

      if (!isValidInput(username) || !validateUsername(username)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username is not valid or more than 10 characters.",
        }));
        valid = false;
      }

      if (valid) {
        await fetch(`${process.env.REACT_APP_BASE_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, email }),
        })
          .then((response) => response.json())
          .then((response) => {
            if (!response.errorCode) {
              navigate("/login");
            } else {
              setErrors((prevErrors) => ({
                ...prevErrors,
                email: response.errorMsg,
              }));
            }
          })
          .catch((error) => {});
      }
    } catch (error) {
      console.error("Error during registration", error);
    }
  };

  return (
    <div className="user-container">
      <h2>Welcome!</h2>
      {errors.email && <p className="error-message">{errors.email}</p>}
      email
      <input
        className="user-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {errors.password && <p className="error-message">{errors.password}</p>}
      password
      <input
        className="user-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password (more than 6 characters)"
      />
      <input
        className="user-input"
        type="password"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
        placeholder="Password Check"
      />
      {errors.username && <p className="error-message">{errors.username}</p>}
      nickname
      <input
        className="user-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nickname (less than 10 characters)"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleRegister();
          }
        }}
      />
      <div className="user-submit-container">
        <button className="user-button" onClick={handleRegister}>
          Sign Up
        </button>
        <Link className="user-link" to="/login">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default RegisterComponent;
