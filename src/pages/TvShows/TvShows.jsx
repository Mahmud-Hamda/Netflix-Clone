import BackHome from "../../Components/BackHome/BackHome";
import DisplayRow from "../../Components/DisplayRow/DisplayRow";
import styles from "./TvShows.module.css";

const TvShows = () => (
  <div className={styles.page}>
    <BackHome />
    <DisplayRow showTrendingOnly />
  </div>
);

export default TvShows;
