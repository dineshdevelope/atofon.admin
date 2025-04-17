import System from "../models/system.model.js";

// Create a new system
export const createSystem = async (req, res) => {
  try {
    const newSystem = new System(req.body);
    await newSystem.save();
    res.status(201).json({
      success: true,
      message: "System created successfully",
      data: newSystem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create system",
      error: error.message,
    });
  }
};

// Get all systems
export const getAllSystems = async (req, res) => {
  try {
    const systems = await System.find();
    res.status(200).json({
      success: true,
      data: systems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch systems",
      error: error.message,
    });
  }
};

// Get single system by ID
export const getSystemById = async (req, res) => {
  try {
    const system = await System.findById(req.params.id);
    if (!system) {
      return res.status(404).json({
        success: false,
        message: "System not found",
      });
    }
    res.status(200).json({
      success: true,
      data: system,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch system",
      error: error.message,
    });
  }
};

// Update system by ID
export const updateSystem = async (req, res) => {
  try {
    const updatedSystem = await System.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSystem) {
      return res.status(404).json({
        success: false,
        message: "System not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "System updated successfully",
      data: updatedSystem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update system",
      error: error.message,
    });
  }
};

// Delete system by ID
export const deleteSystem = async (req, res) => {
  try {
    const deletedSystem = await System.findByIdAndDelete(req.params.id);

    if (!deletedSystem) {
      return res.status(404).json({
        success: false,
        message: "System not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "System deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete system",
      error: error.message,
    });
  }
};
