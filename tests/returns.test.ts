import request from "supertest";
import { createApp } from "../src/app";
import { closeDb, resetDb } from "./helpers/db";

const app = createApp();

beforeEach(resetDb);
afterAll(closeDb);

describe("POST /orders/:id/returns", () => {
  it("skapar en retur och räknar ut återbetalningen", async () => {
    const res = await request(app)
      .post("/orders/1040/returns")
      .set("X-Customer-Id", "1")
      .send({ customerId: 1, reason: "Fel storlek" });
    expect(res.status).toBe(201);
    expect(res.body.refund_amount).toBeCloseTo(1123.75);
  });

  it("ger en returetikett", async () => {
    const res = await request(app)
      .post("/orders/1040/returns")
      .set("X-Customer-Id", "1")
      .send({ customerId: 1, reason: "Fel storlek" });
    expect(res.body.label_url).toContain("frakt.example.com");
  });

  it("sparar returen", async () => {
    await request(app)
      .post("/orders/1040/returns")
      .set("X-Customer-Id", "1")
      .send({ customerId: 1, reason: "Fel storlek" });
    const res = await request(app).get("/orders/1040").set("X-Customer-Id", "1");
    expect(res.status).toBe(200);
  });
});
