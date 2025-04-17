import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // ⬅️ Import useParams

const SingleEmployeeDetail = () => {
  const { id } = useParams(); // ⬅️ Get ID from URL
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null); // ⬅️ Store a single employee object
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return; // User cancelled the deletion
    }
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/employee/${id}`
      );
      console.log("Employee deleted:", response.data);
      setEmployee(null); // Clear the employee data after deletion
      setError(null); // Clear any previous error messages
      navigate("/"); // Redirect to the employee list page
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError(
        error.response?.data?.message ||
          "Something went wrong while deleting the employee."
      );
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/employee/${id}`)
      .then((res) => {
        setEmployee(res.data.data || null);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch employee:", err);
        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching employee data."
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Employee Details
      </h1>

      {loading && (
        <div className="text-center text-blue-500 font-semibold text-lg">
          Loading employee...
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 font-medium mb-4">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && !employee && (
        <p className="text-center text-gray-500 text-lg">No employee found.</p>
      )}

      {!loading && employee && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
          {/*  <div className="flex items-center gap-4 mb-6">
            <img
              src={employee.profilePicture || "https://via.placeholder.com/100"}
              alt={employee.name}
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {employee.name}
              </h2>
              <p className="text-sm text-gray-500">
                {employee.role} - {employee.department}
              </p>
              <p className="text-xs text-gray-600">
                Joined:{" "}
                {employee.joiningDate
                  ? new Date(employee.joiningDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div> */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={
                  employee.profilePicture || "https://via.placeholder.com/100"
                }
                alt={employee.name}
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {employee.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {employee.role} - {employee.department}
                </p>
                <p className="text-xs text-gray-600">
                  Joined:{" "}
                  {employee.joiningDate
                    ? new Date(employee.joiningDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                className="text-black-600 text-sm bg-gray-300 hover:bg-gray-400 transition duration-300 px-4 py-2 rounded-lg font-small"
                onClick={() => navigate(`/employee/edit/${employee._id}`)}
              >
                Edit
              </button>
              <button
                className="text-black-600 text-sm bg-red-400 hover:bg-red-500 transition duration-300 px-4 py-2 rounded-lg font-small"
                onClick={() => handleDelete(employee._id)}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-700 space-y-2 mb-6">
            <p>
              Email:{" "}
              <a
                href={`mailto:${employee.email}`}
                className="text-blue-600 hover:underline"
              >
                {employee.email}
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href={`tel:${employee.phoneNumber}`}
                className="text-blue-600 hover:underline"
              >
                {employee.phoneNumber}
              </a>
            </p>
            <p>Age: {employee.age}</p>
            <p>Qualification: {employee.qualification}</p>
            <p>Skills: {employee.skills}</p>
            <p>Blood Group: {employee.bloodGroup}</p>
            <p>Salary: ₹{employee.salary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-600 mb-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">🏠 Address</h4>
              <p>
                {employee.address?.street}, {employee.address?.landmark}
              </p>
              <p>
                {employee.address?.area}, {employee.address?.district}
              </p>
              <p>
                {employee.address?.state} - {employee.address?.pincode}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                📞 Emergency Contact
              </h4>
              <p>
                {employee.emergencyContact?.name} (
                {employee.emergencyContact?.relationship})
              </p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:${employee.emergencyContact?.phoneNumber}`}
                  className="text-blue-600 hover:underline"
                >
                  {employee.emergencyContact?.phoneNumber}
                </a>
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                🏦 Bank Details
              </h4>
              <p>Bank: {employee.bankDetails?.bankName}</p>
              <p>Account No: {employee.bankDetails?.bankAccountNumber}</p>
              <p>IFSC: {employee.bankDetails?.IFSC_Code}</p>
              <p>UPI: {employee.bankDetails?.upiId}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                🖥️ Other Info
              </h4>
              <p>System No: {employee.systemNumber || "N/A"}</p>
              <p>
                Company Room: {employee.isStayingCompanyRoom ? "Yes" : "No"}
              </p>
              <p>
                Company System: {employee.isUsingCompanySystem ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {employee.certificateImage && (
            <a
              href={employee.certificateImage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm underline"
            >
              📎 View Certificate
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleEmployeeDetail;
