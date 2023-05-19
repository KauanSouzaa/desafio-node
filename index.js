const express = require("express");
const uuid = require("uuid");
const port = 3000;
const app = express();
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
  const { id } = request.params;

  const index = orders.findIndex((purchaseOrder) => purchaseOrder.id === id);
  if (index < 0) {
    return response.status(404).json({ error: "order not found" });
  }
  request.orderIndex = index;
  request.orderId = id;

  next();
};

const checkUrl = (request, response, next) => {
  const method = request.method;
  const url = request.url;

  console.log(`Method used: ${method}, and Url used: ${url}`);

  next();
};

app.get("/orders", checkUrl, (request, response) => {
  return response.status(200).json(orders);
});

app.post("/orders", checkUrl, (request, response) => {
  const { order, clientName, price } = request.body;

  const purchaseOrder = {
    id: uuid.v4(),
    order,
    clientName,
    price,
    status: "Em preparação",
  };
  orders.push(purchaseOrder);

  return response.status(201).json(purchaseOrder);
});

app.put("/orders/:id", checkOrderId, checkUrl, (request, response) => {
  const id = request.orderId;
  const index = request.orderIndex;
  const {order, clientName, price} = request.body
  const status = orders[index].status

  const updateOrder = {id, order, clientName, price, status}
  orders[index] = updateOrder;

  return response.json(updateOrder);
});

app.delete("/orders/:id", checkOrderId, checkUrl, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1);

  return response.status(204).json();
});

app.get("/orders/:id", checkOrderId, checkUrl, (request, response) => {
  const index = request.orderIndex;
  const purchaseOrder = orders[index];

  return response.json(purchaseOrder);
});

app.patch("/orders/:id", checkOrderId, checkUrl, (request, response) => {
  const index = request.orderIndex;
  const purchaseOrder = orders[index];

  purchaseOrder.status = "Pedido Pronto!";

  return response.json(purchaseOrder);
});

app.listen(port, () => {
  console.log(`🚀 server started on port ${port}`);
});
