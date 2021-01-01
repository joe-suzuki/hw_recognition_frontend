import React, {useRef, useState, useEffect} from "react"
import axios from "axios"

import {Bar} from "react-chartjs-2"
import styles from "./HandWritten.module.scss"

const HandWritten = () => {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const canvasWidth = 28
  const canvasHeight = 28

  const modelList = ["simple", "auged"]
  const [selectedModel, setSelectedModel] = useState(modelList[0])

  const [predictedLabel, setPredictedLabel] = useState("")
  const [predictionProb, setPredictionProb] = useState([])

  const [base64String, setBase64String] = useState("")

  useEffect(() => {
    if(base64String){
      (async () => {
        const response = await axios.post("http://localhost:8000/api/predict", {
          "image": base64String,
          "model_type": selectedModel
        }).catch(error => {
          console.log("an error occurred while predicting")
        })

        setPredictedLabel(response.data.predicted_label)
        setPredictionProb(response.data.prediction_prob)

        console.log(response)
      })()
    }
  }, [base64String, selectedModel])

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
    const base64 = canvasRef.current.toDataURL("image/png")
    console.log(base64)
    setBase64String(base64)
  }

  const handleReset = () => {
    clearDrawing()
    setBase64String("")

    setPredictedLabel("")
    setPredictionProb([])
  }

  const onSelectedModelChange = (e) => {
    setSelectedModel(e.target.value)
  }

  return(
    <div className={styles.wrapper}>
      <h1>Hand Written Recognition</h1>

      <div className={styles.model_list_wrapper}>
        {modelList.map((model, index) => (
          <div key={index}>
            <input
              type="radio"
              value={model}
              name={model}
              checked={selectedModel===model}
              onChange={onSelectedModelChange}
            />
            <lable>{model}</lable>
          </div>
        ))}
      </div>

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
        <button onClick={handleReset}>reset</button>
        <button onClick={predict}>predict</button>
      </div>

      <div>
        <h2>Predicted: {predictedLabel}</h2>
        <Bar data={data} />
      </div>
    </div>
  )
}

export default HandWritten
