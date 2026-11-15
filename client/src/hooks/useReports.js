
import { useState } from "react";
import api from "../services/api";

function useReports() {
  const [reportType, setReportType] = useState("");
  const [dailyReportDate, setDailyReportDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [reportMessage, setReportMessage] = useState("");

  const fetchReport = async (type) => {
    setReportMessage("");
    setReportData(null);

    try {
      const token = localStorage.getItem("token");

      let url = `/reports/${type}`;

      if (type === "daily") {
        if (!dailyReportDate) {
          setReportMessage("Please select a date.");
          return;
        }

        url += `?date=${dailyReportDate}`;
      }

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReportType(type);
      setReportData(response.data);
    } catch (error) {
      setReportMessage(
        error.response?.data?.message ||
          "Failed to fetch report."
      );
    }
  };

  return {
    reportType,
    dailyReportDate,
    setDailyReportDate,
    reportData,
    reportMessage,
    fetchReport,
    setReportType,
    setReportData,
    setReportMessage,
  };
}

export default useReports;
