// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import sqlite3 from "sqlite3";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
const db = new sqlite3.Database("database.sqlite");

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/product/count", async (req, res) => {
  const countproducts = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });

  res.send(countproducts);
});

app.get("/api/accessoriescount", (req, res) => {
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

app.get("/api/themes", async (req, res) => {
 
 const themes =  await shopify.api.rest.Theme.all({
    session: res.locals.shopify.session,
  });
  


  res.send(themes);
});

app.get("/api/assets/:id", async (req, res) => {
 
  const id = req.params.id;
 const assets =  await shopify.api.rest.Asset.all({
    session: res.locals.shopify.session,
    theme_id: id,
  });
   
 console.log(typeof assets)
 
   res.send(assets);
 });



// Parent product
app.get("/api/product/:productId", async (req, res) => {
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

//parent collection

app.get("/api/collection/:collectionId", async (req, res) => {
  try {
    console.log(req.params.collectionId);
    const collectionreturn = await shopify.api.rest.Collection.find({
      session: res.locals.shopify.session,
      id: req.params.collectionId,
    });

    res.json(collectionreturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// get first products

app.get("/api/firstproducts", async (req, res) => {
  try {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const data = await client.query({
      data: `query {
     products(first: 25, sortKey:TITLE) {
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
         
         cursor
       }
       pageInfo {
         hasNextPage
         endCursor
       }
     }
   }`,
    });

    res.json(data.body.data.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get a page of products
app.get("/api/products/:cursor", async (req, res) => {
  try {
    const cursor = req.params.cursor;

    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });
    console.log(cursor);
    const data = await client.query({
      data: `query {
    products(first: 25, after: "${cursor}", sortKey: TITLE) {
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
        
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }`,
    });

    

    res.json(data.body.data.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/accessories/:id", async (req, res) => {
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


app.get("/api/quieries/:query", async (req, res) => {
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

app.get("/api/collections", async (req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const data = await client.query({
    data: `query {
    collections(first: 100) {
      edges {
        node {
          id
          title
          handle
          image{url}
          productsCount
          ruleSet{
            rules{
                column
                relation
                condition
            }
          }
        }
      }
    }
  }`,
  });
  
  res.json(data.body.data.collections);
});

app.post("/api/products/meta", async (_req, res) => {
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

app.post("/api/products/remove", async (_req, res) => {
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

app.post("/api/collection/meta", async (_req, res) => {
  const { items, id } = _req.body;
  let result = [];

  for (let i = 0; i < items.length; i++) {
    result.push(items[i]);
  }
  console.log(result);
  const metafield = new shopify.api.rest.Metafield({
    session: res.locals.shopify.session,
  });
  metafield.collection_id = id;
  metafield.namespace = "my_fields";
  metafield.key = "sponsor";
  metafield.type = "list.product_reference";
  metafield.value = JSON.stringify(result);
  await metafield.save({
    update: true,
  });

  res.status(200).send(metafield);
});

/*
app.delete("/api/products/meta/:id", async (req, res) => {
  const { id } = req.params;
  await shopify.api.rest.Metafield.delete({
    session: res.locals.shopify.session,
    blog_id: 382285388,
    id: 534526895,
  });
})

*/

app.get("/api/products/db/:id", (req, res) => {
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

app.post("/api/products/db", async (_req, res) => {
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

app.delete("/api/products/db/:id", (req, res) => {
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

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
