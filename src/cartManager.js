const fs = require("fs");

const { ProductManager } = require("./productManager");
//const { exit } = require("process");
//instacio el ProductManager
const productsPromise = async () => {
  const pManager = new ProductManager("products.json");
  const prod = await pManager.getProducts();
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
      return { Status: "Error al leer el archivo Carts" };
    }
  }

  async getCartById(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID valido");
        return { Status: "Debe enviar un ID valido" };
      }
      const carts = await this.getCarts();
      const exist = carts.findIndex((ex) => ex.id == id);
      if (exist === -1)
        return { Status: `El carrrito con id: ${id} no existe` };
      const cartId = carts.find((p) => p.id == id);
      return cartId;
    } catch (e) {
      console.log("Error al leer el archivo carts");
      return { Status: "Error al leer el archivo carts" };
    }
  }

  async deleteCart(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID");
        return { Status: "Debe enviar un ID" };
      }
      const cart = await this.getCarts();
      //carts.findIndex((cart) => cart.code === code)
      const exist = cart.findIndex((ex) => ex.id == id);
      if (exist === -1) {
        console.log(`El carrito con id: ${id} no existe`);
        return { Status: `El carrito con id: ${id} no existe` };
      }
      const cartDelete = cart.filter((p) => p.id != id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(cartDelete, null, 2)
      );
      console.log(`El carrito con id: ${id} se elimino correctamente`);
      return { Status: `El carrito con id: ${id} se elimino correctamente` };
    } catch (e) {
      console.log("Erro al eliminar el carrito");
      return { Status: "Error al eliminar el carrito" };
    }
  }

  async addCart(data) {
    //const productId = data.productId;
    //const quantity = data.quantity;
    //console.log(productId)
    //console.log(quantity)
    const cart = data.products; // Carrito a agregar
    try {
      const carts = await this.getCarts(); // Carrito existente
      const cartAgregar = [];
      const cartNoAgregar = [];
      const cartAgregarPid = [];
      const productos = await productsPromise(); //productos

      if (!cart) {
        return { Status: "Debe enviar productos para agregar el carrito" };
      }

      cart.map((productCart) => {
        const exist = productos.findIndex(
          (producto) => producto.id === productCart.productId
        );
        if (exist === -1) {
          cartNoAgregar.push(productCart.productId); // productos que NO existen
        } else {
          cartAgregar.push(productCart); // productos que existen
          cartAgregarPid.push(productCart.productId);
        }
      });

      console.log(cartAgregarPid)
      //const cartAgregarString = cartAgregar.toString();
      //const cartAgregarString = cartAgregar.findIndex((i)=>1==1);
      //console.log(cartAgregar)
      //console.log(cartNoAgregar)
      const cartNoAgregarString = cartNoAgregar.toString();
      const cartAgregarStringPid = cartAgregarPid.toString();
      //console.log(`Los productos ${cartNoAgregarString} no se agregan al carrito porque NO existen en el catalogo`)

      if (cartAgregar != 0) {
        const newCart = {
          id: carts.length + 1,
          products: cartAgregar,
        };
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        if (cartNoAgregar != 0) {
          return { "status" : `Se agregó el carrito ${newCart.id}. Productos agregados: ${cartAgregarStringPid}. Los productos ${cartNoAgregarString} no se agregan porque NO existen en el catalogo`}          
        } 
        return { "status" : `Se agregó el carrito ${newCart.id}. Productos agregados: ${cartAgregarStringPid}`}
      }
      else {
        return { "status" : `El carrito NO fue creado porque los productos ${cartNoAgregarString} no existen en el catalogo` }
      }
    } catch (e) {
      console.log("Error al agregar el carrito");
      return { Status: "Erro al agregar el carrito" };
    }
  }

  async addCartPid(cid, products) {
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
        return { Satatus: "Campos incompletos" };
      }

      const existCart = cart.find((ex) => ex.id === cidNumber);
      if (existCart == undefined)
        return { Status: `El carrrito con id: ${cidNumber} no existe` };

      let existProdId = existCart.products.findIndex(
        (prod) => prod.productId === productIdNumber
      );
      console.log(existProdId);
      //existCart.products.map((prod)=>{console.log(prod.productId)})

      // const exist = cart.findIndex((ex)=>ex.id==id)
      if (existProdId === -1) {
        console.log("El Producto no existe en el carrito, se agrega");
        console.log(cart);
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
        console.log(`El carrito con id: ${id} no existe`);
        return { Status: `El carrito con id: ${id} no existe` };
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
      console.log(`El carrito con id: ${pid} se edito correctamente`);
      return { Status: `El carrito con id: ${pid} se edito correctamente` };
    } catch (e) {
      return { Status: "Erro al editar el carrito" };
    }
  }
}

module.exports = {
  CartManager,
  //manager
};
