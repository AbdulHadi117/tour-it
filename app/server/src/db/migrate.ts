import fs from "node:fs";
import path from "node:path";
import { pool } from "../config/db";

async function migrate() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  );

  const dir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const { rows } = await pool.query(`SELECT 1 FROM _migrations WHERE name = $1`, [file]);
    if (rows.length > 0) {
      console.log(`⏭  already applied: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(dir, file), "utf-8");
    console.log(`▶  applying: ${file}`);

    await pool.query("BEGIN");
    try {
      await pool.query(sql);
      await pool.query(`INSERT INTO _migrations (name) VALUES ($1)`, [file]);
      await pool.query("COMMIT");
      console.log(`✅ applied: ${file}`);
    } catch (err) {
      await pool.query("ROLLBACK");
      console.error(`❌ failed: ${file}`);
      throw err;
    }
  }

  console.log("Done.");
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
