/**
 * Chooses where to send the user after signing in or signing up: the page
 * `RequireAuth` redirected them from, or `/home`. Never returns an auth page.
 *
 * @param {import("react-router-dom").Location} location - Current router location.
 * @returns {string} Path to navigate to.
 */
export function getPostAuthDestination(location) {
  const requestedPath = location.state?.from;
  if (requestedPath && requestedPath !== "/signin" && requestedPath !== "/signup") {
    return requestedPath;
  }
  return "/home";
}
