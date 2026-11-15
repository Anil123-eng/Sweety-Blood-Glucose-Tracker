
const pool = require("./db");

// Run: node seed.js your_registered_email@example.com
const userEmail = process.argv[2];

const seedReadings = async () => {
    try {
        if (!userEmail) {
            console.log("Please provide a registered user's email.");
            console.log("Example: node seed.js user@example.com");
            return;
        }

        // Find the registered user
        const userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [userEmail]
        );

        if (userResult.rows.length === 0) {
            console.log("User not found. Please check the email.");
            return;
        }

        const userId = userResult.rows[0].id;

        // Sample glucose readings
        const readings = [
            {
                daysAgo: 0,
                slot: "Morning fasting",
                value: 110
            },
            {
                daysAgo: 0,
                slot: "After breakfast",
                value: 145
            },
            {
                daysAgo: 1,
                slot: "Morning fasting",
                value: 105
            },
            {
                daysAgo: 2,
                slot: "After dinner",
                value: 130
            }
        ];

        for (const reading of readings) {
            await pool.query(
                `INSERT INTO glucose_readings
                    (user_id, reading_date, slot, glucose_value)
                 VALUES
                    ($1, CURRENT_DATE - $2::INTEGER, $3, $4)
                 ON CONFLICT (user_id, reading_date, slot)
                 DO NOTHING`,
                [
                    userId,
                    reading.daysAgo,
                    reading.slot,
                    reading.value
                ]
            );
        }

        console.log("Sample glucose readings inserted successfully!");

    } catch (error) {
        console.log("Seed error:", error.message);

    } finally {
        await pool.end();
    }
};

seedReadings();
