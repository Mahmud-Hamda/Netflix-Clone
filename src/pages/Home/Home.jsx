import Banner from "../../components/Banner/Banner";
import CategoryRows from "../../components/CategoryRows/CategoryRows";
import styles from "./Home.module.css";

/**
 * Home page (`/home`): the featured banner followed by every browse category.
 *
 * @returns {JSX.Element}
 */
const Home = () => (
  <div className={styles.page}>
    <Banner />
    <CategoryRows />
  </div>
);

export default Home;
