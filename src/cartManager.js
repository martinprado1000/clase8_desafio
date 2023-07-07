const fs = require("fs");


const { ProductManager } = require("./productManager");
//instacio el ProductManager
const productsPromise = async () => {
  const pManager = new ProductManager("products.json");
  const prod = await pManager.getProducts();
  //console.log(prod);
  return prod;
};
// let prod = products().then((d) => {
//   return d;
// });

class CartManager {
  constructor(path) {
    this.path = path;
    const ex = async () => {
      try {
        await fs.promises.access(this.path);
      } catch (e) {
        console.log("El archivo Carts no existe");
        const arr = JSON.stringify([]);
        fs.promises.writeFile(path, arr);
        console.log("Archivo Carts creado correctamente");
      }
    };
    ex();
  }

  async getCarts() {
    try {
      let carts = await fs.promises.readFile(this.path, "utf-8");
      const cartsObj = await JSON.parse(carts);
      return cartsObj;
    } catch (e) {
      console.log("Error al leer el archivo Carts");
      return { Error: "Error al leer el archivo Carts" };
    }
  }

  async getCartById(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID valido");
        return { Error: "Debe enviar un ID valido" };
      }
      const carts = await this.getCarts();
      const exist = carts.findIndex((ex) => ex.id == id);
      if (exist === -1) return { Error: `El carrrito con id: ${id} no existe` };
      const cartId = carts.find((p) => p.id == id);
      return cartId;
    } catch (e) {
      console.log("Error al leer el archivo carts");
      return { Error: "Error al leer el archivo carts" };
    }
  }

  async deleteCart(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID");
        return { Error: "Debe enviar un ID" };
      }
      const cart = await this.getCarts();
      //carts.findIndex((cart) => cart.code === code)
      const exist = cart.findIndex((ex) => ex.id == id);
      if (exist === -1) {
        console.log(`El carto con id: ${id} no existe`);
        return { Error: `El carto con id: ${id} no existe` };
      }
      const cartDelete = cart.filter((p) => p.id != id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(cartDelete, null, 2)
      );
      console.log(`El carto con id: ${id} se elimino correctamente`);
      return `El carto con id: ${id} se elimino correctamente`;
    } catch (e) {
      console.log("Erro al eliminar el carto");
      return { Error: "Error al eliminar el carto" };
    }
  }

  async addCart(data) {
      try {
      const cart = data.products
      const carts = await this.getCarts();
      console.log(carts)
      console.log(cart)
      console.log(carts.length +1 )
      const newCart = {
        id: carts.length + 1,
        products : cart
      };
      carts.push(newCart)
      console.log(cart)
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
      return ("Carrito cargado correctamente")
    } catch (e) {
      console.log("Error al agregar el carrito");
      return { Error: "Erro al agregar el carrito" };
    }
  }

  async addCartPid( cid, products ) {
    const productId = products.productId;
    const quantity = products.quantity;
    const cart = await this.getCarts();
    try {
      let cidNumber = parseInt(cid);
      let productIdNumber = parseInt(productId);
      console.log(cid);
      console.log(productId);
      console.log(quantity);
      if (!productId || !quantity) {
        return { Error: "Campos incompletos" };
      }

      const existCart = cart.find((ex) => ex.id === cidNumber);
      if (existCart == undefined)
        return { Error: `El carrrito con id: ${cidNumber} no existe` };

      let existProdId = existCart.products.findIndex(
        (prod) => prod.productId === productIdNumber
      );
      console.log(existProdId);
      //existCart.products.map((prod)=>{console.log(prod.productId)})

      // const exist = cart.findIndex((ex)=>ex.id==id)
      if (existProdId === -1) {
        console.log("El Producto no existe en el carrito, se agrega")
        console.log(cart)
        // const newCart = {
        //   id: cart.length + 1,
        //   products, 
        // };
        // console.log(newCart)
        // cart.push(newCart);
        // await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 2));
        // return "Carrito cargado correctamente";
        // carts.push(newCart);
        // await fs.promises.writeFile(this.path, JSON.stringify(newCart, null, 2));
        // return "Carrito cargado correctamente";
      } else {
        console.log("si existe");
      }

      return "chau";
      // // parseInt(p.productId) != prod.id
      // productsPromise().then((productsObj) => {
      //   //console.log(productsObj)
      //   const res = productsObj.map((productObj)=>{
      //    console.log(productObj.id)
      //     return products.findIndex ((product)=> productObj.id === parseInt(product.productId) )
      //     //productObj.id != products.productId

      //   })
      //   //console.log(res)
      //   for (let i=0; i<res.length ; i++) {
      //     console.log(res[i])
      //     if (res[i] == -1){
      //       console.log("producto inexistente")
      //       return ("producto inexistente")
      //     }
      //   }

      // });

      // const findProduct = prod.findIndex((p)=> p.productId == products.productId)
      // console.log(findProduct)

      // const cart = await this.getCarts();
      // const newCart = {
      //   id: cart.length + 1,
      //   name,
      //   products
      // };
      // cart.push(newCart);
      // await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 2));
      // return { Error: "Carrito cargado correctamente" };
    } catch (e) {
      console.log("Error al agregar el carrito");
      return { Error: "Erro al agregar el carrito" };
    }
  }

  async updateCart(
    id,
    { title, description, price, thumbnail, code, stock, category, status }
  ) {
    try {
      const pid = parseInt(id);
      //console.log(typeof(id2))
      const cart = await this.getCarts();
      const cartIndex = cart.findIndex((cart) => cart.id === pid);
      if (cartIndex === -1) {
        console.log(`El carto con id: ${id} no existe`);
        return { Error: `El carto con id: ${id} no existe` };
      }
      cart[cartIndex].title = title || cart[cartIndex].title;
      cart[cartIndex].description = description || cart[cartIndex].description;
      cart[cartIndex].price = price || cart[cartIndex].price;
      cart[cartIndex].thumbnail = thumbnail || cart[cartIndex].thumbnail;
      cart[cartIndex].code = code || cart[cartIndex].code;
      cart[cartIndex].stock = stock || cart[cartIndex].stock;
      cart[cartIndex].category = category || cart[cartIndex].category;
      cart[cartIndex].status = status || cart[cartIndex].status;

      await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 2));
      console.log(`El carto con id: ${pid} se edito correctamente`);
      return `El carto con id: ${pid} se edito correctamente`;
    } catch (e) {
      return { Error: "Erro al editar el carto" };
    }
  }
}

module.exports = {
  CartManager,
  //manager
};
