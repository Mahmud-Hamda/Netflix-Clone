import { Link } from "react-router-dom";
import DisplayRow from "../../Components/DisplayRow/DisplayRow";
import styles from "./NewsAndPopular.module.css";

const NewsAndPopular = () => (
  <div className={styles.page}>
    <DisplayRow showPopularOnly />
    <Link to="/home" className={styles.homeLink}>
      Back to Home
    </Link>
  </div>
);

export default NewsAndPopular;
