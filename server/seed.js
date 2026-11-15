
const pool = require("./db");
const bcrypt = require("bcrypt");

const userEmail = process.argv[2];
const userPassword = process.argv[3];

const seedData = async () => {
    try {
        if (!userEmail || !userPassword) {
            console.log("Usage: node seed.js demo@example.com DemoPassword123");
            return;
        }

        // Check whether the demo user already exists
        let userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [userEmail]
        );

        let userId;

        if (userResult.rows.length === 0) {
            const hashedPassword = await bcrypt.hash(userPassword, 10);

            userResult = await pool.query(
                `INSERT INTO users (name, email, password_hash)
                 VALUES ($1, $2, $3)
                 RETURNING id`,
                ["Demo User", userEmail, hashedPassword]
            );

            userId = userResult.rows[0].id;
            console.log("Demo user created successfully!");
        } else {
            userId = userResult.rows[0].id;
            console.log("Demo user already exists.");
        }

        // Sample glucose readings
        const readings = [
            { daysAgo: 0, slot: "Morning fasting", value: 110 },
            { daysAgo: 0, slot: "After breakfast", value: 145 },
            { daysAgo: 1, slot: "Morning fasting", value: 105 },
            { daysAgo: 2, slot: "After dinner", value: 130 }
        ];

        for (const reading of readings) {
            await pool.query(
                `INSERT INTO glucose_readings
                    (user_id, reading_date, slot, glucose_value)
                 VALUES ($1, CURRENT_DATE - $2::INTEGER, $3, $4)
                 ON CONFLICT (user_id, reading_date, slot)
                 DO NOTHING`,
                [userId, reading.daysAgo, reading.slot, reading.value]
            );
        }

        console.log("Sample glucose readings inserted successfully!");

    } catch (error) {
        console.error("Seed error:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

seedData();
