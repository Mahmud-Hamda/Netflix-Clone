import { MyListProvider } from "./MyListContext";
import { PlayerProvider } from "./PlayerContext";
import { ProfileProvider } from "./ProfileContext";

/**
 * Composes every app-wide context provider. `MyListProvider` sits inside
 * `ProfileProvider` because each account has its own list.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children - The app tree.
 * @returns {JSX.Element}
 */
export default function AppProviders({ children }) {
  return (
    <ProfileProvider>
      <MyListProvider>
        <PlayerProvider>{children}</PlayerProvider>
      </MyListProvider>
    </ProfileProvider>
  );
}
