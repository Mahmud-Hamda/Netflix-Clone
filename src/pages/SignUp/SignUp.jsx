import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import { useProfile } from "../../context/useProfile";
import styles from "../SignIn/SignIn.module.css";

function destinationFrom(location) {
  const requested = location.state?.from;
  if (requested && requested !== "/signin" && requested !== "/signup") {
    return requested;
  }
  return "/home";
}

export default function SignUp() {
  const { signedIn, register } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    const result = await register({ name, email, password, confirm });
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
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "Creating account..." : "Create Account"}
        </button>
        <p className={styles.switch}>
          Already have an account? <Link to="/signin" state={location.state}>Sign in</Link>
        </p>
      </form>
    </main>
  );
}
