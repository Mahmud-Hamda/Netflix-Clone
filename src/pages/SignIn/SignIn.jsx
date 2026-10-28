import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import { useProfile } from "../../context/useProfile";
import styles from "./SignIn.module.css";

function destinationFrom(location) {
  const requested = location.state?.from;
  if (requested && requested !== "/signin" && requested !== "/signup") {
    return requested;
  }
  return "/home";
}

export default function SignIn() {
  const { signedIn, signIn } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const destination = destinationFrom(location);

  if (signedIn) {
    return <Navigate to={destination} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const result = await signIn({ email, password });
    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    navigate(destination, { replace: true });
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={submit}>
        <img className={styles.logo} src={logo} alt="Netflix" />
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.note}>
          Use the email and password for your account on this browser.
        </p>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sign-in-email">
            Email
          </label>
          <input
            id="sign-in-email"
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sign-in-password">
            Password
          </label>
          <input
            id="sign-in-password"
            className={styles.input}
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "Signing in..." : "Sign In"}
        </button>
        <p className={styles.switch}>
          New here?{" "}
          <Link to="/signup" state={location.state}>
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
