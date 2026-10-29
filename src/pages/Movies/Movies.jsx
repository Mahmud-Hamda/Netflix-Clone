import BackToHomeLink from "../../components/BackToHomeLink/BackToHomeLink";
import CategoryRows from "../../components/CategoryRows/CategoryRows";
import styles from "./Movies.module.css";

/**
 * Movies page (`/movies`): the Action movies row.
 *
 * @returns {JSX.Element}
 */
const Movies = () => (
  <div className={styles.page}>
    <BackToHomeLink />
    <CategoryRows showActionOnly />
  </div>
);

export default Movies;
