import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./BackHome.module.css";

export default function BackHome() {
  return (
    <Link to="/home" className={styles.link}>
      <ArrowLeft size={18} aria-hidden="true" />
      Back to Home
    </Link>
  );
}
