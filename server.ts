import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Connect to Supabase using the provided connection string.
// We fallback to the user's provided direct connection string if DATABASE_URL is not explicitly set in the environment.
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:PVavjRmNicc5EKFU@db.ywhdwnddzkglztigxhcw.supabase.co:5432/postgres";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      car VARCHAR(255) NOT NULL,
      service VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      time VARCHAR(50) NOT NULL,
      notes TEXT,
      status VARCHAR(50) DEFAULT 'Pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  const createAdminsTableQuery = `
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    
    // Add status column if it doesn't exist (for backward compatibility with the previously created table)
    await pool.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';
    `);
    
    console.log("Database table 'bookings' initialized successfully.");

    await pool.query(createAdminsTableQuery);
    
    // Seed default admin
    await pool.query(`
      INSERT INTO admins (username, password)
      VALUES ('admin', 'admin123')
      ON CONFLICT (username) DO NOTHING;
    `);
    console.log("Database table 'admins' initialized successfully.");
  } catch (error) {
    console.error("Error initializing database tables:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize the database table
  await initializeDatabase();

  // API Route to handle booking submissions
  app.post("/api/bookings", async (req, res) => {
    const { name, phone, email, car, service, date, time, notes } = req.body;

    if (!name || !phone || !email || !car || !service || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const insertQuery = `
        INSERT INTO bookings (name, phone, email, car, service, date, time, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const values = [name, phone, email, car, service, date, time, notes];
      const result = await pool.query(insertQuery, values);
      res.status(201).json({ message: "Booking confirmed!", booking: result.rows[0] });
    } catch (error) {
      console.error("Error inserting booking:", error);
      res.status(500).json({ error: "Failed to process booking" });
    }
  });

  // API Route to fetch bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const selectQuery = `
        SELECT * FROM bookings
        ORDER BY created_at DESC;
      `;
      const result = await pool.query(selectQuery);
      res.status(200).json({ bookings: result.rows });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // API Route to update booking status
  app.patch("/api/bookings/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    try {
      const updateQuery = `
        UPDATE bookings 
        SET status = $1 
        WHERE id = $2 
        RETURNING *;
      `;
      const result = await pool.query(updateQuery, [status, id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      res.status(200).json({ message: "Status updated successfully", booking: result.rows[0] });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route for Admin Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      const result = await pool.query(
        "SELECT * FROM admins WHERE username = $1 AND password = $2",
        [username, password]
      );

      if (result.rows.length > 0) {
        res.status(200).json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, error: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
