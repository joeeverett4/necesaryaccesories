// productEndpoints.js

import express from "express";
import collectionsQuery from "../graphql/collectionsQuery.js";
import shopify from "./shopify.js";

const router = express.Router();




router.get("/api/collections", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });
    const data = await client.query({
      data: collectionsQuery,
    });
    
    res.json(data.body.data.collections);
  });

  router.get("/:collectionId", async (req, res) => {
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


router.post("/api/collection/meta", async (_req, res) => {
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

// Add more endpoints related to products

export default router;