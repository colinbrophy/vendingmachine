beforeEach(() => {
  jest.resetModules();
});

const badCoin = {
  massInGrams: 5,
  widthInCm: 10,
};

test("The vending machine rejects coins of invalid weight and size", () => {
  const v = require("./vendingmachine");

  const success = v.insertCoin(badCoin);
  expect(success).toBeFalsy();
});

const nickel = {
  massInGrams: 5.02,
  widthInCm: 2.001,
};

test("The vending machine accepts nickels", () => {
  const v = require("./vendingmachine");

  const success = v.insertCoin(nickel);
  expect(success).toBeTruthy();
});

const dime = {
  massInGrams: 10.02,
  widthInCm: 10.031,
};

test("The vending machine accepts dimes", () => {
  const v = require("./vendingmachine");

  const success = v.insertCoin(dime);
  expect(success).toBeTruthy();
});

const quarter = {
  massInGrams: 20.02,
  widthInCm: 20.011,
};

test("The vending machine accepts quarters", () => {
  const v = require("./vendingmachine");

  const success = v.insertCoin(quarter);
  expect(success).toBeTruthy();
});

test("The vending machine dispences product when enough money is inserted", () => {
  const v = require("./vendingmachine");

  let spy = jest.spyOn(console, "log").mockImplementation();

  v.insertCoin(quarter);
  v.insertCoin(quarter);

  v.requestProduct("Chips");
  expect(v.currentInCents).toBe(0);
  expect(console.log).toHaveBeenCalledWith("THANK YOU");

  spy.mockRestore()
});

test("The vending machine doesn't dispence product when not enough money is inserted", () => {
  const v = require("./vendingmachine");

  let spy = jest.spyOn(console, "log").mockImplementation();

  v.insertCoin(nickel);
  v.insertCoin(quarter);

  v.requestProduct("Cola");

  expect(console.log).toHaveBeenCalledWith("PRICE: 100 cents");
  expect(v.currentInCents).toBe(30);

  spy.mockRestore()
});

test("The vending machine returns the correct amount of change", () => {
  const v = require("./vendingmachine");

  let spy = jest.spyOn(console, "log").mockImplementation();

  v.insertCoin(nickel);
  v.insertCoin(quarter);
  v.insertCoin(quarter);
  v.insertCoin(quarter);

  let change = v.requestProduct("Candy");

  expect(v.currentInCents).toBe(0);
  expect(change).toBe(15);

  expect(console.log).toHaveBeenCalledWith("THANK YOU");
  spy.mockRestore()
});

test("The vending machine returns change when asked", () => {
  const v = require("./vendingmachine");

  v.insertCoin(nickel);
  v.insertCoin(quarter);
  v.insertCoin(quarter);

  let change = v.returnChange();

  expect(change).toBe(55);
  expect(v.currentInCents).toBe(0);
});

test("The vending machine will not dispence item that is sold out", () => {
  const v = require("./vendingmachine");
  let spy = jest.spyOn(console, "log").mockImplementation();

  
  v.insertCoin(quarter);
  v.insertCoin(quarter);
  v.insertCoin(quarter);

  v.requestProduct("Candy");

  v.insertCoin(quarter);
  v.insertCoin(quarter);
  v.insertCoin(quarter);

  v.requestProduct("Candy");

  expect(console.log).toHaveBeenCalledWith("SOLD OUT");

  spy.mockRestore()
});

test("The vending machine will display exact change only if it is not able to make change", () => {
  const v = require("./vendingmachine");
  let spy = jest.spyOn(console, "log").mockImplementation();

  v.requestProduct("Candy");
  
  expect(console.log).toHaveBeenCalledWith("EXACT CHANGE ONLY");

  spy.mockRestore()
});
