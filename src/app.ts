import express from "express";
import { customers } from "./routes/customers";
import { orders } from "./routes/orders";
import { returns } from "./routes/returns";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use(customers);
  app.use(orders);
  app.use(returns);
  return app;
}
