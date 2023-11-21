import React, { useState, useEffect } from "react";
import axios from "axios";
import {Area,AreaChart,ResponsiveContainer,Tooltip,XAxis,YAxis,CartesianGrid} from "recharts";
import { format } from "date-fns";

function BodyFatChart(props) {
  const [details, setDetails] = useState({});
  const [fat_labels, setFat_labels] = useState([]);
  const [fat_data, setFat_data] = useState([]);

  const user = window.localStorage.getItem("userID");
  const { refreshUpperBMI } = props;
  useEffect(() => {
    axios
      .get(`https://fitsync-backend.onrender.com/details/retrieve/${user}`)
      .then(({ data }) => {
        setDetails(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshUpperBMI]);

  useEffect(() => {
    if (details && details.fat_labels && details.fat_data) {
      setFat_labels(details.fat_labels);
      setFat_data(details.fat_data);
      console.log(fat_labels);
      console.log(fat_data);
    }
  }, [details]);

  const fat_data_float = fat_data.map((value) => parseFloat(value));

  const combinedArray = fat_labels.map((date, index) => {
    return {
      date,
      totalFAT: fat_data_float[index],
    };
  });

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h4>FAT GRAPH</h4>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={combinedArray}>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM dd")}
            label={{
              value: "Date",
              position: "insideBottomRight",
              offset: 250,
              dy: 250,
            }}
          />

          <YAxis
            label={{
              value: "FAT(%)",
              angle: -90,
              position: "insideLeft",
              dy: 10,
            }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="totalFAT"
            stroke="rgba(147, 216, 132, 1)"
            fill="rgba(147, 216, 132, 0.5)"
            strokeWidth={3}
            dot={{
              fill: "rgba(147, 216, 132, 1)",
              r: 4,
              strokeWidth: 2,
              stroke: "rgba(147, 216, 132, 1)",
            }}
          />
          <CartesianGrid />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BodyFatChart;
