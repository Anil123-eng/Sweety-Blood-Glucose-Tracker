const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Daily Glucose Report
router.get("/daily", authMiddleware, async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Please provide a date"
            });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                message: "Date must be in YYYY-MM-DD format"
            });
        }

        const result = await pool.query(
            `SELECT
                COUNT(*) AS total_readings,
                MAX(glucose_value) AS highest,
                MIN(glucose_value) AS lowest,
                ROUND(AVG(glucose_value), 1) AS average
             FROM glucose_readings
             WHERE user_id = $1 AND reading_date = $2`,
            [req.user.id, date]
        );

        const readings = await pool.query(
            `SELECT id, reading_date, slot, glucose_value
             FROM glucose_readings
             WHERE user_id = $1 AND reading_date = $2
             ORDER BY created_at ASC`,
            [req.user.id, date]
        );

        res.status(200).json({
            message: "Daily report fetched successfully",
            date,
            summary: result.rows[0],
            readings: readings.rows
        });

    } catch (error) {
        console.log("Daily report error:", error.message);

        res.status(500).json({
            message: "Server error while fetching daily report"
        });
    }
});

// Month-to-Date Glucose Report
router.get("/monthly", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                COUNT(*) AS total_readings,
                MAX(glucose_value) AS highest,
                MIN(glucose_value) AS lowest,
                ROUND(AVG(glucose_value), 1) AS average
             FROM glucose_readings
             WHERE user_id = $1
             AND reading_date >= DATE_TRUNC('month', CURRENT_DATE)
             AND reading_date <= CURRENT_DATE`,
            [req.user.id]
        );

        res.status(200).json({
            message: "Monthly report fetched successfully",
            summary: result.rows[0]
        });

    } catch (error) {
        console.log("Monthly report error:", error.message);

        res.status(500).json({
            message: "Server error while fetching monthly report"
        });
    }
});

// Previous Month Glucose Report
router.get("/previous-month", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                COUNT(*) AS total_readings,
                MAX(glucose_value) AS highest,
                MIN(glucose_value) AS lowest,
                ROUND(AVG(glucose_value), 1) AS average
             FROM glucose_readings
             WHERE user_id = $1
             AND reading_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
             AND reading_date < DATE_TRUNC('month', CURRENT_DATE)`,
            [req.user.id]
        );

        res.status(200).json({
            message: "Previous month report fetched successfully",
            summary: result.rows[0]
        });

    } catch (error) {
        console.log("Previous month report error:", error.message);

        res.status(500).json({
            message: "Server error while fetching previous month report"
        });
    }
});

module.exports = router;