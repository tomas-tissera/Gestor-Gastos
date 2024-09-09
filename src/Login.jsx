import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const loginWithUsernameAndPassword = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("./profile");
    } catch {
      setNotice("You entered a wrong username or password.");
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-box shadow-lg p-4">
        <div className="text-center">
          <FaCircleUser className="user-icon mb-4" />
          <h2 className="mb-4">Login</h2>
        </div>

        <form onSubmit={loginWithUsernameAndPassword}>
          {notice && (
            <div className="alert alert-warning text-center" role="alert">
              {notice}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control rounded-pill px-3"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-pill px-3"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary rounded-pill py-2 shadow-sm"
            >
              Sign In
            </button>
          </div>

          <div className="mt-3 text-center">
            <span>
              Need to sign up for an account?{" "}
              <Link to="./signup" className="link-primary">
                Click here.
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
