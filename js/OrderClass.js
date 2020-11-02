class Order {
  constructor(custName, items, comment) {
    this.name = custName;
    this.orders = items;
    // orders is an obj with {name: of the item, qty}
    if (comment) {
      this.comment = comment;
    } else {
      this.comment = null;
    }
  }

  print() {
    console.log(`Receipt for ${this.name}:`);
    for (let i = 0; i < this.orders.length; i++) {
      console.log(`${this.orders[i].qty} ${this.orders[i].name}`);
    }
    if (this.comment) {
      console.log(this.comment);
    }
  }
}

export { Order };
