import BackHome from "../../Components/BackHome/BackHome";
import DisplayRow from "../../Components/DisplayRow/DisplayRow";
import styles from "./NewsAndPopular.module.css";

const NewsAndPopular = () => (
  <div className={styles.page}>
    <BackHome />
    <DisplayRow showPopularOnly />
  </div>
);

export default NewsAndPopular;
