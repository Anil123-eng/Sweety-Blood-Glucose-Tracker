
function Reports({
  dailyReportDate,
  setDailyReportDate,
  fetchReport,
  reportMessage,
  reportData,
  reportType,
}) {
  return (
    <>
      <h2>Glucose Reports</h2>

      <input
        type="date"
        value={dailyReportDate}
        onChange={(e) => setDailyReportDate(e.target.value)}
      />

      <button
        type="button"
        onClick={() => fetchReport("daily")}
      >
        Daily Report
      </button>

      <button
        type="button"
        onClick={() => fetchReport("monthly")}
      >
        Monthly Report
      </button>

      <button
        type="button"
        onClick={() => fetchReport("previous-month")}
      >
        Previous Month Report
      </button>

      {reportMessage && (
        <p className="message">{reportMessage}</p>
      )}

      {reportData && (
        <div className="reading-card">
          <h3>
            {reportType === "daily"
              ? "Daily Report"
              : reportType === "monthly"
              ? "Month-to-Date Report"
              : "Previous Month Report"}
          </h3>

          {reportType === "daily" && (
            <p>
              <strong>Date:</strong> {reportData.date}
            </p>
          )}

          <p>
            <strong>Total Readings:</strong>{" "}
            {reportData.summary.total_readings}
          </p>

          <p>
            <strong>Highest:</strong>{" "}
            {reportData.summary.highest ?? "N/A"} mg/dL
          </p>

          <p>
            <strong>Lowest:</strong>{" "}
            {reportData.summary.lowest ?? "N/A"} mg/dL
          </p>

          <p>
            <strong>Average:</strong>{" "}
            {reportData.summary.average ?? "N/A"} mg/dL
          </p>

          {reportType === "daily" && (
            <>
              <h3>Daily Readings</h3>

              {reportData.readings.length === 0 ? (
                <p>No readings found for this date.</p>
              ) : (
                reportData.readings.map((reading) => (
                  <p key={reading.id}>
                    {reading.slot}: {reading.glucose_value} mg/dL
                  </p>
                ))
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Reports;