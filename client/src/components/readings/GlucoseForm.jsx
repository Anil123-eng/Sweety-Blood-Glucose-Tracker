import "./GlucoseForm.css";

function GlucoseForm({
  readingDate,
  setReadingDate,
  slot,
  setSlot,
  glucoseValue,
  setGlucoseValue,
  editingReadingId,
  handleAddReading,
  handleCancelEdit,
}) {
  return (
    <>
      <h2>
        {editingReadingId !== null
          ? "Edit Glucose Reading"
          : "Add Glucose Reading"}
      </h2>

      <form onSubmit={handleAddReading}>
        <input
          type="date"
          value={readingDate}
          onChange={(e) => setReadingDate(e.target.value)}
          required
        />

        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          required
        >
          <option value="Morning fasting">Morning fasting</option>
          <option value="After breakfast">After breakfast</option>
          <option value="After lunch">After lunch</option>
          <option value="After dinner">After dinner</option>
        </select>

        <input
          type="number"
          placeholder="Enter glucose value (40-600)"
          value={glucoseValue}
          onChange={(e) => setGlucoseValue(e.target.value)}
          min="40"
          max="600"
          step="1"
          required
        />

        <div className="form-buttons">
          <button type="submit">
            {editingReadingId !== null
              ? "Update Reading"
              : "Add Reading"}
          </button>

          {editingReadingId !== null && (
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default GlucoseForm;
