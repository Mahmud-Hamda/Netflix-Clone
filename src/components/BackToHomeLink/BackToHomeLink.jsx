import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./BackToHomeLink.module.css";

/**
 * Renders a "Back to Home" link used at the top of secondary pages.
 *
 * @returns {JSX.Element}
 */
export default function BackToHomeLink() {
  return (
    <Link to="/home" className={styles.link}>
      <ArrowLeft size={18} aria-hidden="true" />
      Back to Home
    </Link>
  );
}
