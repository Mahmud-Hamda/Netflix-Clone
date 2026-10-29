import { Outlet } from "react-router-dom";
import InfoModal from "../InfoModal/InfoModal";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import TrailerModal from "../TrailerModal/TrailerModal";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <InfoModal />
      <TrailerModal />
    </div>
  );
};

export default Layout;
