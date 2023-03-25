import express from "express";
import shopify from "../shopify.js";
import sqlite3 from "sqlite3";

const router = express.Router();

const db = new sqlite3.Database("database.sqlite");

router.get("/themes", async (req, res) => {
 
    const themes =  await shopify.api.rest.Theme.all({
       session: res.locals.shopify.session,
     });
     
     const sortedthemes = themes.sort((a, b) => {
       if (a.role === "main") return -1;
       if (b.role === "main") return 1;
       return 0;
     });
   
     res.send(sortedthemes);
   });

   router.get("/assets/:id", async (req, res) => {
 
    const id = req.params.id;
   const assets =  await shopify.api.rest.Asset.all({
      session: res.locals.shopify.session,
      theme_id: id,
    });
     
   console.log(typeof assets)
   
     res.send(assets);
   });

   router.get("/quieries/:query", async (req, res) => {
    try {
      const searchQuery = req.params.query;
      console.log(searchQuery);
  
      const client = new shopify.api.clients.Graphql({
        session: res.locals.shopify.session,
      });
      const data = await client.query({
        data: `query {
         products(first: 25, query: "title:${searchQuery}*") {
           edges {
             node {
              id
              title
              handle
              vendor
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                  }
                }
              }
              variants(first: 1) {
                nodes {
                  price
                }
              }
             }
           }
         }
       }`,
      });
      
      res.json(data.body.data.products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


router.get("/accessories/:id", async (req, res) => {
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
  })


router.get("/accessoriescount", (req, res) => {
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
  })




export default router;