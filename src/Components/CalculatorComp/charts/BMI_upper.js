import React, { useState, useEffect } from "react";
import axios from "axios";
import {Area,AreaChart,ResponsiveContainer,Tooltip,XAxis,YAxis,CartesianGrid} from "recharts";
import { format } from "date-fns";

function BMI_upper(props) {
  const [details, setDetails] = useState({});
  const [bmi_labels, setBmi_labels] = useState([]);
  const [bmi_data, setBmi_data] = useState([]);

  const { refreshUpperBMI } = props;
  const user = window.localStorage.getItem("userID");

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
    if (details && details.bmi_labels && details.bmi_data) {
      setBmi_labels(details.bmi_labels);
      setBmi_data(details.bmi_data);
    }
  }, [details]);

  const bmi_data_float = bmi_data.map((value) => parseFloat(value));

  const combinedArray = bmi_labels.map((date, index) => {
    return {
      date,
      totalBMI: bmi_data_float[index],
    };
  });

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h4>BMI GRAPH</h4>

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
              value: "BMI",
              angle: -90,
              position: "insideLeft",
              dy: 10,
            }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="totalBMI"
            stroke="rgba(255, 99, 132, 1)"
            fill="rgba(255, 99, 132, 0.5)"
            strokeWidth={3}
            dot={{
              fill: "red",
              r: 4,
              strokeWidth: 2,
              stroke: "rgba(255, 99, 132, 1)",
            }}
          />
          <CartesianGrid />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BMI_upper;