import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../../../services/api";

import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      full_name: "",
      email: "",
      password: "",
      password2: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
   * Handle all input changes
   */
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /*
   * Submit registration
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    /*
     * Frontend password confirmation
     */
    if (
      formData.password !==
      formData.password2
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      /*
       * Backend expects:
       *
       * username
       * email
       * password
       *
       * password2 is NOT sent.
       */
      await api.post(
        "/auth/register/",
        {
          full_name:
            formData.full_name.trim(),

          email:
            formData.email
              .trim()
              .toLowerCase(),

          password:
            formData.password,
        }
      );

      /*
       * Registration successful.
       *
       * Go to login page.
       */
      navigate("/login");
    } 
    catch (error: unknown) {
    console.error("Registration failed:", error);

      const responseData =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
          ? error.response.data
          : undefined;


      if (
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
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-glow register-glow-one" />

      <div className="register-glow register-glow-two" />

      <section className="register-card">
        {/* Brand */}

        <div className="register-brand">
          <div className="register-brand-icon">
            ✓
          </div>

          <span>
            TaskFlow
          </span>
        </div>

        {/* Heading */}

        <div className="register-heading">
          <h1>
            Create your account
          </h1>

          <p>
            Start organizing your
            work in one place.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="register-error">
            <span>!</span>

            {error}
          </div>
        )}

        {/* Form */}

        <form
          className="register-form"
          onSubmit={
            handleSubmit
          }
        >
          {/* Username */}

          <div className="register-field">
            <label htmlFor="Full_name">
              Full name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              value={
                formData.full_name
              }
              onChange={
                handleChange
              }
              placeholder="Your username"
              autoComplete="username"
              required
            />
          </div>

          {/* Email */}

          <div className="register-field">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}

          <div className="register-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Create a password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          {/* Confirm password */}

          <div className="register-field">
            <label htmlFor="password2">
              Confirm password
            </label>

            <input
              id="password2"
              type="password"
              name="password2"
              value={
                formData.password2
              }
              onChange={
                handleChange
              }
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          {/* Submit */}

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}

            {!loading && (
              <span>→</span>
            )}
          </button>
        </form>

        {/* Login */}

        <p className="register-login">
          Already have an account?

          <Link to="/login">
            Sign in
          </Link>
        </p>

        <p className="register-footer">
          By continuing, you agree
          to our terms and privacy
          policy.
        </p>
      </section>
    </main>
  );
};

export default Register;