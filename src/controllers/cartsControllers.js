const { CartManager } = require("../managers/cartManager");

//instacio el Cartmanager
const manager = new CartManager("db/carts.json");

//get Carts
const carts = async (req, res) => {
  try {
    const limitInt = parseInt(req.query.limit);
    //console.log(limitInt);
    const data = await manager.getCarts();
    if (!limitInt) res.json(data);
    else {
      const dataLimit = data.slice(0, limitInt);
      res.json(dataLimit);
    }
  } catch (e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//get ProductById
const cartId = async (req, res) => {
  try{
    const pid = parseInt(req.params.pid);
    const data = await manager.getCartById(pid);
    res.status(data.status).json(data.respuesta);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//post Product
const cartAdd = async (req, res) => {
  try{
    // console.log(products)
    const data = req.body;
    //console.log(data);
    const result = await manager.addCart(data);
    //console.log(data)
    //res.send(result);
    res.status(result.status).send(result.respuesta);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//post Product
const cartAddPid = async (req, res) => {
  try{
    const cid = req.params.cid;
    const pid = req.params.pid;
    const data = req.body;
    const result = await manager.addCartPid(cid,pid,data);
    //console.log(data)
    res.status(result.status).send(result.respuesta);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//put Product
const cartPut = async (req, res) => {
  try{
    const pid = req.params.pid;
    const cart = req.body;
    const data = await manager.updateCart(pid,cart);
    res.status(data.status).send(data.respuesta);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//delete Product
const cartDelete = async (req, res) => {
  try{
    const cart = req.params.pid;
    const data = await manager.deleteCart(cart);
    console.log(data)
    res.status(data.status).send(data.respuesta);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

module.exports = { carts, cartId, cartAdd, cartAddPid, cartDelete, cartPut }