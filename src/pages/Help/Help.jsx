import BackHome from "../../Components/BackHome/BackHome";
import styles from "./Help.module.css";

export default function Help() {
  return (
    <div className={styles.page}>
      <BackHome />
      <h1 className={styles.heading}>Help Center</h1>
      <section>
        <h2>Search</h2>
        <p>
          Open the magnifying glass, type a title, and pick a result. Press
          Enter to see every match.
        </p>
      </section>
      <section>
        <h2>Play</h2>
        <p>
          Play on the banner or on a title card opens the trailer when TMDB has
          one on YouTube.
        </p>
      </section>
      <section>
        <h2>Account</h2>
        <p>
          Create an account with an email and password, then sign in with those
          details. The account stays in this browser. Signing out keeps it so
          you can sign in again on this device.
        </p>
      </section>
      <section>
        <h2>My List</h2>
        <p>
          My List on the banner, or the plus on a card, saves that title for
          the signed-in account. The check removes it. A different account on
          this browser has its own list.
        </p>
      </section>
      <section>
        <h2>Notifications</h2>
        <p>
          The bell lists titles that are trending today. The number is how many
          you have not opened yet.
        </p>
      </section>
    </div>
  );
}
