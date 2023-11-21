import React, { useState, useEffect } from "react";
import axios from "axios";
import {Area,AreaChart,ResponsiveContainer,Tooltip,XAxis,YAxis,CartesianGrid} from "recharts";
import {  format } from "date-fns";

function WeightChart(props) {
  const [details, setDetails] = useState({});
  const [weight_labels, setWeight_labels] = useState([]);
  const [weight_data, setWeight_data] = useState([]);
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
    if (details && details.weight_label && details.weight_data) {
      setWeight_labels(details.weight_label);
      setWeight_data(details.weight_data);
    }
  }, [details]);

  const weight_data_float = weight_data.map((value) => parseFloat(value));

  const combinedArray = weight_labels.map((date, index) => {
    return {
      date,
      totalWEIGHT: weight_data_float[index],
    };
  });

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h4>WEIGHT GRAPH</h4>

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
              value: "Weight",
              angle: -90,
              position: "insideLeft",
              dy: 10,
            }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="totalWEIGHT"
            stroke="rgba(149, 189, 242, 1)"
            fill="rgba(149, 189, 242, 0.534)"
            strokeWidth={3}
            dot={{
              fill: "rgba(149, 189, 242, 0.534)",
              r: 4,
              strokeWidth: 2,
              stroke: "rgba(149, 189, 242, 1)",
            }}
          />
          <CartesianGrid />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeightChart;