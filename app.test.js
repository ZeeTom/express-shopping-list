"use strict"
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

    expect(resp.statusCode).toEqual(400);
    expect(db.items.length).toEqual(3);
  });

  it("Try to add with an empty request", async function() {
    const resp = await request(app).post("/items").send({
      name: "",
      price: "",
    });
    expect(resp.statusCode).toEqual(400);
    expect(db.items.length).toEqual(3);
  })
});

describe("PATCH /items/:name", function() {
  it("Updates an item using new input", async function () {
    const resp = await request(app).patch("/items/popsicle").send({
      name: "bread",
      price: 5,
    });

    expect(resp.body).toEqual({ updated: { name: "bread", price: 5 } });
  });

  it("Fails to update if item not found", async function () {
    const resp = await request(app).patch("/items/popsicle").send({
      name: "bread",
      price: 5,
    });

    expect(resp.statusCode).toEqual(404);
  })
})

describe("DELETE /items/:name", function() {
  it("Deletes an item from list", async function () {
    await request(app).delete("/items/cheerios");

    expect(db.items.length).toEqual(2);
  })

  it("Fails to delete item if not found", async function () {
    let resp = await request (app).delete("/items/cheerios");

    expect(resp.statusCode).toEqual(404);
  })
})