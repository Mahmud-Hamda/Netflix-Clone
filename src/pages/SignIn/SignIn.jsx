import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useProfile } from "../../context/useProfile";
import { getPostAuthDestination } from "../../utils/authRedirect";
import styles from "./SignIn.module.css";

/**
 * Sign-in page (`/signin`). On success, or if already signed in, it redirects
 * to the page the user originally requested.
 *
 * @returns {JSX.Element}
 */
export default function SignIn() {
  const { isSignedIn, signIn } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const destination = getPostAuthDestination(location);

  if (isSignedIn) {
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isPending) return;
    setIsPending(true);
    setError("");
    const result = await signIn({ email, password });
    if (!result.ok) {
      setError(result.error);
      setIsPending(false);
      return;
    }
    navigate(destination, { replace: true });
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
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
        <button type="submit" className={styles.button} disabled={isPending}>
          {isPending ? "Signing in..." : "Sign In"}
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
