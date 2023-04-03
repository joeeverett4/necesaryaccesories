import { Router } from "express";
import shopify from "../shopify.js";

const router = Router();
  
  router.get("/", async (req, res) => {
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
  
  export default router;