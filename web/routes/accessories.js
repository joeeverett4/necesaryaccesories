import { Router } from "express";
import shopify from "../shopify.js";
import sqlite3 from "sqlite3";

const router = Router();

const db = new sqlite3.Database("/Users/joeeverett/desktop/neccesaryaccesories/neccesaryaccesories/web/databasetwo.sqlite");

router.get("/:id", async (req, res) => {
    const product = req.params.id;
    console.log("this is id" + product)
    // run the SELECT statement with the specified city value
    db.all(
      "SELECT image FROM productmain WHERE product_id = ? ORDER BY sequence ASC",
      [product],
      (err, rows) => {
        if (err) {
          // handle error
          console.error(err.message);
          res.status(500).send("Internal server error");
        } else {
          // send the rows back as the response
          res.json(rows);
        }
      }
    );
});

export default router;
