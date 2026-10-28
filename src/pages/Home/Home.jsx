import Banner from "../../Components/Banner/Banner";
import DisplayRow from "../../Components/DisplayRow/DisplayRow";
import styles from "./Home.module.css";

const Home = () => (
  <div className={styles.page}>
    <Banner />
    <DisplayRow />
  </div>
);

export default Home;
