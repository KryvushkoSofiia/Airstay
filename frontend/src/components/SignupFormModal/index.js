import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { closeModal } = useModal();

  const isUsernameValid = username.length >= 4;
  const isPasswordValid = password.length >= 6;

  const isAnyFieldEmpty =
    !email ||
    !isUsernameValid ||
    !firstName ||
    !lastName ||
    !isPasswordValid ||
    !confirmPassword;

  const handleFieldBlur = (field) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      if (!isUsernameValid) {
        return setErrors({ username: "Username must be at least 4 characters long" });
      }
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the password field",
    });
  };

  return (
    <div className="signup-form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleFieldBlur("email")}
            required
          />
        </label>
        {touched.email && errors.email && <p>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleFieldBlur("username")} 
            required
          />
        </label>
        {touched.username && errors.username && <p>{errors.username}</p>}
        {!isUsernameValid && touched.username && (
          <p>Username must be at least 4 characters long</p>
        )}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => handleFieldBlur("firstName")} 
            required
          />
        </label>
        {touched.firstName && errors.firstName && <p>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => handleFieldBlur("lastName")} 
            required
          />
        </label>
        {touched.lastName && errors.lastName && <p>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleFieldBlur("password")} 
            required
          />
        </label>
        {touched.password && errors.password && <p>{errors.password}</p>}
        {!isPasswordValid && touched.password && (
          <p>Password must be at least 6 characters long</p>
        )}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleFieldBlur("confirmPassword")}
            required
          />
        </label>
        {touched.confirmPassword && errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}
        <button
          type="submit"
          className="login-logout-form-button"
          disabled={isAnyFieldEmpty}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
