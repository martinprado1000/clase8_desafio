const { Router } = require ("express")
const { ProductManager } = require("../productManager");

const router = Router();
//instacio el manager
const manager = new ProductManager("products.json");

//get Products
const products = async (req, res) => {
  try {
    const limitInt = parseInt(req.query.limit);
    //console.log(limitInt);
    const data = await manager.getProducts();
    if (!limitInt) res.send(data);
    else {
      const dataLimit = data.slice(0, limitInt);
      res.send(dataLimit);
    }
  } catch (e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//get ProductById
const productId = async (req, res) => {
  try{
    const pid = parseInt(req.params.pid);
    const data = await manager.getProductById(pid);
    res.send(data);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//post Product
const productAdd = async (req, res) => {
  try{
    const product = req.body;
    //console.log(product);
    const data = await manager.addProduct(product);
    console.log(data)
    res.send(data);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//put Product
const productPut = async (req, res) => {
  try{
    const pid = req.params.pid;
    const product = req.body;
    const data = await manager.updateProduct(pid,product);
    res.send(data);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//delete Product
const productDelete = async (req, res) => {
  try{
    const product = req.params.pid;
    const data = await manager.deleteProduct(product);
    console.log(data)
    res.send(data);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

router.get("/products", products);

router.get("/products/:pid", productId);

router.post("/products", productAdd);

router.put("/products/:pid", productPut);

router.delete("/products/:pid", productDelete);


module.exports = router ;
