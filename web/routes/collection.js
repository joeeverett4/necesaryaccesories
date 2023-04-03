import { Router } from "express";
import shopify from "../shopify.js";

const router = Router();

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

router.post("/meta", async (req, res) => {
    const { items, id } = req.body;
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
})

export default router;
