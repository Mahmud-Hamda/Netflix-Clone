import BackToHomeLink from "../../components/BackToHomeLink/BackToHomeLink";
import CategoryRows from "../../components/CategoryRows/CategoryRows";
import styles from "./TvShows.module.css";

/**
 * TV Shows page (`/tv`): the "Netflix Trending" row.
 *
 * @returns {JSX.Element}
 */
const TvShows = () => (
  <div className={styles.page}>
    <BackToHomeLink />
    <CategoryRows showTrendingOnly />
  </div>
);

export default TvShows;
