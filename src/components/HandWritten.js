import React, {useRef, useState} from "react"
import axios from "axios"

import {Bar} from "react-chartjs-2"
import styles from "./HandWritten.module.scss"

const HandWritten = () => {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const canvasWidth = 28
  const canvasHeight = 28

  const [predictedLabel, setPredictedLabel] = useState("")
  const [predictionProb, setPredictionProb] = useState([])

  const data = {
    labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    datasets:[{
      label: "prediction",
      data: predictionProb
    }]
  }

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
  
  const predict = async () => {
    const base64String = canvasRef.current.toDataURL("image/png")
    console.log(base64String)
    
    const response = await axios.post("http://localhost:8000/api/predict", {
      "image": base64String
    }).catch(error => {
      console.log("an error occurred while predicting")
    })

    setPredictedLabel(response.data.predicted_label)
    setPredictionProb(response.data.prediction_prob)

    console.log(response)
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
        <button onClick={predict}>predict</button>
      </div>

      <div>
        <h2>Predicted: {predictedLabel}</h2>
        {/*{predictionProb.map((prob, index) => (*/}
        {/*  <p>{index}: {prob}</p>*/}
        {/*))}*/}
        <Bar data={data} />
      </div>
    </div>
  )
}

export default HandWritten
