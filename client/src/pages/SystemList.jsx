import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SystemForm from "./SystemForm";
import SystemDetails from "./SystemDetails";

const SystemList = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentSystem, setCurrentSystem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch systems on component mount
  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/systems`
      );
      setSystems(response.data.data || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch systems");
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentSystem(null); // Clear any existing system data
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this system?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/systems/${id}`
        );
        // Update UI immediately by filtering out the deleted system
        setSystems((prevSystems) =>
          prevSystems.filter((sys) => sys._id !== id)
        );
        toast.success("System deleted successfully");
        setShowDetails(false);
      } catch (error) {
        toast.error("Failed to delete system");
      }
    }
  };

  const handleView = (system) => {
    setCurrentSystem(system);
    setShowDetails(true);
  };

  const handleEdit = (system) => {
    setCurrentSystem(system);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setCurrentSystem(null);
  };

  const handleFormSuccess = (systemData, isNew) => {
    if (isNew) {
      // Add new system to the beginning of the list
      setSystems((prevSystems) => [systemData, ...prevSystems]);
    } else {
      // Update existing system in the list
      setSystems((prevSystems) =>
        prevSystems.map((sys) =>
          sys._id === systemData._id ? systemData : sys
        )
      );
    }
    setShowForm(false);
  };

  const filteredSystems = systems.filter(
    (system) =>
      system.systemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (system.systemName &&
        system.systemName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          System Management
        </h1>
        <div className="flex space-x-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search systems..."
            className="px-4 py-2 border rounded-lg w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          >
            Add New System
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    System #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSystems.length > 0 ? (
                  filteredSystems.map((system) => (
                    <tr key={system._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {system.systemNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {system.systemName || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {system.processor || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            system.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {system.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleView(system)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(system)}
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(system._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No systems found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredSystems.length > 0 ? (
              filteredSystems.map((system) => (
                <div
                  key={system._id}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {system.systemNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {system.systemName || "No name"}
                      </p>
                    </div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        system.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {system.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="font-medium">Processor:</span>{" "}
                      {system.processor || "-"}
                    </p>
                    <p>
                      <span className="font-medium">RAM:</span>{" "}
                      {system.ram || "-"}
                    </p>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleView(system)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(system)}
                      className="text-yellow-600 hover:text-yellow-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(system._id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No systems found
              </div>
            )}
          </div>
        </>
      )}

      {/* System Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {currentSystem ? "Edit System" : "Add New System"}
                </h2>
                <button
                  onClick={handleFormClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <SystemForm
                system={currentSystem}
                onSuccess={handleFormSuccess}
                handleFormClose={handleFormClose}
              />
            </div>
          </div>
        </div>
      )}

      {/* System Details Modal */}
      {showDetails && currentSystem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  System Details - {currentSystem.systemNumber}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <SystemDetails
                system={currentSystem}
                onEdit={() => handleEdit(currentSystem)}
                onDelete={() => handleDelete(currentSystem._id)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemList;
