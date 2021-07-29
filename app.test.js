const { ExpectationFailed } = require("http-errors");
const request = require("supertest");

const app = require("./app");
const db = require("./fakeDb");

describe("GET /items", function () {
  it("Gets a list of items", async function () {
    const resp = await request(app).get("/items");

    expect(resp.body).toEqual(db.items);
  });
});

describe("GET /items/:name", function () {
  it("Gets a single item", async function () {
    const resp = await request(app).get("/items/popsicle");

    expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
  });
});

describe("POST /items", function () {
  it("Adds an item to list of items", async function () {
    const resp = await request(app).post("/items").send({
      name: "pudding",
      price: 3,
    });

    expect(resp.body).toEqual({ added: { name: "pudding", price: 3 } });
    expect(db.items.length).toEqual(3);
  });

  it("Adding an item that already exists should throw error", async function () {
    const resp = await request(app).post("/items").send({
      name: "popsicle",
      price: 3,
    });

    console.log(db.items);
    expect(resp.statusCode).toEqual(400);
    expect(db.items.length).toEqual(3);
  });
});
