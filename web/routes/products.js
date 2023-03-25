// productEndpoints.js

import express from "express";
import shopify from "./shopify.js";
import nextpageQuery from "../graphql/nextpagequery.js";

const router = express.Router();

// Get product by ID
router.get("/:productId", async (req, res) => {
  try {
    console.log(req.params.productId);
    const productreturn = await shopify.api.rest.Product.find({
      session: res.locals.shopify.session,
      id: req.params.productId,
    });

    res.json(productreturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get a page of products
router.get("/:cursor", async (req, res) => {
    try {
      const cursor = req.params.cursor;
  
      const client = new shopify.api.clients.Graphql({
        session: res.locals.shopify.session,
      });
      console.log(cursor);
      const data = await client.query({
        data: nextpageQuery,
      });
  
      
  
      res.json(data.body.data.products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/meta", async (_req, res) => {
    const { items, id } = _req.body;
    let result = [];
  
    for (let i = 0; i < items.length; i++) {
      result.push(items[i]);
    }
    console.log(result);
    const metafield = new shopify.api.rest.Metafield({
      session: res.locals.shopify.session,
    });
    metafield.product_id = id;
    metafield.namespace = "my_fields";
    metafield.key = "sponsor";
    metafield.type = "list.product_reference";
    metafield.value = JSON.stringify(result);
    await metafield.save({
      update: true,
    });
  
    res.status(200).send(metafield);
  });

  app.post("/remove", async (_req, res) => {
    const { id } = _req.body;
    let result = [];
  
    
    console.log(result);
    const metafield = new shopify.api.rest.Metafield({
      session: res.locals.shopify.session,
    });
    metafield.product_id = id;
    metafield.namespace = "my_fields";
    metafield.key = "sponsor";
    metafield.type = "list.product_reference";
    metafield.value = JSON.stringify(result);
    await metafield.save({
      update: true,
    });
  
    res.status(200).send(metafield);
  });

  router.get("/db/:id", (req, res) => {
    const product = req.params.id;
    console.log("this is id" + product)
    // run the SELECT statement with the specified city value
    db.all(
      "SELECT * FROM productmain WHERE product_id = ? ORDER BY sequence ASC",
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

  router.post("/db", async (_req, res) => {
    const shop = res.locals.shopify.session.shop;
    const { title, product_id, image, description, sequence } = _req.body; // extract values from request body
  
    db.run(
      "INSERT INTO productmain (title, product_id, image, description, sequence, shop) VALUES (?, ?, ?, ?, ?, ?)",
      [title, product_id, image, description, sequence, shop],
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
  
        res.status(200).send("OK");
      }
    );
  });

  router.delete("/db/:id", (req, res) => {
    const { id } = req.params;
   
    const sql = `DELETE FROM productmain WHERE product_id = ?`;
    db.run(sql, [id], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error deleting data" });
      } else {
        res.json({ message: `Rows with ID '${id}' deleted successfully` });
      }
    });
  });


// Add more endpoints related to products

export default router;