import { Router } from "express";
import shopify from "./shopify.js";
import sqlite3 from "sqlite3";

const router = Router();

const db = new sqlite3.Database("databasetwo.sqlite");
  
  router.get("/", async (req, res) => {
      console.log("HELLOOOO")

      console.log("Connected to database:", db.filename);
     
    const query = `
    WITH unique_values AS (
      SELECT DISTINCT product_id
      FROM productmain
    )
    SELECT
      COUNT(CASE WHEN LENGTH(printf('%d', product_id)) = 12 THEN 1 END) as collection_count,
      COUNT(CASE WHEN LENGTH(printf('%d', product_id)) = 13 THEN 1 END) as product_count
    FROM unique_values
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('An error occurred while querying the database.');
    } else {
      res.json({
        product_count: rows[0].product_count,
        collection_count: rows[0].collection_count,
      });
    }
  });
  
 
  });
  
  export default router;