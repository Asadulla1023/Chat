import React from "react";
import styles from "../styles/loading.module.css";
export default function LoadingPage() {
  return (
    <div className={styles.loading}>
      <div className={styles.ldsCircle}>
        <div></div>
      </div>
    </div>
  );
}
