import React, { useState, useEffect } from "react";
import "boxicons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const List = ({ calorieList, deleteCalorie, setSelectedItem }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userCalorieList, setUserCalorieList] = useState([]);
  const user = window.localStorage.getItem("userID");

  useEffect(() => {
    const filteredList = calorieList.filter((item) => item.user_id === user);
    setUserCalorieList(filteredList);
  }, [calorieList, user]);

  const filteredCalorieList = userCalorieList.filter(
    (item) => new Date(item.date).toDateString() === selectedDate.toDateString()
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-col">
      <h1 className="py-4 mt-8 font-bold text-xl">Food Intake Log</h1>
      <div className="flex items-center">
        <label className="mr-2 text-gray-600">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          className="w-21 border rounded"
        />
      </div>
      <div className="overflow-x-auto mt-4 ">
        <table className=" w-full bg-white border border-gray-300">
          <thead className="border">
            <tr>
              <th className="text-center py-2 px-4">Food Name</th>
              <th className="text-center py-2 px-4">Calorie Content</th>
              <th className="text-center py-2 px-4">Date</th>
              <th className="text-center py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalorieList.map((value, index) => (
              <CalorieIntake
                key={index}
                category={value}
                deleteCalorie={deleteCalorie}
                setSelectedItem={setSelectedItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CalorieIntake = ({ category, deleteCalorie, setSelectedItem }) => {
  if (!category) return null;

  const handleUpdateClick = () => {
    setSelectedItem(category);
  };

  const handleDeleteClick = () => {
    deleteCalorie(category._id);
    window.location.reload(); 
  };

  return (
    <tr>
      <td className="border p-2">{category.name ?? "Unknown"}</td>
      <td className="border">{category.amount ?? 0} Calories</td>
      <td className="border">
        {category.date
          ? new Date(category.date).toLocaleDateString()
          : "Unknown Date"}
      </td>
      <td className="border justify-center p-1 space-x-2 ">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => handleUpdateClick(category)}
        >
          <box-icon type="solid" name="edit" color="blue"></box-icon>
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => handleDeleteClick(category._id)}
        >
          <box-icon name="trash" color="red"></box-icon>
        </button>
      </td>
    </tr>
  );
};

export default List;
