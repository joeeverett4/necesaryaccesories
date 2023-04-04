import { Router } from "express";
import shopify from "./shopify.js";

const router = Router();
  
  router.get("/", async (req, res) => {
    
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
  
  export default router;