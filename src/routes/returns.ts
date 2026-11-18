import { Router } from "express";
import { requireCustomer } from "../auth";
import { createReturn } from "../services/returnService";

export const returns = Router();

// Skapa en retur för en beställning. Hela beställningen returneras.
returns.post("/orders/:id/returns", requireCustomer, async (req, res) => {
  try {
    const result = await createReturn(
      Number(req.params.id),
      Number(req.body.customerId),
      req.body.reason,
    );
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ message: (e as Error).message });
  }
});
