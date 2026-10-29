import { useEffect, useMemo, useState } from "react";
import {
  createSalt,
  hashPassword,
  normalizeEmail,
  readAccounts,
  readSession,
  validateRegistration,
  validateSignIn,
  writeAccounts,
  writeSession,
} from "../services/authService";
import { ProfileContext } from "./useProfile";

/** @typedef {import("../services/authService").Account} Account */

/**
 * Reports whether the browser exposes the Web Crypto APIs used for hashing
 * (they are missing on insecure origins).
 *
 * @returns {boolean}
 */
function canHashPasswords() {
  return Boolean(crypto?.subtle && crypto?.getRandomValues);
}

/**
 * Provides the signed-in account and account actions, and keeps accounts and
 * the session in local storage.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @returns {JSX.Element}
 */
export function ProfileProvider({ children }) {
  const [accounts, setAccounts] = useState(readAccounts);
  const [session, setSession] = useState(readSession);

  const hasSessionAccount = accounts.some(
    (account) => account.id === session.userId,
  );
  if (session.userId && !hasSessionAccount) {
    setSession({ userId: "" });
  }

  useEffect(() => {
    writeAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    writeSession(session);
  }, [session]);

  const value = useMemo(() => {
    /** @type {Account | null} */
    const currentAccount =
      accounts.find((account) => account.id === session.userId) ?? null;

    return {
      isSignedIn: Boolean(currentAccount),
      userId: currentAccount?.id ?? "",
      name: currentAccount?.name ?? "",
      email: currentAccount?.email ?? "",
      async register({ name, email, password, confirmPassword }) {
        const error = validateRegistration({
          name,
          email,
          password,
          confirmPassword,
        });
        if (error) return { ok: false, error };
        if (!canHashPasswords()) {
          return {
            ok: false,
            error: "This browser cannot store a password securely.",
          };
        }
        const normalizedEmail = normalizeEmail(email);
        if (accounts.some((account) => account.email === normalizedEmail)) {
          return {
            ok: false,
            error: "An account with that email already exists.",
          };
        }
        const salt = createSalt();
        const passwordHash = await hashPassword(password, salt);
        const newAccount = {
          id: normalizedEmail,
          email: normalizedEmail,
          name: name.trim().slice(0, 40),
          salt,
          passwordHash,
        };
        setAccounts((currentAccounts) => {
          if (
            currentAccounts.some((account) => account.email === normalizedEmail)
          ) {
            return currentAccounts;
          }
          return [...currentAccounts, newAccount];
        });
        setSession({ userId: newAccount.id });
        return { ok: true };
      },
      async signIn({ email, password }) {
        const error = validateSignIn({ email, password });
        if (error) return { ok: false, error };
        if (!canHashPasswords()) {
          return {
            ok: false,
            error: "This browser cannot check a password securely.",
          };
        }
        const normalizedEmail = normalizeEmail(email);
        const account = accounts.find(
          (entry) => entry.email === normalizedEmail,
        );
        if (!account) {
          return { ok: false, error: "No account matches that email." };
        }
        const passwordHash = await hashPassword(password, account.salt);
        if (passwordHash !== account.passwordHash) {
          return { ok: false, error: "That password is incorrect." };
        }
        setSession({ userId: account.id });
        return { ok: true };
      },
      updateName(name) {
        const trimmedName = name.trim().slice(0, 40);
        if (!trimmedName || !currentAccount) return false;
        setAccounts((currentAccounts) =>
          currentAccounts.map((account) =>
            account.id === currentAccount.id
              ? { ...account, name: trimmedName }
              : account,
          ),
        );
        return true;
      },
      async changePassword({ currentPassword, newPassword, confirmPassword }) {
        if (!currentAccount) {
          return { ok: false, error: "Sign in again to change your password." };
        }
        if (!currentPassword) {
          return { ok: false, error: "Enter your current password." };
        }
        if (newPassword.length < 6) {
          return {
            ok: false,
            error: "Use at least 6 characters for the new password.",
          };
        }
        if (newPassword.length > 72) {
          return {
            ok: false,
            error: "Use 72 characters or fewer for the new password.",
          };
        }
        if (newPassword !== confirmPassword) {
          return { ok: false, error: "Passwords do not match." };
        }
        if (currentPassword === newPassword) {
          return { ok: false, error: "Choose a different password." };
        }
        const currentHash = await hashPassword(
          currentPassword,
          currentAccount.salt,
        );
        if (currentHash !== currentAccount.passwordHash) {
          return { ok: false, error: "Current password is incorrect." };
        }
        const salt = createSalt();
        const passwordHash = await hashPassword(newPassword, salt);
        setAccounts((currentAccounts) =>
          currentAccounts.map((account) =>
            account.id === currentAccount.id
              ? { ...account, salt, passwordHash }
              : account,
          ),
        );
        return { ok: true };
      },
      signOut() {
        setSession({ userId: "" });
      },
    };
  }, [accounts, session]);

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
