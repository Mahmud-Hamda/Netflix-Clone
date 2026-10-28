import BackHome from "../../Components/BackHome/BackHome";
import DisplayRow from "../../Components/DisplayRow/DisplayRow";
import styles from "./Movies.module.css";

const Movies = () => (
  <div className={styles.page}>
    <BackHome />
    <DisplayRow showActionOnly />
  </div>
);

export default Movies;
