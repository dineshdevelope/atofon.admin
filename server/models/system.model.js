import mongoose, { Schema } from "mongoose";

const systemSchema = new Schema(
  {
    systemName: { type: String },
    systemNumber: { type: String, required: true },
    invoiceNo: { type: String },
    invoiceDate: { type: Date },
    warranty: { type: String },
    warrantyExpiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
    processor: { type: String },
    motherboard: { type: String },
    ram: { type: String },
    Storage: { type: String },
    graphicsCard: { type: String },
    operatingSystem: { type: String },
    antivirus: { type: String },
    cabinet: { type: String },
    monitor: { type: String },
    keyboard: { type: String },
    mouse: { type: String },
    password: { type: String },
    wifi_Dongle: { type: String },

    serialNo: {
      processer: { type: String },
      motherboard: { type: String },
      storage: { type: String },
      cabinet: { type: String },
      display: { type: String },
      keyboard: { type: String },
      mouse: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const System = mongoose.model("System", systemSchema);
export default System;
