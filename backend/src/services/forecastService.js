import axios from "axios";
import SalesHistory from "../models/SalesHistory.js";

export const getForecast = async () => {
  const history = await SalesHistory.find().sort({ date: 1 });
  const payload = history.map((record, index) => ({
    day_index: index + 1,
    quantity_sold: record.quantity_sold
  }));

  const mlUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";
  const response = await axios.post(`${mlUrl}/forecast`, { data: payload });

  return {
    source_points: payload.length,
    forecast: response.data
  };
};
