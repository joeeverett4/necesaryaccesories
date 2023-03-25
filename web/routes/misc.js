import express from "express";
import shopify from "./shopify.js";

const router = express.Router();

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

   router.get("/api/assets/:id", async (req, res) => {
 
    const id = req.params.id;
   const assets =  await shopify.api.rest.Asset.all({
      session: res.locals.shopify.session,
      theme_id: id,
    });
     
   console.log(typeof assets)
   
     res.send(assets);
   });

   router.get("/api/quieries/:query", async (req, res) => {
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

export default router;