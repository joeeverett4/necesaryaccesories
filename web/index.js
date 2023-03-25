// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import sqlite3 from "sqlite3";
import shopify from "./shopify.js";
import collections from "./routes/collections.js"
import products from "./routes/products.js"
import misc from "./routes/misc.js"
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


app.use(express.json());

app.use("/api/products", shopify.validateAuthenticatedSession(), products);

app.use("/api/collections", shopify.validateAuthenticatedSession(), collections);

app.use("/api", shopify.validateAuthenticatedSession(), misc);



app.get("/api/test/firstproducts", async (req, res) => {
  try {
      console.log("HELOO")
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


app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
