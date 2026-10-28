import { Link } from "react-router-dom";
import SlideShow from "../../Components/SlideShow/SlideShow";
import { useMyList } from "../../context/useMyList";
import styles from "./MyList.module.css";

const MyList = () => {
  const { items } = useMyList();
  const saved = items.filter((item) => item.poster_path);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>My List</h1>
      {saved.length === 0 ? (
        <p className={styles.message}>
          Nothing saved yet. Use My List on the banner, or the plus on a title.
        </p>
      ) : (
        <SlideShow title={`${saved.length} saved`} movies={saved} />
      )}
      <Link to="/home" className={styles.homeLink}>
        Back to Home
      </Link>
    </div>
  );
};

export default MyList;
