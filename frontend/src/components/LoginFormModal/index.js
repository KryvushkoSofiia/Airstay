import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    credential: false,
    password: false,
  });
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = () => {
    setCredential("demo@user.io"); // demo email
    setPassword("password"); // demo password
  };

  const isUsernameValid = touched.credential ? credential.length >= 4 : true;
  const isPasswordValid = touched.password ? password.length >= 6 : true;

  const handleCredentialChange = (e) => {
    setTouched({ ...touched, credential: true });
    setCredential(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setTouched({ ...touched, password: true });
    setPassword(e.target.value);
  };

  return (
    <div className="login-form-container">
      <h1 className="login-form-title">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-form-label">
          Username or Email
          <input
            className="login-form-input"
            type="text"
            value={credential}
            onChange={handleCredentialChange}
            required
          />
        </label>
        {touched.credential && errors.credential && (
          <p className="login-form-error">{errors.credential}</p>
        )}
        {!isUsernameValid && (
          <p className="login-form-error">Username must be at least 4 characters</p>
        )}
        <label className="login-form-label">
          Password
          <input
            className="login-form-input"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </label>
        {touched.password && errors.password && (
          <p className="login-form-error">{errors.password}</p>
        )}
        {!isPasswordValid && (
          <p className="login-form-error">Password must be at least 6 characters</p>
        )}
        <button
          className="login-form-button"
          type="submit"
          disabled={!isUsernameValid || !isPasswordValid}
        >
          Log In
        </button>
      </form>
      <button
        className="demo-user-button"
        type="button"
        onClick={handleDemoLogin}
      >
        Demo User
      </button>
    </div>
  );
}

export default LoginFormModal;
