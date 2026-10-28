import { Link } from "react-router-dom";
import styles from "./BrowseByLanguage.module.css";

const BrowseByLanguage = () => (
  <div className={styles.page}>
    <h1 className={styles.message}>This is Browse by Language page!</h1>
    <Link to="/home" className={styles.homeLink}>
      Back to Home
    </Link>
  </div>
);

export default BrowseByLanguage;
