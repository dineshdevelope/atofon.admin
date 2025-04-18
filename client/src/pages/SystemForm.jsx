import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SystemForm = ({ system, onSuccess, handleFormClose }) => {
  const [formData, setFormData] = useState({
    systemName: "",
    systemNumber: "",
    invoiceNo: "",
    invoiceDate: "",
    warranty: "",
    warrantyExpiryDate: "",
    isActive: true,
    processor: "",
    motherboard: "",
    ram: "",
    Storage: "",
    graphicsCard: "",
    operatingSystem: "",
    antivirus: "",
    cabinet: "",
    monitor: "",
    keyboard: "",
    mouse: "",
    serialNo: {
      processer: "",
      motherboard: "",
      storage: "",
      cabinet: "",
      display: "",
      keyboard: "",
      mouse: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (system) {
      setFormData({
        systemName: system.systemName || "",
        systemNumber: system.systemNumber || "",
        invoiceNo: system.invoiceNo || "",
        invoiceDate: system.invoiceDate || "",
        warranty: system.warranty || "",
        warrantyExpiryDate: system.warrantyExpiryDate || "",
        isActive: system.isActive !== undefined ? system.isActive : true,
        processor: system.processor || "",
        motherboard: system.motherboard || "",
        ram: system.ram || "",
        Storage: system.Storage || "",
        graphicsCard: system.graphicsCard || "",
        operatingSystem: system.operatingSystem || "",
        antivirus: system.antivirus || "",
        cabinet: system.cabinet || "",
        monitor: system.monitor || "",
        keyboard: system.keyboard || "",
        mouse: system.mouse || "",
        password: system.password || "",
        wifi_Dongle: system.wifi_Dongle || "",
        serialNo: {
          processer: system.serialNo?.processer || "",
          motherboard: system.serialNo?.motherboard || "",
          storage: system.serialNo?.storage || "",
          cabinet: system.serialNo?.cabinet || "",
          display: system.serialNo?.display || "",
          keyboard: system.serialNo?.keyboard || "",
          mouse: system.serialNo?.mouse || "",
        },
      });
    } else {
      setFormData({
        systemName: "",
        systemNumber: "",
        invoiceNo: "",
        invoiceDate: "",
        warranty: "",
        warrantyExpiryDate: "",
        isActive: true,
        processor: "",
        motherboard: "",
        ram: "",
        Storage: "",
        graphicsCard: "",
        operatingSystem: "",
        antivirus: "",
        cabinet: "",
        monitor: "",
        keyboard: "",
        mouse: "",
        password: "",
        wifi_Dongle: "",
        serialNo: {
          processer: "",
          motherboard: "",
          storage: "",
          cabinet: "",
          display: "",
          keyboard: "",
          mouse: "",
        },
      });
    }
  }, [system]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("serialNo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        serialNo: {
          ...prev.serialNo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.systemNumber.trim()) {
      newErrors.systemNumber = "System number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (system) {
        const response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/systems/${system._id}`,
          formData
        );
        toast.success("System updated successfully");
        onSuccess(response.data.data, false);
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/systems`,
          formData
        );
        toast.success("System created successfully");
        onSuccess(response.data.data, true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save system");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Number *
            </label>
            <input
              type="text"
              name="systemNumber"
              value={formData.systemNumber}
              onChange={handleChange}
              className={`w-full border ${
                errors.systemNumber ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2`}
            />
            {errors.systemNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.systemNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Name
            </label>
            <input
              type="text"
              name="systemName"
              value={formData.systemName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Password
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex items-center sm:mt-10">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active System
            </label>
          </div>
        </div>

        {/* Purchase Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2">
            Purchase Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warranty
            </label>
            <input
              type="text"
              name="warranty"
              value={formData.warranty}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warranty Expiry Date
            </label>
            <input
              type="date"
              name="warrantyExpiryDate"
              value={formData.warrantyExpiryDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Hardware Specifications */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">
          Hardware Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Processor
            </label>
            <input
              type="text"
              name="processor"
              value={formData.processor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motherboard
            </label>
            <input
              type="text"
              name="motherboard"
              value={formData.motherboard}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RAM
            </label>
            <input
              type="text"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Storage
            </label>
            <input
              type="text"
              name="Storage"
              value={formData.Storage}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graphics Card
            </label>
            <input
              type="text"
              name="graphicsCard"
              value={formData.graphicsCard}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operating System
            </label>
            <input
              type="text"
              name="operatingSystem"
              value={formData.operatingSystem}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Peripherals */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">
          Peripherals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Antivirus
            </label>
            <input
              type="text"
              name="antivirus"
              value={formData.antivirus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cabinet
            </label>
            <input
              type="text"
              name="cabinet"
              value={formData.cabinet}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monitor
            </label>
            <input
              type="text"
              name="monitor"
              value={formData.monitor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keyboard
            </label>
            <input
              type="text"
              name="keyboard"
              value={formData.keyboard}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mouse
            </label>
            <input
              type="text"
              name="mouse"
              value={formData.mouse}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WiFi Dongle
            </label>
            <input
              type="text"
              name="wifi_Dongle"
              value={formData.wifi_Dongle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Serial Numbers */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">
          Serial Numbers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Processor Serial
            </label>
            <input
              type="text"
              name="serialNo.processer"
              value={formData.serialNo.processer}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motherboard Serial
            </label>
            <input
              type="text"
              name="serialNo.motherboard"
              value={formData.serialNo.motherboard}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Storage Serial
            </label>
            <input
              type="text"
              name="serialNo.storage"
              value={formData.serialNo.storage}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cabinet Serial
            </label>
            <input
              type="text"
              name="serialNo.cabinet"
              value={formData.serialNo.cabinet}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Serial
            </label>
            <input
              type="text"
              name="serialNo.display"
              value={formData.serialNo.display}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keyboard Serial
            </label>
            <input
              type="text"
              name="serialNo.keyboard"
              value={formData.serialNo.keyboard}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mouse Serial
            </label>
            <input
              type="text"
              name="serialNo.mouse"
              value={formData.serialNo.mouse}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => handleFormClose()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Saving..." : system ? "Update System" : "Create System"}
        </button>
      </div>
    </form>
  );
};

export default SystemForm;
