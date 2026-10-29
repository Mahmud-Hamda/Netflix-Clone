const USERS_KEY = "netflix-clone-users";
const SESSION_KEY = "netflix-clone-session";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PBKDF2_ITERATIONS = 100000;

function bytesToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function readUsers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (user) =>
        user &&
        typeof user.id === "string" &&
        typeof user.email === "string" &&
        typeof user.name === "string" &&
        typeof user.salt === "string" &&
        typeof user.passwordHash === "string",
    );
  } catch {
    return [];
  }
}

export function readSession() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) || "");
    if (parsed && typeof parsed.userId === "string") {
      return { userId: parsed.userId };
    }
  } catch {
    /* start signed out when the session cannot be read */
  }
  return { userId: "" };
}

export function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function writeSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function createSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

export async function hashPassword(password, saltHex) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(saltHex),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return bytesToHex(bits);
}

export function validateRegistration({ name, email, password, confirm }) {
  const nextName = name.trim();
  const nextEmail = normalizeEmail(email);
  if (!nextName) return "Enter a display name.";
  if (nextName.length > 40) return "Use 40 characters or fewer for the name.";
  if (!EMAIL_PATTERN.test(nextEmail) || nextEmail.length > 80) {
    return "Enter a valid email address.";
  }
  if (password.length < 6) return "Use at least 6 characters for the password.";
  if (password.length > 72) return "Use 72 characters or fewer for the password.";
  if (password !== confirm) return "Passwords do not match.";
  return "";
}

export function validateSignIn({ email, password }) {
  const nextEmail = normalizeEmail(email);
  if (!nextEmail || !password) return "Enter your email and password.";
  if (!EMAIL_PATTERN.test(nextEmail)) return "Enter a valid email address.";
  return "";
}
