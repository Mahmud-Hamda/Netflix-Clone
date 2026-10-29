import { Outlet } from "react-router-dom";
import TitleInfoModal from "../TitleInfoModal/TitleInfoModal";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import TrailerModal from "../TrailerModal/TrailerModal";
import styles from "./Layout.module.css";

/**
 * Renders the signed-in app shell: header, the current route, footer, and
 * the shared info and trailer dialogs.
 *
 * @returns {JSX.Element}
 */
const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <TitleInfoModal />
      <TrailerModal />
    </div>
  );
};

export default Layout;
