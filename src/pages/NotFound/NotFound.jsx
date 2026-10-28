import BackHome from "../../Components/BackHome/BackHome";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.copy}>
        That address is not part of this site. Head back to the home page to
        keep browsing.
      </p>
      <BackHome />
    </div>
  );
};

export default NotFound;
