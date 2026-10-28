import { Link } from "react-router-dom";
import DisplayRow from "../../Components/DisplayRow/DisplayRow";
import styles from "./TvShows.module.css";

const TvShows = () => (
  <div className={styles.page}>
    <DisplayRow showTrendingOnly />
    <Link to="/home" className={styles.homeLink}>
      Back to Home
    </Link>
  </div>
);

export default TvShows;
