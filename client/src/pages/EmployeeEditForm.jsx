import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EmployeeEditForm = () => {
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const cloudinaryName = import.meta.env.VITE_API_CLOUDNAME;
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

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

  // Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "uniqueId":
        if (!value.trim()) error = "Employee ID is required";
        break;
      case "age":
        if (!value) error = "Age is required";
        else if (isNaN(value)) error = "Age must be a number";
        else if (value < 18) error = "Minimum age is 18";
        else if (value > 60) error = "Maximum age is 60";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;
      case "phoneNumber":
        if (!value) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value))
          error = "Phone number must be 10 digits";
        break;
      case "alternatePhoneNumber":
        if (value && !/^\d{10}$/.test(value))
          error = "Alternate phone must be 10 digits";
        break;
      case "qualification":
      case "role":
      case "department":
        if (!value.trim()) error = "This field is required";
        break;
      case "joiningDate":
        if (!value) error = "Joining date is required";
        break;
      case "salary":
        if (!value) error = "Salary is required";
        else if (isNaN(value)) error = "Salary must be a number";
        else if (value < 0) error = "Salary cannot be negative";
        break;
      case "address.pincode":
        if (value && !/^\d{6}$/.test(value)) error = "Pincode must be 6 digits";
        break;
      case "emergencyContact.phoneNumber":
        if (!value) error = "Emergency phone is required";
        else if (!/^\d{10}$/.test(value))
          error = "Emergency phone must be 10 digits";
        break;
      case "bankDetails.bankAccountNumber":
        if (value && !/^\d{9,18}$/.test(value))
          error = "Account number must be 9-18 digits";
        break;
      case "bankDetails.IFSC_Code":
        if (value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
          error = "Invalid IFSC format (e.g., ABCD0123456)";
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    for (const field in formData) {
      if (typeof formData[field] === "object") {
        for (const subField in formData[field]) {
          const fullName = `${field}.${subField}`;
          const error = validateField(fullName, formData[field][subField]);
          if (error) {
            newErrors[fullName] = error;
            isValid = false;
          }
        }
      } else {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Fetch employee data when component mounts
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/employee/${id}`);
        setFormData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("Failed to load employee data");
        navigate("/");
      }
    };

    fetchEmployee();
  }, [id, apiUrl, navigate]);

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
      toast.error("Image upload failed. Please try again.");
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    try {
      let updatedData = { ...formData };

      if (profileFile) {
        const uploadedProfileUrl = await uploadFileToCloudinary(profileFile);
        updatedData = {
          ...updatedData,
          profilePicture: uploadedProfileUrl,
        };
      }

      const response = await axios.put(
        `${apiUrl}/api/employee/${id}`,
        updatedData
      );

      console.log("Success:", response.data);
      setUploading(false);
      toast.success("Employee updated successfully!");
      navigate(`/employee/${id}`);
    } catch (error) {
      console.error("Update error", error.response?.data || error.message);
      toast.error("Failed to update employee. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading employee data...</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Employee</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { field: "name", label: "Name *", type: "text" },
          { field: "uniqueId", label: "Unique ID *", type: "text" },
          { field: "age", label: "Age * (18-60)", type: "number" },
          { field: "email", label: "Email *", type: "email" },
          { field: "qualification", label: "Qualification *", type: "text" },
          { field: "role", label: "Role *", type: "text" },
          { field: "department", label: "Department *", type: "text" },
          { field: "phoneNumber", label: "Phone Number *", type: "tel" },
          {
            field: "alternatePhoneNumber",
            label: "Alternate Phone",
            type: "tel",
          },
          { field: "salary", label: "Salary *", type: "number" },
          { field: "bloodGroup", label: "Blood Group", type: "text" },
        ].map(({ field, label, type }) => (
          <div key={field}>
            <label className="block text-gray-700 font-medium mb-1">
              {label}
            </label>
            <input
              type={type}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border ${
                errors[field] ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              min={field === "age" ? 18 : undefined}
              max={field === "age" ? 60 : undefined}
              maxLength={field.includes("phone") ? 10 : undefined}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
            )}
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
            onBlur={handleBlur}
            className={`w-full border ${
              errors.joiningDate ? "border-red-500" : "border-gray-300"
            } rounded-lg px-3 py-2`}
          />
          {errors.joiningDate && (
            <p className="text-red-500 text-sm mt-1">{errors.joiningDate}</p>
          )}
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
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                  {field} {field === "pincode" && "(6 digits)"}
                </label>
                <input
                  type={field === "pincode" ? "number" : "text"}
                  name={`address.${field}`}
                  value={formData.address[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border ${
                    errors[`address.${field}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg px-3 py-2`}
                  maxLength={field === "pincode" ? 6 : undefined}
                />
                {errors[`address.${field}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`address.${field}`]}
                  </p>
                )}
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
                  {field} {field.includes("phone") && "(10 digits)"}
                </label>
                <input
                  type={field.includes("phone") ? "tel" : "text"}
                  name={`emergencyContact.${field}`}
                  value={formData.emergencyContact[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border ${
                    errors[`emergencyContact.${field}`]
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg px-3 py-2`}
                  maxLength={field.includes("phone") ? 10 : undefined}
                />
                {errors[`emergencyContact.${field}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`emergencyContact.${field}`]}
                  </p>
                )}
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
            { field: "bankName", label: "Bank Name", type: "text" },
            {
              field: "bankAccountNumber",
              label: "Account Number (9-18 digits)",
              type: "text",
            },
            {
              field: "IFSC_Code",
              label: "IFSC Code (e.g., ABCD0123456)",
              type: "text",
            },
            { field: "gpay", label: "GPay Number", type: "tel" },
            { field: "phonepay", label: "PhonePe Number", type: "tel" },
            { field: "upiId", label: "UPI ID", type: "text" },
          ].map(({ field, label, type }) => (
            <div key={field}>
              <label className="block text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={`bankDetails.${field}`}
                value={formData.bankDetails[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border ${
                  errors[`bankDetails.${field}`]
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-3 py-2`}
                maxLength={field === "IFSC_Code" ? 11 : undefined}
              />
              {errors[`bankDetails.${field}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`bankDetails.${field}`]}
                </p>
              )}
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
        {formData.profilePicture && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Current Image:</p>
            <img
              src={formData.profilePicture}
              alt="Current Profile"
              className="w-20 h-20 object-cover rounded mt-1"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          disabled={uploading}
        >
          {uploading ? "Updating..." : "Update Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeEditForm;
