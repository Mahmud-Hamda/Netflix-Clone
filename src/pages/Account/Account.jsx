import { useState } from "react";
import BackToHomeLink from "../../components/BackToHomeLink/BackToHomeLink";
import { useMyList } from "../../context/useMyList";
import { useProfile } from "../../context/useProfile";
import styles from "./Account.module.css";

/**
 * Account page (`/account`): shows who is signed in and how many titles are
 * saved, and lets the user rename the profile, change the password, or sign out.
 *
 * @returns {JSX.Element}
 */
export default function Account() {
  const { name, email, updateName, changePassword, signOut } = useProfile();
  const { savedTitles } = useMyList();
  const [nameDraft, setNameDraft] = useState(name);
  const [nameMessage, setNameMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleNameSubmit = (event) => {
    event.preventDefault();
    const isAccepted = updateName(nameDraft);
    setNameMessage(isAccepted ? "Name saved." : "Enter a display name.");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (isPending) return;
    setIsPending(true);
    const result = await changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    setHasPasswordError(!result.ok);
    setPasswordMessage(result.ok ? "Password updated." : result.error);
    if (result.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsPending(false);
  };

  return (
    <div className={styles.page}>
      <BackToHomeLink />
      <h1 className={styles.heading}>Account</h1>
      <p className={styles.note}>
        Signed in as {name} ({email}). {savedTitles.length}{" "}
        {savedTitles.length === 1 ? "title is" : "titles are"} saved in My List for
        this account on this browser.
      </p>
      <form className={styles.form} onSubmit={handleNameSubmit}>
        <label htmlFor="account-name">Display name</label>
        <input
          id="account-name"
          value={nameDraft}
          autoComplete="name"
          onChange={(event) => setNameDraft(event.target.value)}
        />
        <button type="submit">Save</button>
      </form>
      {nameMessage && <p className={styles.note}>{nameMessage}</p>}

      <h2 className={styles.subheading}>Password</h2>
      <form className={styles.form} onSubmit={handlePasswordSubmit}>
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
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update password"}
        </button>
      </form>
      {passwordMessage && (
        <p className={hasPasswordError ? styles.error : styles.note}>
          {passwordMessage}
        </p>
      )}

      <button type="button" className={styles.signOut} onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}
