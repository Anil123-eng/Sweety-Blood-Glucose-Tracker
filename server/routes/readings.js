
const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const allowedSlots = [
    "Morning fasting",
    "After breakfast",
    "After lunch",
    "After dinner"
];

// Add Glucose Reading
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { reading_date, slot, glucose_value } = req.body;

        if (!reading_date || !slot || glucose_value === undefined) {
            return res.status(400).json({
                message: "Please provide date, slot and glucose value"
            });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(reading_date)) {
            return res.status(400).json({
                message: "Date must be in YYYY-MM-DD format"
            });
        }

        const dateCheck = await pool.query(
            "SELECT $1::date <= CURRENT_DATE AS valid",
            [reading_date]
        );

        if (!dateCheck.rows[0].valid) {
            return res.status(400).json({
                message: "Future dates are not allowed"
            });
        }

        if (!allowedSlots.includes(slot)) {
            return res.status(400).json({
                message: "Invalid reading slot"
            });
        }

        const value = Number(glucose_value);

        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
                message: "Glucose value must be an integer between 40 and 600"
            });
        }

        const result = await pool.query(
            `INSERT INTO glucose_readings
             (user_id, reading_date, slot, glucose_value)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.user.id, reading_date, slot, value]
        );

        res.status(201).json({
            message: "Glucose reading added successfully",
            reading: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "A reading for this slot already exists on this date"
            });
        }

        console.log("Add reading error:", error.message);

        res.status(500).json({
            message: "Server error while adding reading"
        });
    }
});


// Get All Readings for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM glucose_readings
             WHERE user_id = $1
             ORDER BY reading_date DESC, created_at DESC`,
            [req.user.id]
        );

        res.status(200).json({
            message: "Readings fetched successfully",
            readings: result.rows
        });

    } catch (error) {
        console.log("Fetch readings error:", error.message);

        res.status(500).json({
            message: "Server error while fetching readings"
        });
    }
});


// Edit Glucose Reading
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { reading_date, slot, glucose_value } = req.body;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid reading ID"
            });
        }

        if (!reading_date || !slot || glucose_value === undefined) {
            return res.status(400).json({
                message: "Please provide date, slot and glucose value"
            });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(reading_date)) {
            return res.status(400).json({
                message: "Date must be in YYYY-MM-DD format"
            });
        }

        const dateCheck = await pool.query(
            "SELECT $1::date <= CURRENT_DATE AS valid",
            [reading_date]
        );

        if (!dateCheck.rows[0].valid) {
            return res.status(400).json({
                message: "Future dates are not allowed"
            });
        }

        if (!allowedSlots.includes(slot)) {
            return res.status(400).json({
                message: "Invalid reading slot"
            });
        }

        const value = Number(glucose_value);

        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
                message: "Glucose value must be an integer between 40 and 600"
            });
        }

        // Update only the logged-in user's reading
        const result = await pool.query(
            `UPDATE glucose_readings
             SET reading_date = $1,
                 slot = $2,
                 glucose_value = $3
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [reading_date, slot, value, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found"
            });
        }

        res.status(200).json({
            message: "Glucose reading updated successfully",
            reading: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "A reading for this slot already exists on this date"
            });
        }

        console.log("Update reading error:", error.message);

        res.status(500).json({
            message: "Server error while updating reading"
        });
    }
});

// Delete Glucose Reading
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid reading ID"
            });
        }

        const result = await pool.query(
            `DELETE FROM glucose_readings
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found"
            });
        }

        res.status(200).json({
            message: "Glucose reading deleted successfully"
        });

    } catch (error) {
        console.log("Delete reading error:", error.message);

        res.status(500).json({
            message: "Server error while deleting reading"
        });
    }
});


module.exports = router;
