process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let newItem = { name: "carrot", price: 3.0 };

beforeEach(function () {
  items.push(newItem);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const resp = await request(app).get("/items");
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ items: [{ name: "carrot", price: 3.0 }] });
  });
  test("Get a single item by name", async () => {
    const resp = await request(app).get("/items/carrot");
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ item: { name: "carrot", price: 3.0 } });
  });
  test("Getting item that doesn't exist", async () => {
    const resp = await request(app).get("/items/apple");
    expect(resp.status).toBe(404);
  });
});

describe("POST /items", () => {
  test("Create new item", async () => {
    const resp = await request(app)
      .post("/items")
      .send({ name: "banana", price: 1.0 });
    expect(resp.status).toBe(201);
    expect(items.length).toEqual(2);
  });
  test("Return 400 if missing name", async () => {
    const resp = await request(app).post("/items").send({ price: 1.0 });
    expect(resp.status).toBe(400);
    expect(items.length).toEqual(1);
  });
});

describe("PATCH /items/:name", () => {
  test("Updating existing item", async () => {
    const resp = await request(app)
      .patch(`/items/${newItem.name}`)
      .send({ name: "apple", price: 5.0 });
    expect(resp.body).toEqual({
      updated: { item: { name: "apple", price: 5.0 } },
    });
  });
  test("Updating an item that does not exist", async () => {
    const resp = await request(app)
      .patch("/items/bread")
      .send({ name: "apple", price: 5.0 });
    expect(resp.status).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Deleteing an item", async () => {
    const resp = await request(app).delete(`/items/${newItem.name}`);
    expect(resp.status).toBe(202);
    expect(items.length).toEqual(0);
  });
  test("Deleting an item that does not exist", async () => {
    const resp = await request(app).delete("/items/bread");
    expect(resp.status).toBe(404);
  });
});
