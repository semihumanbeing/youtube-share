import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateChatroomPage.css";
import useInitializeAuth from "../../hooks/useInitializeAuth";

const CreateChatroomPage = () => {
  const [chatroomName, setChatroomName] = useState<string>("");
  const [chatroomPassword, setChatroomPassword] = useState<string>("");
  const [hasPwd, setHasPwd] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useInitializeAuth();
  const handleCreateChatroom = async () => {
    if (!chatroomName) {
      setError("name cannot be empty.");
      return;
    }

    await fetch(`${process.env.REACT_APP_BASE_URL}/chatroom`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatroomName: chatroomName,
        chatroomPassword: chatroomPassword,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.data) {
          console.log(response);
          setError(`${response.errorMsg}`);
        }

        navigate(`/chatroom/${response.data.chatroomId}`);
      })
      .catch((error: any) => {
        console.log(error);
        // setError(`error creating chatroom: ${response.errorMsg}`);
        return;
      });
  };

  return (
    <div className="create-chatroom-container">
      <h2>Create Chatroom</h2>
      <button
        className="haspwd-button"
        onClick={() => {
          setHasPwd(!hasPwd);
          setChatroomPassword("");
        }}
      >
        Private
      </button>
      {error && <p className="error-message">{error}</p>}
      <label>
        Chatroom Name
        <input
          type="text"
          value={chatroomName}
          onChange={(e) => setChatroomName(e.target.value)}
        />
      </label>

      {hasPwd && (
        <label>
          Password
          <input
            type="password"
            value={chatroomPassword}
            onChange={(e) => setChatroomPassword(e.target.value)}
          />
        </label>
      )}
      <button className="create-button" onClick={handleCreateChatroom}>
        Create
      </button>
    </div>
  );
};

export default CreateChatroomPage;
