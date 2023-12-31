import React, { useEffect, useState } from "react";
import List from "./List";
import Axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Form = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(null);
  const [newdate, setDate] = useState(null);
  const [calorieList, setCalorieList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userID, setUserID] = useState(null);

  const addFood = () => {
    if (!name || amount === 0 || !newdate) {
      console.log("Please fill in all fields.");
      return;
    }
    const user = window.localStorage.getItem("userID");

    if (!user) {
      console.log("User is not authenticated. Cannot add food entry.");
      return;
    }

    setUserID(user); 

    if (selectedItem) {
      Axios.put(`https://fitsync-backend.onrender.com/api/updateCalorie/${selectedItem._id}`, {
        userID: user,
        name: name,
        amount: amount,
        date: newdate,
      })
        .then((response) => {
          console.log(response);
          setName("");
          setAmount(0);
          setSelectedItem(null);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Axios.post("https://fitsync-backend.onrender.com/api/addCalorie", {
        userID: user,
        name: name,
        amount: amount,
        date: newdate,
      })
        .then((response) => {
          console.log(response);
          setName("");
          setAmount(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    Axios.get("https://fitsync-backend.onrender.com/api/addCalorie")
      .then((response) => {
        setCalorieList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedItem]); 

  const deleteCalorie = (id) => {
    Axios.delete(`https://fitsync-backend.onrender.com/api/addCalorie/${id}`).then(() => {
      setCalorieList(calorieList.filter((val) => val._id !== id));
    });
  };

  return (
    <div className="form max-w-sm mx-auto w-96">
      <h1 className="font-bold pb-4 text-xl"> Add Meal</h1>
      <form id="form" onSubmit={addFood}>
        <div className="grid gap-4">
          <div className="input-group">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Food name"
              value={name}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 bg-white rounded-md focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Calorie content"
              value={amount}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 bg-white rounded-md focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="input-group">
            <DatePicker
              selected={newdate}
              onChange={(newdate) => setDate(newdate)}
              placeholderText="Select Date"
              dateFormat="yyyy-MM-dd"
              isClearable
              filterDate={(d) => new Date() > d}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 bg-white rounded-md focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="border py-2 text-white bg-green-400 w-full"
            >
              {selectedItem ? "Update" : "Add"}
            </button>
            {selectedItem && (
              <button
                onClick={() => setSelectedItem(null)}
                className="border py-2 text-white bg-red-400 w-full mt-2"
              >
                Cancel Update
              </button>
            )}
          </div>
        </div>
      </form>
      <List
        calorieList={calorieList}
        deleteCalorie={deleteCalorie}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
};

export default Form;
