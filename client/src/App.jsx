
import { useState } from "react";
 
import "./App.css";

import LoginRegister from "./components/auth/LoginRegister";
import GlucoseForm from "./components/readings/GlucoseForm";
import ReadingHistory from "./components/readings/ReadingHistory";
import Reports from "./components/reports/Reports";

import useAuth from "./hooks/useAuth";
import useReadings from "./hooks/useReadings";
import useReports from "./hooks/useReports";

function App() {
  const [message, setMessage] = useState("");

  // Authentication
  const {
    isLoggedIn,
    setIsLoggedIn,
    showLogin,
    setShowLogin,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  } = useAuth(setMessage);

  // Glucose readings
  const {
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
    handleAddReading,
    handleEditReading,
    handleDeleteReading,
    handleCancelEdit,
  } = useReadings(isLoggedIn, setMessage);

  // Reports
  
const {
  reportType,
  dailyReportDate,
  setDailyReportDate,
  reportData,
  reportMessage,
  fetchReport,
  setReportType,
  setReportData,
  setReportMessage,
} = useReports();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setShowLogin(true);

    setReadingDate("");
    setSlot("Morning fasting");
    setGlucoseValue("");
    setEditingReadingId(null);
    setReadings([]);

    setReportType("");
    setDailyReportDate("");
    setReportData(null);
    setReportMessage("");

    setMessage("");
    setPassword("");
  };

  // Dashboard
  if (isLoggedIn) {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      <div className="app">
        <div className="auth-container">
          <h1>Sweety</h1>
          <p className="subtitle">Blood Glucose Tracker</p>

          <h2>Welcome, {user.name}!</h2>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>

          <GlucoseForm
            readingDate={readingDate}
            setReadingDate={setReadingDate}
            slot={slot}
            setSlot={setSlot}
            glucoseValue={glucoseValue}
            setGlucoseValue={setGlucoseValue}
            editingReadingId={editingReadingId}
            handleAddReading={handleAddReading}
            handleCancelEdit={handleCancelEdit}
          />

          {message && <p className="message">{message}</p>}

          <Reports
            dailyReportDate={dailyReportDate}
            setDailyReportDate={setDailyReportDate}
            fetchReport={fetchReport}
            reportMessage={reportMessage}
            reportData={reportData}
            reportType={reportType}
          />

          <ReadingHistory
            readings={readings}
            handleEditReading={handleEditReading}
            handleDeleteReading={handleDeleteReading}
          />
        </div>
      </div>
    );
  }

  // Login and registration
  return (
    <LoginRegister
      showLogin={showLogin}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      message={message}
      onToggle={() => {
        setShowLogin(!showLogin);
        setMessage("");
      }}
    />
  );
}

export default App;
