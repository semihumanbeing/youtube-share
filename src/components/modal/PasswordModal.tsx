import React, { useState } from "react";
import { PasswordModalProps } from "../../props/PasswordModalProps";

export const PasswordModal = ({
  isOpen,
  onClose,
  onConfirm,
}: PasswordModalProps) => {
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm(password);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <label>
            <h3>Enter Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Enter</button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};
