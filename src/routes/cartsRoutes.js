const { Router } = require ("express")

const { carts, cartId, cartAdd, cartAddPid, cartDelete, cartPut } = require ("../controllers/cartsControllers")

const router = Router();

router.get("/carts", carts);

router.get("/carts/:pid", cartId);

router.post("/carts", cartAdd);

router.post("/carts/:cid/product/:pid", cartAddPid);

router.put("/carts/:pid", cartPut);

router.delete("/carts/:pid", cartDelete);


module.exports = router;
