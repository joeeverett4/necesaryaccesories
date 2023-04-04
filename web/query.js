import { Router } from "express";
import shopify from "./shopify.js";

const router = Router();

router.get("/:query", async (req, res) => {
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
