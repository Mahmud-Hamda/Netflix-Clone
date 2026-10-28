import { useEffect, useMemo, useState } from "react";
import {
  createSalt,
  hashPassword,
  normalizeEmail,
  readSession,
  readUsers,
  validateRegistration,
  validateSignIn,
  writeSession,
  writeUsers,
} from "../Utility/auth";
import { ProfileContext } from "./useProfile";

function canHashPasswords() {
  return Boolean(crypto?.subtle && crypto?.getRandomValues);
}

export function ProfileProvider({ children }) {
  const [users, setUsers] = useState(readUsers);
  const [session, setSession] = useState(readSession);

  const known = users.some((user) => user.id === session.userId);
  if (session.userId && !known) {
    setSession({ userId: "" });
  }

  useEffect(() => {
    writeUsers(users);
  }, [users]);

  useEffect(() => {
    writeSession(session);
  }, [session]);

  const value = useMemo(() => {
    const current = users.find((user) => user.id === session.userId) ?? null;

    return {
      signedIn: Boolean(current),
      userId: current?.id ?? "",
      name: current?.name ?? "",
      email: current?.email ?? "",
      async register({ name, email, password, confirm }) {
        const error = validateRegistration({ name, email, password, confirm });
        if (error) return { ok: false, error };
        if (!canHashPasswords()) {
          return {
            ok: false,
            error: "This browser cannot store a password securely.",
          };
        }
        const nextEmail = normalizeEmail(email);
        if (users.some((user) => user.email === nextEmail)) {
          return {
            ok: false,
            error: "An account with that email already exists.",
          };
        }
        const salt = createSalt();
        const passwordHash = await hashPassword(password, salt);
        const user = {
          id: nextEmail,
          email: nextEmail,
          name: name.trim().slice(0, 40),
          salt,
          passwordHash,
        };
        setUsers((currentUsers) => {
          if (currentUsers.some((entry) => entry.email === nextEmail)) {
            return currentUsers;
          }
          return [...currentUsers, user];
        });
        setSession({ userId: user.id });
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
        const nextEmail = normalizeEmail(email);
        const user = users.find((entry) => entry.email === nextEmail);
        if (!user) {
          return { ok: false, error: "No account matches that email." };
        }
        const passwordHash = await hashPassword(password, user.salt);
        if (passwordHash !== user.passwordHash) {
          return { ok: false, error: "That password is incorrect." };
        }
        setSession({ userId: user.id });
        return { ok: true };
      },
      updateName(name) {
        const nextName = name.trim().slice(0, 40);
        if (!nextName || !current) return false;
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === current.id ? { ...user, name: nextName } : user,
          ),
        );
        return true;
      },
      async changePassword({ currentPassword, nextPassword, confirm }) {
        if (!current) {
          return { ok: false, error: "Sign in again to change your password." };
        }
        if (!currentPassword) {
          return { ok: false, error: "Enter your current password." };
        }
        if (nextPassword.length < 6) {
          return {
            ok: false,
            error: "Use at least 6 characters for the new password.",
          };
        }
        if (nextPassword.length > 72) {
          return {
            ok: false,
            error: "Use 72 characters or fewer for the new password.",
          };
        }
        if (nextPassword !== confirm) {
          return { ok: false, error: "Passwords do not match." };
        }
        if (currentPassword === nextPassword) {
          return { ok: false, error: "Choose a different password." };
        }
        const currentHash = await hashPassword(currentPassword, current.salt);
        if (currentHash !== current.passwordHash) {
          return { ok: false, error: "Current password is incorrect." };
        }
        const salt = createSalt();
        const passwordHash = await hashPassword(nextPassword, salt);
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === current.id ? { ...user, salt, passwordHash } : user,
          ),
        );
        return { ok: true };
      },
      signOut() {
        setSession({ userId: "" });
      },
    };
  }, [users, session]);

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
