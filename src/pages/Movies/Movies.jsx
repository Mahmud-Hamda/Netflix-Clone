import { Link } from "react-router-dom";
import DisplayRow from "../../Components/DisplayRow/DisplayRow";
import styles from "./Movies.module.css";

const Movies = () => (
  <div className={styles.page}>
    <DisplayRow showActionOnly />
    <Link to="/home" className={styles.homeLink}>
      Back to Home
    </Link>
  </div>
);

export default Movies;
