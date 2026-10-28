import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyList } from "../../context/useMyList";
import { useProfile } from "../../context/useProfile";
import styles from "./Account.module.css";

export default function Account() {
  const { name, email, updateName, changePassword, signOut } = useProfile();
  const { items } = useMyList();
  const [draft, setDraft] = useState(name);
  const [nameMessage, setNameMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [pending, setPending] = useState(false);

  const saveName = (event) => {
    event.preventDefault();
    const accepted = updateName(draft);
    setNameMessage(accepted ? "Name saved." : "Enter a display name.");
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    const result = await changePassword({
      currentPassword,
      nextPassword,
      confirm,
    });
    setPasswordError(!result.ok);
    setPasswordMessage(result.ok ? "Password updated." : result.error);
    if (result.ok) {
      setCurrentPassword("");
      setNextPassword("");
      setConfirm("");
    }
    setPending(false);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Account</h1>
      <p className={styles.note}>
        Signed in as {name} ({email}). {items.length}{" "}
        {items.length === 1 ? "title is" : "titles are"} saved in My List for
        this account on this browser.
      </p>
      <form className={styles.form} onSubmit={saveName}>
        <label htmlFor="account-name">Display name</label>
        <input
          id="account-name"
          value={draft}
          autoComplete="name"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit">Save</button>
      </form>
      {nameMessage && <p className={styles.note}>{nameMessage}</p>}

      <h2 className={styles.subheading}>Password</h2>
      <form className={styles.form} onSubmit={savePassword}>
        <label htmlFor="current-password">Current password</label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
        <label htmlFor="next-password">New password</label>
        <input
          id="next-password"
          type="password"
          autoComplete="new-password"
          value={nextPassword}
          onChange={(event) => setNextPassword(event.target.value)}
        />
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
        <button type="submit" disabled={pending}>
          {pending ? "Updating..." : "Update password"}
        </button>
      </form>
      {passwordMessage && (
        <p className={passwordError ? styles.error : styles.note}>
          {passwordMessage}
        </p>
      )}

      <button type="button" className={styles.signOut} onClick={signOut}>
        Sign Out
      </button>
      <Link to="/home" className={styles.homeLink}>
        Back to Home
      </Link>
    </div>
  );
}
