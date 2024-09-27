import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");

  const signupWithUsernameAndPassword = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
      } catch {
        setNotice("Sorry, something went wrong. Please try again.");
      }     
    } else {
      setNotice("Passwords don't match. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={signupWithUsernameAndPassword}>
          {notice && (
            <div className="signup-alert">
              {notice}
            </div>
          )}
          <div className="signup-form-group">
            {/* <label htmlFor="signupEmail" className="signup-form-label">
              Email Address
            </label> */}
            <input
              id="signupEmail"
              type="email"
              className="signup-form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="signup-form-group">
            {/* <label htmlFor="signupPassword" className="signup-form-label">
              Password
            </label> */}
            <input
              id="signupPassword"
              type="password"
              className="signup-form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="signup-form-group">
            {/* <label htmlFor="confirmPassword" className="signup-form-label">
              Confirm Password
            </label> */}
            <input
              id="confirmPassword"
              type="password"
              className="signup-form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
          <div className="signup-footer">
            <span>
              Already have an account?{" "}
              <Link to="/" className="signup-link">Log in here.</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
