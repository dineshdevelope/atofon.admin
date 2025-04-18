import React from "react";

const SystemDetails = ({ system, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2">
            Basic Information
          </h3>
          <DetailItem label="System Number" value={system.systemNumber} />
          <DetailItem label="System Name" value={system.systemName || "-"} />
          <DetailItem label="System Password" value={system.password || "-"} />
          <DetailItem
            label="Status"
            value={system.isActive ? "Active" : "Inactive"}
            highlight={system.isActive ? "text-green-600" : "text-red-600"}
          />
        </div>

        {/* Hardware Specifications */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2">
            Hardware Specifications
          </h3>
          <DetailItem label="Processor" value={system.processor || "-"} />
          <DetailItem label="Motherboard" value={system.motherboard || "-"} />
          <DetailItem label="RAM" value={system.ram || "-"} />
          <DetailItem label="Storage" value={system.Storage || "-"} />
          <DetailItem
            label="Graphics Card"
            value={system.graphicsCard || "-"}
          />
          <DetailItem
            label="Operating System"
            value={system.operatingSystem || "-"}
          />
        </div>
      </div>

      {/* Purchase Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">
          Purchase Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Invoice Number" value={system.invoiceNo || "-"} />
          <DetailItem
            label="Invoice Date"
            value={
              system.invoiceDate
                ? new Date(system.invoiceDate).toLocaleDateString()
                : "-"
            }
          />
          <DetailItem label="Warranty" value={system.warranty || "-"} />
          <DetailItem
            label="Warranty Expiry"
            value={
              system.warrantyExpiryDate
                ? new Date(system.warrantyExpiryDate).toLocaleDateString()
                : "-"
            }
          />
        </div>
      </div>

      {/* Peripherals */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">
          Peripherals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Antivirus" value={system.antivirus || "-"} />
          <DetailItem label="Cabinet" value={system.cabinet || "-"} />
          <DetailItem label="Monitor" value={system.monitor || "-"} />
          <DetailItem label="Keyboard" value={system.keyboard || "-"} />
          <DetailItem label="Mouse" value={system.mouse || "-"} />
          <DetailItem label="Wifi_Dongle" value={system.wifi_Dongle || "-"} />
        </div>
      </div>

      {/* Serial Numbers */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">
          Serial Numbers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem
            label="Processor Serial"
            value={system.serialNo?.processer || "-"}
          />
          <DetailItem
            label="Motherboard Serial"
            value={system.serialNo?.motherboard || "-"}
          />
          <DetailItem
            label="Storage Serial"
            value={system.serialNo?.storage || "-"}
          />
          <DetailItem
            label="Cabinet Serial"
            value={system.serialNo?.cabinet || "-"}
          />
          <DetailItem
            label="Display Serial"
            value={system.serialNo?.display || "-"}
          />
          <DetailItem
            label="Keyboard Serial"
            value={system.serialNo?.keyboard || "-"}
          />
          <DetailItem
            label="Mouse Serial"
            value={system.serialNo?.mouse || "-"}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete System
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit System
        </button>
      </div>
    </div>
  );
};

// Helper component for consistent detail display
const DetailItem = ({ label, value, highlight = "" }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className={`text-sm mt-1 ${highlight}`}>{value}</p>
  </div>
);

export default SystemDetails;
