import React from "react"

import styles from "./HandWritten.module.scss"

const HandWritten = () => {
  const canvasWidth = 28
  const canvasHeight = 28

  return(
    <div className={styles.wrapper}>
      <h1>Hand Written Recognition</h1>

      <canvas
        width={canvasWidth}
        height={canvasHeight}
        className={styles.canvas}
      />

      <div className={styles.buttons_wrapper}>
        <button>reset</button>
        <button>predict</button>
      </div>
    </div>
  )
}

export default HandWritten