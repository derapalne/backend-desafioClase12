class ProductosAPI {
  
  constructor() {
    this.productos = [];
  }

  static contadorId = 1;

  addProducto(producto) {
    if (this.check(producto)) {
      producto.id = ProductosAPI.contadorId++;
      this.productos.push(producto);
      return producto.id;
    } else {
      return { error: "El producto no cumple los requisitos" };
    }
  }

  getProductoById(id) {
    // Filtrá los productos que tengan id distitnto y retorná el único producto del array -> [0]
    let producto = this.productos.filter((prod) => prod.id == id)[0];
    if (producto != undefined) {
      return producto;
    } else {
      return { error: "Producto no encontrado" };
    }
  }

  getAll() {
    return this.productos;
  }

  setProductoById(id, producto) {
    if (this.check(producto)) {
      for (let i = 1; i < this.productos.length; i++) {
        if (this.productos[i].id == id) {
          producto.id = id;
          this.productos[i] = producto;
        }
      }
    } else {
      return { error: "El producto no cumple con los requisitos" };
    }
  }

  deleteProductoById(id) {
    this.productos = this.productos.filter((prod) => prod.id != id);
  }

  check(producto) {
    if (!producto.title) {
      console.log("error en  titulo")
      return false;
    }
    if (!producto.price) {
      console.log("error en precio")
      return false;
    } else {
      const price = Number(producto.price);
      if(isNaN(price)) {
        console.log("error en precio")
        return false;
      }
    }
    if (!producto.thumbnail) {
      console.log("error en thumbnail")
      return false;
    }
    return true;
  }
}

module.exports = ProductosAPI;