import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../../../services/api";

import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await api.post(
          "/auth/login/",
          {
            email: email.trim(),
            password,
          }
        );

      /*
       * Save JWT tokens
       */
      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      /*
       * Optional:
       * Save logged-in user information.
       */
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );
      }

      /*
       * Go to dashboard
       */
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error(
        "Login failed:",
        error
      );

      const responseData =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (
              error as {
                response?: {
                  data?: unknown;
                };
              }
            ).response?.data
          : undefined;

      if (
        responseData &&
        typeof responseData === "object" &&
        "detail" in responseData &&
        responseData.detail
      ) {
        setError(
          String(
            responseData.detail
          )
        );
      } else if (
        responseData &&
        typeof responseData ===
          "object"
      ) {
        const firstError =
          Object.values(
            responseData
          )[0];

        if (
          Array.isArray(
            firstError
          )
        ) {
          setError(
            String(
              firstError[0]
            )
          );
        } else {
          setError(
            String(firstError)
          );
        }
      } else {
        setError(
          "Invalid email or password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background-shape shape-one" />

      <div className="login-background-shape shape-two" />

      <section className="login-card">
        {/* Brand */}

        <div className="login-brand">
          <div className="login-brand-icon">
            ✓
          </div>

          <span>
            TaskFlow
          </span>
        </div>

        {/* Heading */}

        <div className="login-heading">
          <h1>
            Welcome back
          </h1>

          <p>
            Sign in to continue
            managing your tasks.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="login-error">
            <span>!</span>

            {error}
          </div>
        )}

        {/* Form */}

        <form
          className="login-form"
          onSubmit={
            handleSubmit
          }
        >
          {/* Email */}

          <div className="login-field">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}

          <div className="login-field">
            <div className="field-label-row">
              <label htmlFor="password">
                Password
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  setError(
                    "Password reset is not connected yet."
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Submit */}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}

            {!loading && (
              <span>→</span>
            )}
          </button>
        </form>

        {/* Register */}

        <div className="login-divider">
          <span>
            New to TaskFlow?
          </span>
        </div>

        <Link
          to="/register"
          className="create-account"
        >
          Create an account
        </Link>

        <p className="login-footer">
          Secure task management
          for your workspace.
        </p>
      </section>
    </main>
  );
};

export default Login;