import BackToHomeLink from "../../components/BackToHomeLink/BackToHomeLink";
import TitleCarousel from "../../components/TitleCarousel/TitleCarousel";
import { useMyList } from "../../context/useMyList";
import styles from "./MyList.module.css";

/**
 * My List page (`/mylist`): the signed-in account's saved titles, or a hint
 * when nothing is saved.
 *
 * @returns {JSX.Element}
 */
const MyList = () => {
  const { savedTitles } = useMyList();
  const titlesWithPosters = savedTitles.filter((title) => title.poster_path);

  return (
    <div className={styles.page}>
      <BackToHomeLink />
      <h1 className={styles.heading}>My List</h1>
      {titlesWithPosters.length === 0 ? (
        <p className={styles.message}>
          Nothing saved yet. Use My List on the banner, or the plus on a title.
        </p>
      ) : (
        <TitleCarousel
          heading={`${titlesWithPosters.length} saved`}
          titles={titlesWithPosters}
        />
      )}
    </div>
  );
};

export default MyList;
