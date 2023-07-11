const { Router } = require ("express")
const { products, productId, productAdd, productPut, productDelete } = require ("../controllers/productsControllers")

const router = Router();

router.get("/products", products);

router.get("/products/:pid", productId);

router.post("/products", productAdd);

router.put("/products/:pid", productPut);

router.delete("/products/:pid", productDelete);


module.exports = router ;
