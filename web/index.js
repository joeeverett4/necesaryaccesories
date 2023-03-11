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
const db = new sqlite3.Database('database.sqlite');

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

app.get('/api/product/count', async (req, res) => {
 const countproducts =  await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });

  res.send(countproducts)

})

// Endpoint to get a page of products
app.get('/api/product/:productId', async (req, res) => {
  try {
    console.log(req.params.productId)
    const productreturn = await shopify.api.rest.Product.find({
      session: res.locals.shopify.session,
      id: req.params.productId,
    });
    console.log(productreturn)
    res.json(productreturn)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get a page of products
app.get('/api/products/:cursor', async (req, res) => {
  try {
   const cursor = req.params.cursor
   console.log(cursor)
    const client = new shopify.api.clients.Graphql({session: res.locals.shopify.session});
const data = await client.query({
  data: `query {
    products(first: 50, after: "${cursor}") {
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

console.log(data.body.data.products.pageInfo.endCursor)

   res.json(data.body.data.products)
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products/meta", async (_req, res) => {
  const { items, id } = _req.body;
  let result = [];
  console.log(res.locals.shopify.session)

for (let i = 0; i < items.length; i++) {
  result.push(items[i]);
}
  console.log(result)
  const metafield = new shopify.api.rest.Metafield({session: res.locals.shopify.session});
  metafield.product_id = id;
  metafield.namespace = "my_fields";
  metafield.key = "sponsor";
  metafield.type = "list.product_reference";
  metafield.value = JSON.stringify(result);
  await metafield.save({
    update: true,
  });
  console.log(metafield)
  res.status(200).send(metafield)
  });

  app.get('/api/products/db/:id', (req, res) => {
    
    const product = req.params.id;
    
     // run the SELECT statement with the specified city value
    db.all('SELECT * FROM productmain WHERE product_id = ?', [product], (err, rows) => {
      if (err) {
        // handle error
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        // send the rows back as the response
        res.json(rows);
      }
    });
  
  });

  app.post("/api/products/db", async (_req, res) => {
   const shop = res.locals.shopify.session.shop
   const { title, product_id, image, description, sequence } = _req.body; // extract values from request body
   
  
   
   
 db.run('INSERT INTO productmain (title, product_id, image, description, sequence, shop) VALUES (?, ?, ?, ?, ?, ?)', [title, product_id, image, description, sequence, shop], (err) => {
         if (err) {
           console.error(err);
           res.status(500).send('Internal Server Error');
           return;
         }
       
         res.status(200).send('OK');
       });
    
  
  }) 

  app.delete('/api/products/db/:id', (req, res) => {
    const { id } = req.params;
  
    const sql = `DELETE FROM productmain WHERE product_id = ?`;
    db.run(sql, [id], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error deleting data' });
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
