import { Router } from "express";
import shopify from "./shopify.js";

const router = Router();
  
  router.get("/:productId", async (req, res) => {
    
    try {
        console.log(req.params.productId);
        console.log("CHARLIE VEITCH")
        const productreturn = await shopify.api.rest.Product.find({
          session: res.locals.shopify.session,
          id: req.params.productId,
        });
    
        res.json(productreturn);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }


  });
  
  export default router;