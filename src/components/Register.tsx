import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  const validateUsername = (username: string) => {
    return username.length <= 10; // 10글자 이하여야 함
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
          email: "Email address is not valid.",
        }));
        valid = false;
      }

      if (!validatePassword(password) || !isValidInput(password)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be a minimum of 6 characters.",
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
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/user/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email }),
          }
        );

        if (response.ok) {
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
        placeholder="Email"
      />
      {errors.password && <p className="error-message">{errors.password}</p>}
      <input
        className="user-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password (more than 6 characters)"
      />
      {errors.username && <p className="error-message">{errors.username}</p>}
      <input
        className="user-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nickname (less than 10 characters)"
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
