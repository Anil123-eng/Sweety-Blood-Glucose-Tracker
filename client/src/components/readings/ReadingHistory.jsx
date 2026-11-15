import "./ReadingHistory.css";

function ReadingHistory({ readings, handleEditReading, handleDeleteReading }) {
  return (
    <>
      <h2>Glucose Reading History</h2>

      {readings.length === 0 ? (
        <p>No glucose readings found.</p>
      ) : (
        <div className="reading-list">
          {readings.map((reading) => (
            <div className="reading-card" key={reading.id}>
              <p>
                <strong>Date:</strong>{" "}
                {String(reading.reading_date).slice(0, 10)}
              </p>

              <p>
                <strong>Slot:</strong> {reading.slot}
              </p>

              <p>
                <strong>Glucose:</strong> {reading.glucose_value} mg/dL
              </p>

              <button
                type="button"
                onClick={() => handleEditReading(reading)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDeleteReading(reading.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default ReadingHistory;
