import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {Chart,ArcElement,CategoryScale,LinearScale,Title,Tooltip} from "chart.js";
import Label from "./Label";
import Axios from "axios";

Chart.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip);

const Graph = ({ goal }) => {
  const [exerciseData, setExerciseData] = useState([]);
  const userID = window.localStorage.getItem("userID");

  useEffect(() => {
    if (userID) {
      Axios.get(`https://fitsync-backend.onrender.com/api/addExercise?user_id=${userID}`)
        .then((response) => {
          const data = response.data;
          const currentDate = new Date().toDateString();

          const filteredData = data.filter(
            (entry) =>
              entry.user_id === userID &&
              new Date(entry.date).toDateString() === currentDate
          );

          setExerciseData(filteredData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userID]);

  const remainingCalories =
    goal - exerciseData.reduce((total, entry) => total + entry.amount, 0);

  const pieData = {
    labels: [...exerciseData.map((entry) => entry.name), "Remaining Calories"],
    datasets: [
      {
        data: [...exerciseData.map((entry) => entry.amount), remainingCalories],
        backgroundColor: [
          "#f9c74f",
          "#a05195",
          "#2a9d8f",
          "#e76f51",
          "#89609e",
          "#b4aee8", 
        ],
        hoverOffset: 4,
        borderRadius: 30,
        spacing: 1,
      },
    ],
  };

  const config = {
    data: pieData,
    options: {
      plugins: {
        title: {
          display: false, 
          text: `Exercise Calories`,
          font: {
            size: 18,
            weight: "bold",
          },
        },
        legend: {
          display: true,
          position: "bottom",
        },
      },
      onDraw: (chart) => {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;

        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em Arial";
        ctx.textBaseline = "middle";
        const text = `Remaining: ${remainingCalories} KCal`;

        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  };

  return (
    <div className="flex items-center justify-center max-w-md mx-auto">
      <div className="bg-white rounded-md p-4 w-full">
        <div className="mx-auto relative">
          <Pie {...config}></Pie>
        </div>
        <Label
          goal={goal}
          totalCal={exerciseData.reduce(
            (total, entry) => total + entry.amount,
            0
          )}
        />
      </div>
    </div>
  );
};

export default Graph;