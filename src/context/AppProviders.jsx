import { MyListProvider } from "./MyListContext";
import { PlayerProvider } from "./PlayerContext";
import { ProfileProvider } from "./ProfileContext";

export default function AppProvider({ children }) {
  return (
    <ProfileProvider>
      <MyListProvider>
        <PlayerProvider>{children}</PlayerProvider>
      </MyListProvider>
    </ProfileProvider>
  );
}
