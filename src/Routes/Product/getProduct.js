import { Router } from "express";
import products from "../../data/products.js";

const router = Router();

router.get("/allproducts", (req, res) => {
  res.status(201).send(products);
});

export default router;
