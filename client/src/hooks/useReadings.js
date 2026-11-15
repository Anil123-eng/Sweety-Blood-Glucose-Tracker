
import { useState, useEffect } from "react";
import api from "../services/api";

function useReadings(isLoggedIn, setMessage) {
  const [readingDate, setReadingDate] = useState("");
  const [slot, setSlot] = useState("Morning fasting");
  const [glucoseValue, setGlucoseValue] = useState("");
  const [editingReadingId, setEditingReadingId] = useState(null);
  const [readings, setReadings] = useState([]);

  // Fetch glucose readings
  const fetchReadings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/readings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReadings(response.data.readings);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load glucose readings."
      );
    }
  };

  // Load readings after login
  useEffect(() => {
    if (isLoggedIn) {
      fetchReadings();
    }
  }, [isLoggedIn]);

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReadingId(null);
    setReadingDate("");
    setSlot("Morning fasting");
    setGlucoseValue("");
    setMessage("");
  };

  // Add or update glucose reading
  const handleAddReading = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const readingData = {
        reading_date: readingDate,
        slot,
        glucose_value: Number(glucoseValue),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response;

      if (editingReadingId !== null) {
        response = await api.put(
          `/readings/${editingReadingId}`,
          readingData,
          config
        );
      } else {
        response = await api.post(
          "/readings",
          readingData,
          config
        );
      }

      setMessage(response.data.message);

      setReadingDate("");
      setSlot("Morning fasting");
      setGlucoseValue("");
      setEditingReadingId(null);

      await fetchReadings();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to save reading. Please try again."
      );
    }
  };

  // Edit glucose reading
  const handleEditReading = (reading) => {
    setEditingReadingId(reading.id);
    setReadingDate(String(reading.reading_date).slice(0, 10));
    setSlot(reading.slot);
    setGlucoseValue(String(reading.glucose_value));
    setMessage("You are editing this reading.");
  };

  // Delete glucose reading
  const handleDeleteReading = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reading?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await api.delete(`/readings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);

      if (editingReadingId === id) {
        handleCancelEdit();
      }

      await fetchReadings();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete reading."
      );
    }
  };

  return {
    readingDate,
    setReadingDate,
    slot,
    setSlot,
    glucoseValue,
    setGlucoseValue,
    editingReadingId,
    setEditingReadingId,
    readings,
    setReadings,
    fetchReadings,
    handleAddReading,
    handleEditReading,
    handleDeleteReading,
    handleCancelEdit,
  };
}

export default useReadings;
