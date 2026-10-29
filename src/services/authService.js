// Changing these keys or the hashing parameters makes existing accounts unreadable.
const ACCOUNTS_STORAGE_KEY = "netflix-clone-users";
const SESSION_STORAGE_KEY = "netflix-clone-session";
const PBKDF2_ITERATIONS = 100000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * A locally stored account. The password is kept only as a salted
 * PBKDF2-SHA-256 hash.
 *
 * @typedef {Object} Account
 * @property {string} id - Stable account id (the normalized email at sign-up).
 * @property {string} email - Normalized email address.
 * @property {string} name - Display name.
 * @property {string} salt - Hex-encoded random salt.
 * @property {string} passwordHash - Hex-encoded PBKDF2 hash of the password.
 */

/**
 * The signed-in session. An empty `userId` means nobody is signed in.
 *
 * @typedef {Object} Session
 * @property {string} userId - Id of the signed-in account, or `""`.
 */

/**
 * @param {ArrayBuffer | Uint8Array} buffer
 * @returns {string} Lowercase hex string.
 */
function bytesToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * @param {string} hex - Hex string with an even number of characters.
 * @returns {Uint8Array}
 */
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Trims and lowercases an email so lookups are case-insensitive.
 *
 * @param {string} email
 * @returns {string}
 */
export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

/**
 * Reads stored accounts, dropping any malformed entries.
 *
 * @returns {Account[]} The stored accounts, or an empty list when storage is missing or unreadable.
 */
export function readAccounts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (account) =>
        account &&
        typeof account.id === "string" &&
        typeof account.email === "string" &&
        typeof account.name === "string" &&
        typeof account.salt === "string" &&
        typeof account.passwordHash === "string",
    );
  } catch {
    return [];
  }
}

/**
 * Reads the stored session.
 *
 * @returns {Session} The stored session, or a signed-out session when none can be read.
 */
export function readSession() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || "");
    if (parsed && typeof parsed.userId === "string") {
      return { userId: parsed.userId };
    }
  } catch {
    /* start signed out when the session cannot be read */
  }
  return { userId: "" };
}

/**
 * Persists the full list of accounts.
 *
 * @param {Account[]} accounts
 * @returns {void}
 */
export function writeAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

/**
 * Persists the session.
 *
 * @param {Session} session
 * @returns {void}
 */
export function writeSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

/**
 * Generates a random 16-byte salt.
 *
 * @returns {string} Hex-encoded salt.
 */
export function createSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

/**
 * Hashes a password with PBKDF2-SHA-256 using the Web Crypto API.
 *
 * @param {string} password - Plain-text password.
 * @param {string} saltHex - Hex-encoded salt from `createSalt`.
 * @returns {Promise<string>} Hex-encoded 256-bit hash.
 */
export async function hashPassword(password, saltHex) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(saltHex),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return bytesToHex(derivedBits);
}

/**
 * Validates the sign-up form.
 *
 * @param {Object} fields
 * @param {string} fields.name - Display name.
 * @param {string} fields.email - Email address.
 * @param {string} fields.password - Chosen password.
 * @param {string} fields.confirmPassword - Password typed a second time.
 * @returns {string} A user-facing error message, or `""` when the form is valid.
 */
export function validateRegistration({ name, email, password, confirmPassword }) {
  const trimmedName = name.trim();
  const normalizedEmail = normalizeEmail(email);
  if (!trimmedName) return "Enter a display name.";
  if (trimmedName.length > 40) return "Use 40 characters or fewer for the name.";
  if (!EMAIL_PATTERN.test(normalizedEmail) || normalizedEmail.length > 80) {
    return "Enter a valid email address.";
  }
  if (password.length < 6) return "Use at least 6 characters for the password.";
  if (password.length > 72) return "Use 72 characters or fewer for the password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
}

/**
 * Validates the sign-in form.
 *
 * @param {Object} fields
 * @param {string} fields.email - Email address.
 * @param {string} fields.password - Password.
 * @returns {string} A user-facing error message, or `""` when the form is valid.
 */
export function validateSignIn({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) return "Enter your email and password.";
  if (!EMAIL_PATTERN.test(normalizedEmail)) return "Enter a valid email address.";
  return "";
}
