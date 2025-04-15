import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeForm = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const cloudinaryName = import.meta.env.VITE_API_CLOUDNAME;
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    uniqueId: "",
    age: "",
    email: "",
    qualification: "",
    role: "",
    department: "",
    joiningDate: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    isActive: true,
    isStayingCompanyRoom: false,
    isUsingCompanySystem: false,
    systemNumber: "",
    certificateImage: "",
    profilePicture: "",
    resumeImage: "",
    skills: "",
    salary: "",
    bloodGroup: "",
    address: {
      street: "",
      district: "",
      area: "",
      landmark: "",
      state: "",
      pincode: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
    },
    bankDetails: {
      bankName: "",
      bankAccountNumber: "",
      IFSC_Code: "",
      gpay: "",
      phonepay: "",
      upiId: "",
    },
  });

  const [profileFile, setProfileFile] = useState(null);

  const uploadFileToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "images_preset");

    try {
      setUploading(true);
      const api = `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`;
      const res = await axios.post(api, data);
      return res.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert("Image upload failed. Please try again.");
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setProfileFile(files[0]);
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name.includes(".")) {
      const [section, key] = name.split(".");
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [key]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      uniqueId,
      age,
      email,
      qualification,
      role,
      department,
      phoneNumber,
    } = formData;
    if (
      !name ||
      !uniqueId ||
      !age ||
      !email ||
      !qualification ||
      !role ||
      !department ||
      !phoneNumber
    ) {
      alert("Please fill all the required fields.");
      return;
    }

    try {
      let uploadedProfileUrl = "";
      if (profileFile) {
        uploadedProfileUrl = await uploadFileToCloudinary(profileFile);
      }

      const updatedData = {
        ...formData,
        profilePicture: uploadedProfileUrl,
      };

      const response = await axios.post(`${apiUrl}/api/employee`, updatedData);
      console.log("Success:", response.data);
      setUploading(false);
      alert("Employee created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Submit error", error.response?.data || error.message);
      alert("Failed to submit. Check console for details.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Form</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "name",
          "uniqueId",
          "age",
          "email",
          "qualification",
          "role",
          "department",
          "phoneNumber",
          "alternatePhoneNumber",
          "salary",
          "bloodGroup",
        ].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-medium mb-1 capitalize">
              {/*  {field.replace(/([A-Z])/g, " $1")} */}
              {field === "name"
                ? "Name *"
                : field === "phoneNumber"
                ? "Phone Number *"
                : field === "role"
                ? "Role *"
                : field === "uniqueId"
                ? "Unique ID *"
                : field === "email"
                ? "Email *"
                : field === "department"
                ? "Department *"
                : field === "age"
                ? "Age *"
                : field === "qualification"
                ? "Qualification *"
                : field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={
                [
                  "age",
                  "salary",
                  "phoneNumber",
                  "alternatePhoneNumber",
                ].includes(field)
                  ? "number"
                  : "text"
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Joining Date *
          </label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Booleans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Is Active", name: "isActive" },
          { label: "Staying in Company Room", name: "isStayingCompanyRoom" },
          { label: "Using Company System", name: "isUsingCompanySystem" },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={item.name}
              checked={formData[item.name]}
              onChange={handleChange}
            />
            <label className="text-gray-700">{item.label}</label>
          </div>
        ))}
      </div>

      {/* Conditional System Number */}
      {formData.isUsingCompanySystem && (
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            System Number
          </label>
          <input
            type="text"
            name="systemNumber"
            value={formData.systemNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      )}

      {/* Address Section */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["street", "district", "area", "landmark", "state", "pincode"].map(
            (field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <input
                  type={field === "pincode" ? "number" : "text"}
                  name={`address.${field}`}
                  value={formData.address[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "relationship", "phoneNumber", "alternatePhoneNumber"].map(
            (field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <input
                  type={field.includes("phone") ? "number" : "text"}
                  name={`emergencyContact.${field}`}
                  value={formData.emergencyContact[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Skills</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Bank Details */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "bankName",
            "bankAccountNumber",
            "IFSC_Code",
            "gpay",
            "phonepay",
            "upiId",
          ].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 mb-1 capitalize">
                {field}
              </label>
              <input
                type={
                  ["bankAccountNumber", "gpay", "phonepay"].includes(field)
                    ? "number"
                    : "text"
                }
                name={`bankDetails.${field}`}
                value={formData.bankDetails[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Profile Picture Upload */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Profile Picture
        </label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
        >
          {uploading ? "Please Wait..." : "Create Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
