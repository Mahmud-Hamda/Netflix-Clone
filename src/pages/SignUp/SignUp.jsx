import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useProfile } from "../../context/useProfile";
import { getPostAuthDestination } from "../../utils/authRedirect";
import styles from "../SignIn/SignIn.module.css";

/**
 * Sign-up page (`/signup`). Creates a local account, signs in to it, and
 * redirects to the page the user originally requested. Shares the sign-in
 * page's styles.
 *
 * @returns {JSX.Element}
 */
export default function SignUp() {
  const { isSignedIn, register } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    const result = await register({ name, email, password, confirmPassword });
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
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.note}>
          Your account and My List stay in this browser. A password is stored
          only as a salted hash.
        </p>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sign-up-name">
            Display name
          </label>
          <input
            id="sign-up-name"
            className={styles.input}
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sign-up-email">
            Email
          </label>
          <input
            id="sign-up-email"
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sign-up-password">
            Password
          </label>
          <input
            id="sign-up-password"
            className={styles.input}
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sign-up-confirm">
            Confirm password
          </label>
          <input
            id="sign-up-confirm"
            className={styles.input}
            type="password"
            name="confirm"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button} disabled={isPending}>
          {isPending ? "Creating account..." : "Create Account"}
        </button>
        <p className={styles.switch}>
          Already have an account? <Link to="/signin" state={location.state}>Sign in</Link>
        </p>
      </form>
    </main>
  );
}
