const fs = require("fs");

const { ProductManager } = require("./productManager");
const productsPromise = async () => {
  const pManager = new ProductManager("products.json");
  const prod = await pManager.getProducts();
  return prod;
};

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
          cartAgregarPid.push(productCart.productId); // id de productos que existen
        }
      });

      const cartNoAgregarString = cartNoAgregar.toString();
      const cartAgregarStringPid = cartAgregarPid.toString();

      if (cartAgregar != 0) {
        const newCart = {
          id: carts.length + 1,
          products: cartAgregar,
        };
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        if (cartNoAgregar != 0) {
          return {
            status: `Se agregó el carrito ${newCart.id}. Con los productos: ${cartAgregarStringPid}. Los productos ${cartNoAgregarString} no se agregan porque NO existen en el catalogo`,
          };
        }
        return {
          status: `Se agregó el carrito ${newCart.id}. Con los productos: ${cartAgregarStringPid}`,
        };
      } else {
        return {
          status: `El carrito NO fue creado porque los productos: ${cartNoAgregarString} no existen en el catálogo`,
        };
      }
    } catch (e) {
      console.log("Error al agregar el carrito");
      return { Error: "Erro desconocido al agregar el carrito" };
    }
  }

  async addCartPid(cid, pid, products) {
    const cidNumber = parseInt(cid); // cid
    const pidNumber = parseInt(pid); // pid
    const productId = products.productId; // pid
    const quantity = products.quantity; // quantity
    const carts = await this.getCarts(); // Carritos existente

    try {
      if (!productId || !quantity) {
        return { Satatus: "Campos incompletos" };
      }

      const existCart = carts.find((cart) => cart.id === cidNumber); // Carrito
      //console.log(existCart)

      if (existCart === undefined) {
        console.log(`El carrrito con id: ${cidNumber} no existe`);
        return { Status: `El carrrito con id: ${cidNumber} no existe` };
      } else {
        const productsCart = existCart.products;
        //console.log(productsCart);
        //console.log(productId);
        
        productsCart.map(async(prod) => {
          if (prod.productId === productId) {
            console.log(`Existe el producto en el carrito, SUMO`);
            
            //console.log(carts)

            console.log(productsCart) // producto a editar
            console.log(prod) 
            const indiceProduto = productsCart.findIndex((indice)=> indice.productId == pid) //Indice del producto
            console.log(indiceProduto)
            //console.log(cidNumber) // carrito a editar
            //console.log(quantity)
            //console.log(prod.quantity)
            // prod[productIndex].title = title || prod[productIndex].title;
            let quantitySumado = quantity + prod.quantity
            //console.log(quantitySumado) // valor de quantity a editar
            //console.log(carts[cidNumber].products)

            console.log(carts[cidNumber].products[0])
            //carts[cidNumber].products[prod].quantity = quantitySumado
            //await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return true
          } 

        });
        return ("hola")

      }
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
