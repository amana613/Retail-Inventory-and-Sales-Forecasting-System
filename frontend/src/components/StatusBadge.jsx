import React from "react";

const StatusBadge = ({ type, status }) => {
  const s = status ? status.toLowerCase() : "pending";

  // Base configuration
  const config = {
    bg: "#e2e8f0", // default gray
    color: "#475569",
    label: status,
  };

  if (type === "payment") {
    if (s === "paid" || s === "true") {
      config.bg = "#dcfce3"; // green
      config.color = "#166534";
      config.label = "Paid";
    } else {
      config.bg = "#fee2e2"; // red
      config.color = "#991b1b";
      config.label = "Not Paid";
    }
  } else if (type === "order") {
    switch (s) {
      case "pending":
        config.bg = "#fef3c7"; // yellow
        config.color = "#854d0e";
        config.label = "Pending";
        break;
      case "processing":
        config.bg = "#dbeafe"; // blue
        config.color = "#1e40af";
        config.label = "Processing";
        break;
      case "dispatched":
        config.bg = "#f3e8ff"; // purple
        config.color = "#6b21a8";
        config.label = "Dispatched";
        break;
      case "delivered":
        config.bg = "#dcfce3"; // green
        config.color = "#166534";
        config.label = "Delivered";
        break;
      case "cancelled":
        config.bg = "#fee2e2"; // red
        config.color = "#991b1b";
        config.label = "Cancelled";
        break;
      default:
        break;
    }
  }

  return (
    <span
      style={{
        background: config.bg,
        color: config.color,
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: "bold",
        display: "inline-block",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
