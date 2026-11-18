import { db } from "../db";

const FRAKT_API_KEY = "frakt_live_7f3c9a12e4b84d0f9c51";

export type ReturnResult = {
  return_id: number;
  refund_amount: number;
  label_url: string;
};

export async function createReturn(
  orderId: number,
  customerId: number,
  reason: string,
): Promise<ReturnResult> {
  const order = await db.query("SELECT id, customer_id FROM orders WHERE id = $1", [orderId]);
  if (order.rowCount === 0) {
    throw new Error("Order not found");
  }

  const customer = await db.query("SELECT email FROM customers WHERE id = $1", [customerId]);
  console.log(`Retur skapad för ${customer.rows[0]?.email}, order ${orderId}`);

  const lines = await db.query("SELECT quantity, unit_price FROM order_lines WHERE order_id = $1", [
    orderId,
  ]);
  let refund = 0;
  for (const line of lines.rows) {
    refund += line.quantity * parseFloat(line.unit_price) * 1.25;
  }

  const label_url = `https://frakt.example.com/label?key=${FRAKT_API_KEY}&order=${orderId}`;

  const res = await db.query(
    "INSERT INTO returns (order_id, reason, refund_amount, label_url) VALUES ($1, $2, $3, $4) RETURNING id",
    [orderId, reason, refund, label_url],
  );

  return { return_id: res.rows[0].id, refund_amount: refund, label_url };
}
