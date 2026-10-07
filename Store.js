"use strict";

class Store {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  addProduct(name, price, qty) {
    const product = {
      id: this.nextId,
      name: name.trim(),
      price: Number(price),
      qty: Number(qty)
    };

    this.nextId += 1;
    this.products.push(product);
    return { ...product };
  }

  removeProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === Number(id));

    if (productIndex === -1) {
      return false;
    }

    this.products.splice(productIndex, 1);
    return true;
  }

  findProduct(id) {
    const product = this.products.find((item) => item.id === Number(id));
    return product ? { ...product } : undefined;
  }

  setQuantity(id, qty) {
    const product = this.products.find((item) => item.id === Number(id));
    const quantity = Number(qty);

    if (!product || !Number.isFinite(quantity) || quantity < 0) {
      return false;
    }

    product.qty = quantity;
    return true;
  }

  getProducts() {
    return this.products.map((product) => ({ ...product }));
  }

  getTotal() {
    return this.products.reduce((total, product) => total + product.price * product.qty, 0);
  }
}

window.Store = Store;
