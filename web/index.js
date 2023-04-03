// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import sqlite3 from "sqlite3";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import themes from "./routes/themes.js";
import product from "./routes/product.js";
import collection from "./routes/collection.js";
import firstproducts from "./routes/firstproducts.js"
import query from "./routes/query.js"
import count from "./routes/count.js"
import accessories from "./routes/accessories.js"
import products from "./routes/products.js"

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
