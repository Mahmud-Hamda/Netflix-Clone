import { createContext, useContext } from "react";

/**
 * Outcome of an asynchronous account action.
 *
 * @typedef {Object} AuthResult
 * @property {boolean} ok - Whether the action succeeded.
 * @property {string} [error] - User-facing message when `ok` is `false`.
 */

/**
 * The signed-in account and the actions that create, sign in to, update, or
 * sign out of an account.
 *
 * @typedef {Object} ProfileContextValue
 * @property {boolean} isSignedIn - Whether an account is signed in.
 * @property {string} userId - Signed-in account id, or `""`.
 * @property {string} name - Signed-in display name, or `""`.
 * @property {string} email - Signed-in email, or `""`.
 * @property {(fields: { name: string, email: string, password: string, confirmPassword: string }) => Promise<AuthResult>} register - Creates an account and signs in to it.
 * @property {(fields: { email: string, password: string }) => Promise<AuthResult>} signIn - Signs in to an existing account.
 * @property {(name: string) => boolean} updateName - Renames the signed-in account; returns `false` when the name is blank.
 * @property {(fields: { currentPassword: string, newPassword: string, confirmPassword: string }) => Promise<AuthResult>} changePassword - Replaces the signed-in account's password.
 * @property {() => void} signOut - Ends the session but keeps the account.
 */

/** @type {import("react").Context<ProfileContextValue | null>} */
export const ProfileContext = createContext(null);

/**
 * Reads the signed-in account and the account actions.
 *
 * @returns {ProfileContextValue}
 * @throws {Error} When called outside `ProfileProvider`.
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
