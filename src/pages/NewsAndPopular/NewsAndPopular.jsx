import BackToHomeLink from "../../components/BackToHomeLink/BackToHomeLink";
import CategoryRows from "../../components/CategoryRows/CategoryRows";
import styles from "./NewsAndPopular.module.css";

/**
 * New & Popular page (`/news`): the "Popular on Netflix" row.
 *
 * @returns {JSX.Element}
 */
const NewsAndPopular = () => (
  <div className={styles.page}>
    <BackToHomeLink />
    <CategoryRows showPopularOnly />
  </div>
);

export default NewsAndPopular;
