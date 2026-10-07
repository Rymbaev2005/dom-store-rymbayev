"use strict";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2
});

let store;
let productForm;
let productsList;
let totalElement;
let productCountElement;
let emptyState;
let nameInput;
let priceInput;
let qtyInput;

function init() {
  store = new Store();
  store.addProduct("Laptop", 350000, 1);
  store.addProduct("Keyboard", 25000, 2);
  store.addProduct("Mouse", 10000, 3);

  productForm = document.querySelector("#productForm");
  productsList = document.querySelector("#productsList");
  totalElement = document.querySelector("#total");
  productCountElement = document.querySelector("#productCount");
  emptyState = document.querySelector("#emptyState");
  nameInput = document.querySelector("#name");
  priceInput = document.querySelector("#price");
  qtyInput = document.querySelector("#qty");

  productForm.addEventListener("submit", handleSubmit);
  productsList.addEventListener("click", handleProductAction);

  renderProducts();
  updateTotal();
}

function renderProducts() {
  const products = store.getProducts();
  productsList.replaceChildren();
  emptyState.hidden = products.length > 0;

  products.forEach((product) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const priceCell = document.createElement("td");
    const quantityCell = document.createElement("td");
    const actionsCell = document.createElement("td");
    const quantityControl = document.createElement("div");
    const decreaseButton = createActionButton("-", "decrease", product.id, "quantity-button");
    const quantityValue = document.createElement("span");
    const increaseButton = createActionButton("+", "increase", product.id, "quantity-button");
    const deleteButton = createActionButton("Delete", "delete", product.id, "delete-button");

    row.dataset.id = String(product.id);
    nameCell.className = "product-name";
    nameCell.textContent = product.name;
    priceCell.className = "price-cell";
    priceCell.textContent = `${currencyFormatter.format(product.price)} ₸`;
    quantityControl.className = "quantity-control";
    quantityValue.className = "quantity-value";
    quantityValue.textContent = String(product.qty);
    decreaseButton.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    decreaseButton.disabled = product.qty <= 0;
    increaseButton.setAttribute("aria-label", `Increase ${product.name} quantity`);
    deleteButton.setAttribute("aria-label", `Delete ${product.name}`);

    quantityControl.append(decreaseButton, quantityValue, increaseButton);
    quantityCell.append(quantityControl);
    actionsCell.append(deleteButton);
    row.append(nameCell, priceCell, quantityCell, actionsCell);
    productsList.append(row);
  });

  productCountElement.textContent = `${products.length} ${products.length === 1 ? "product" : "products"}`;
}

function createActionButton(label, action, id, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.dataset.action = action;
  button.dataset.id = String(id);
  button.textContent = label;
  return button;
}

function updateTotal() {
  totalElement.textContent = `Total: ${currencyFormatter.format(store.getTotal())} ₸`;
}

function handleSubmit(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const priceValue = priceInput.value.trim();
  const qtyValue = qtyInput.value.trim();
  const price = Number(priceValue);
  const qty = Number(qtyValue);
  let isValid = true;

  setFieldError(nameInput, "nameError", name ? "" : "Name is required");
  setFieldError(
    priceInput,
    "priceError",
    priceValue !== "" && Number.isFinite(price) && price > 0 ? "" : "Price must be greater than 0"
  );
  setFieldError(
    qtyInput,
    "qtyError",
    qtyValue !== "" && Number.isFinite(qty) && qty >= 0 ? "" : "Quantity must be a valid number"
  );

  isValid =
    name !== "" &&
    priceValue !== "" &&
    Number.isFinite(price) &&
    price > 0 &&
    qtyValue !== "" &&
    Number.isFinite(qty) &&
    qty >= 0;

  if (!isValid) {
    return;
  }

  store.addProduct(name, price, qty);
  productForm.reset();
  clearFormErrors();
  renderProducts();
  updateTotal();
  nameInput.focus();
}

function setFieldError(input, errorId, message) {
  document.querySelector(`#${errorId}`).textContent = message;

  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

function clearFormErrors() {
  setFieldError(nameInput, "nameError", "");
  setFieldError(priceInput, "priceError", "");
  setFieldError(qtyInput, "qtyError", "");
}

function handleProductAction(event) {
  const button = event.target.closest("button[data-action]");

  if (!button || !productsList.contains(button)) {
    return;
  }

  const id = Number(button.dataset.id);
  const product = store.findProduct(id);

  if (!product) {
    return;
  }

  switch (button.dataset.action) {
    case "delete":
      store.removeProduct(id);
      break;
    case "increase":
      store.setQuantity(id, product.qty + 1);
      break;
    case "decrease":
      store.setQuantity(id, Math.max(0, product.qty - 1));
      break;
    default:
      return;
  }

  renderProducts();
  updateTotal();
}

document.addEventListener("DOMContentLoaded", init);
