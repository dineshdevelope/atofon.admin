import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeCards = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // for navigation

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/employee`)
      .then((res) => {
        setEmployees(res.data.data || []);
        setError("");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Error fetching employee data. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleViewClick = (id) => {
    navigate(`/employee/${id}`); // Change this route to match your EmployeeList page route
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Employee Overview
        </h1>

        {loading && (
          <p className="text-center text-blue-500 font-medium">
            Loading employees...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="flex justify-between items-center my-5 ">
              <button
                className="text-black-600 text-sm bg-gray-300 hover:bg-gray-400 transition duration-300 px-4 py-2 rounded-lg font-small"
                onClick={() => navigate("/employee/new")}
              >
                Add Employee
              </button>
              <p className=" text-gray-600 text-sm ">
                Total Employees:{" "}
                <span className="font-semibold">{employees.length}</span>
              </p>
            </div>
            {/*  <p className="text-right text-gray-600 text-sm mb-4">
              Total Employees:{" "}
              <span className="font-semibold">{employees.length}</span>
            </p> */}

            {employees.length === 0 ? (
              <p className="text-center text-gray-500">
                No employees available.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((emp) => (
                  <div
                    key={emp._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          emp.profilePicture ||
                          "https://via.placeholder.com/100"
                        }
                        alt={emp.name}
                        className="w-20 h-20 object-cover rounded-full border"
                      />
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {emp.name}
                        </h2>
                        <p className="text-sm text-gray-600">Age: {emp.age}</p>
                        <p className="text-sm text-gray-600">
                          Phone:{" "}
                          <a
                            href={`tel:${emp.phoneNumber}`}
                            className="text-blue-600 hover:underline"
                          >
                            {emp.phoneNumber}
                          </a>
                        </p>

                        <p className="text-sm text-gray-600">
                          {emp.address?.area}, {emp.address?.district}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewClick(emp._id)}
                      className="mt-auto bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View Full List
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeCards;
