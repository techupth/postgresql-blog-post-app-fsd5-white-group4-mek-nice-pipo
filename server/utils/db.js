import * as pg from "pg";
const { Pool } = pg.default;

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/posts",
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

export { pool };
