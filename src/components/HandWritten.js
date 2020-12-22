import React, {useRef, useState} from "react"

import styles from "./HandWritten.module.scss"

const HandWritten = () => {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const canvasWidth = 28
  const canvasHeight = 28

  const startDrawing = () => {
    setDrawing(true)

    const canvas = canvasRef.current.getContext("2d")
    canvas.beginPath()
  }

  const endDrawing = () => {
    setDrawing(false)
  }

  const draw = (x, y) => {
    if(!drawing){
      return
    }
    const canvas = canvasRef.current.getContext("2d")
    canvas.lineTo(x, y)
    canvas.stroke()
  }

  const clearDrawing = () => {
    const canvas = canvasRef.current.getContext("2d")
    canvas.clearRect(0, 0, canvasWidth, canvasHeight)
  }

  return(
    <div className={styles.wrapper}>
      <h1>Hand Written Recognition</h1>

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onMouseMove={(e) => draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
        className={styles.canvas}
      />

      <div className={styles.buttons_wrapper}>
        <button onClick={clearDrawing}>reset</button>
        <button>predict</button>
      </div>
    </div>
  )
}

export default HandWritten