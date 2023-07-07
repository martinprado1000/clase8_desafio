const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    const ex = async () => {
      try {
        await fs.promises.access(this.path);
      } catch (e) {
        console.log("El archivo Products no existe");
        const arr = JSON.stringify([]);
        fs.promises.writeFile(path, arr);
        console.log("Archivo Products creado correctamente");
      }
    };
    ex();
  }

  async getProducts() {
    try {
      let products = await fs.promises.readFile(this.path, "utf-8");
      const productsObj = await JSON.parse(products);
      return productsObj;
    } catch (e) {
      console.log("Error al leer el archivo Products");
      return {"Status": "Error al leer el archivo Products"}
    }
  }

  async getProductById(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID valido")
        return {"Status": "Debe enviar un ID valido"};
      }
      const productos = await this.getProducts();
      const exist = productos.findIndex((ex)=>ex.id==id)
      if (exist === -1) return {"Status":`El producto con id: ${id} no existe`}
      const prodId = productos.find((p) => p.id == id);
      return prodId;
    } catch (e) {
      console.log("Error al leer el archivo");
      return {"Status": "Error al leer el archivo"}
    }
  }

  async deleteProduct(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID")
        return {"Error" : "Debe enviar un ID"}
      }
      const prod = await this.getProducts();
      const exist = prod.findIndex((ex)=>ex.id==id)
      if (exist === -1) {
        console.log(`El producto con id: ${id} no existe`)
        return ({ "Status" : `El producto con id: ${id} no existe` })
    }
      const prodDelete = prod.filter((p) => p.id != id);
      await fs.promises.writeFile(this.path,JSON.stringify(prodDelete, null, 2))
      console.log(`El producto con id: ${id} se elimino correctamente`)
      return { "Status" : `El producto con id: ${id} se elimino correctamente` }
    } catch (e) {
      console.log("Erro al eliminar el producto");
      return {"Status": "Error al eliminar el producto"}
    }
  }
    
  async addProduct({ title, description, price, thumbnail, code, stock, category }) {
    try { // thumbnail NO es un campo obligatorio
      if (!title || !description || !price || !code || !stock || !category ) {
        return {"Status": "Campos incompletos"}
      }
      const produ = await this.getProducts();
      const newProduct = {
        id: produ.length + 1,
        title,
        description,
        price,
        thumbnail : thumbnail || [],
        code,
        stock,
        category,
      };
      produ.push(newProduct);
      console.log(produ)
      await fs.promises.writeFile(this.path, JSON.stringify(produ, null, 2));
      return {"Status":"Producto agregado correctamente"}
    } catch (e) {
      console.log("Erro al agregar el producto");
      return {"Error": "Erro al agregar el producto"}
    }
  }

  async updateProduct(id,{title,description,price,thumbnail,code,stock,category}) {
    try {
      const pid = parseInt(id)
      const prod = await this.getProducts();
      const productIndex = prod.findIndex((product) => product.id === pid);
      if (productIndex === -1) {
        console.log(`El producto con id: ${id} no existe`)
        return {"Status": `El producto con id: ${id} no existe`}
      }
      prod[productIndex].title = title || prod[productIndex].title;
      prod[productIndex].description = description || prod[productIndex].description;
      prod[productIndex].price = price || prod[productIndex].price;
      prod[productIndex].thumbnail = thumbnail || prod[productIndex].thumbnail;
      prod[productIndex].code = code || prod[productIndex].code;
      prod[productIndex].stock = stock || prod[productIndex].stock;
      prod[productIndex].category = category || prod[productIndex].category;
      prod[productIndex].status = prod[productIndex].status;

      await fs.promises.writeFile(this.path, JSON.stringify(prod, null, 2));
      console.log(`El producto con id: ${pid} se edito correctamente`)
      return {"Status" : `El producto con id: ${pid} se edito correctamente`}
    } catch (e) {
      return {"Error": "Erro al editar el producto"}
    }
  }
}

module.exports = {
  ProductManager
  //manager
};