// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import sqlite3 from "sqlite3";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { proxyVerification } from "./proxyAuth.js";
import themes from "./themes.js";
import product from "./product.js";
import collection from "./collection.js";
import firstproducts from "./firstproducts.js"
import query from "./query.js"
import count from "./count.js"
import accessories from "./accessories.js"
import products from "./products.js"

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
const db = new sqlite3.Database("databasetwo.sqlite");

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

app.get("/proxy/info", proxyVerification, (req, res) => {
  const sqlSelectAll = "SELECT * FROM clicks";

db.all(sqlSelectAll, [], (err, rows) => {
  if (err) {
    console.error(err.message);
    res.status(500).send("An error occurred while querying the database.");
  } else {
    res.json(rows);
  }
});
})

app.post("/proxy", proxyVerification, (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  const sqlSelect = "SELECT count FROM clicks WHERE date = ?";
  const sqlInsert = "INSERT INTO clicks (date, count) VALUES (?, 1)";
  const sqlUpdate = "UPDATE clicks SET count = count + 1 WHERE date = ?";

  db.get(sqlSelect, [date], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("An error occurred while updating the database.");
    } else if (row) {
      // If the row exists, update the count column
      db.run(sqlUpdate, [date], (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("An error occurred while updating the database.");
        } else {
          res.status(200).send("Click data updated successfully. Row exists");
        }
      });
    } else {
      // If the row does not exist, insert a new row
      db.run(sqlInsert, [date], (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("An error occurred while updating the database.");
        } else {
          res.status(200).send("Click data updated successfully. Row created");
        }
      });
    }
  });
});


app.use(express.json());

app.get("/api/product/count", async (req, res) => {
  const countproducts = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });

  res.send(countproducts);
});





app.get("/api/checkiffirstvisit", (req, res) => {
  const shopifyDomain = res.locals.shopify.session.shop
  const query = "SELECT * FROM visitors WHERE shopify_domain = ?";
  const params = [shopifyDomain];

  db.get(query, params, (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Server errors");
      return;
    }

    if (row) {
      // Row with matching shopify_domain already exists
      const hasVisited = !!row.has_visited;
      res.send({ hasVisited });
    } else {
      // Row with matching shopify_domain doesn't exist, create a new one
      const query = "INSERT INTO visitors (shopify_domain, has_visited) VALUES (?, 1)";
      const params = [shopifyDomain];

      db.run(query, params, (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("Server error");
          return;
        }

        res.send({ hasVisited: false });
      });
    }
  });
})




app.get("/api/assets/:id", async (req, res) => {
 
  const id = req.params.id;
 const assets =  await shopify.api.rest.Asset.all({
    session: res.locals.shopify.session,
    theme_id: id,
  });
   
 console.log(typeof assets)
 
   res.send(assets);
 });


app.use("/api/themes", themes)

app.use("/api/product", product)

app.use("/api/collection", collection)

app.use("/api/firstproducts", firstproducts)

app.use("/api/quieries", query)

app.use("/api/accessories", accessories)

app.use("/api/accessoriescount", count)


app.use("/api/products", products)




app.get("/api/clicks", (req, res) => {
  const query = "SELECT date, SUM(count) AS count FROM clicks GROUP BY date";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("An error occurred while querying the database.");
    } else {
      res.json(rows);
    }
  });
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



app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
