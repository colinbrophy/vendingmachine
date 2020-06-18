exports.currentInCents = 0;

function withinPercentRange(value, { expectedValue, percentRange }) {
  let lowerBound = expectedValue - expectedValue * percentRange * 0.01;
  let upperBound = expectedValue + expectedValue * percentRange * 0.01;
  return lowerBound <= value && value <= upperBound;
}

function makesEnoughChange() {
  let enoughForAny = coins.nickel.noAvailable >= 1;
  let enoughForCandy =
    coins.dime.noAvailable >= 1 || coins.nickel.noAvailable >= 2;

  return enoughForAny && enoughForCandy;
}

function displayCurrent() {
  if (exports.currentInCents > 0) console.log(`${exports.currentInCents}`);
  else if (makesEnoughChange()) console.log("INSERT COINS");
  else console.log("EXACT CHANGE ONLY");
}

const coins = {
  nickel: {
    noAvailable: 1,
    massInGrams: {
      expectedValue: 5,
      percentRange: 5,
    },
    widthInCm: {
      expectedValue: 2,
      percentRange: 5,
    },
    value: 5,
  },
  dime: {
    noAvailable: 0,
    massInGrams: {
      expectedValue: 10,
      percentRange: 8,
    },
    widthInCm: {
      expectedValue: 10,
      percentRange: 5,
    },
    value: 10,
  },
  quarter: {
    noAvailable: 0,
    massInGrams: {
      expectedValue: 20,
      percentRange: 8,
    },
    widthInCm: {
      expectedValue: 20,
      percentRange: 2,
    },
    value: 25,
  },
};

exports.insertCoin = (coinMeasurements) => {
  const coin = Object.entries(coins).find(
    ([_, candidateCoin]) =>
      withinPercentRange(
        coinMeasurements.massInGrams,
        candidateCoin.massInGrams
      ) &&
      withinPercentRange(coinMeasurements.widthInCm, candidateCoin.widthInCm)
  );

  let foundCoin = typeof coin !== "undefined";

  if (foundCoin) {
    let [key, value] = coin;
    coins[key].noAvailable++;
    exports.currentInCents += value.value;
  }

  displayCurrent();
  return foundCoin;
};

const products = {
  Cola: {
    price: 100,
    stock: 10,
  },
  Chips: {
    price: 50,
    stock: 10,
  },
  Candy: {
    price: 65,
    stock: 1,
  },
};

exports.requestProduct = (product) => {
  let change = 0;
  if (products[product].stock == 0) console.log("SOLD OUT");
  else if (products[product].price <= exports.currentInCents) {
    change = exports.currentInCents - products[product].price;
    exports.currentInCents = 0;
    products[product].stock--;
    console.log("THANK YOU");
  } else console.log(`PRICE: ${products[product].price} cents`);

  displayCurrent();

  return change;
};

function extractCoins(coinType) {
  const coin = coins[coinType];

  while (coin.noAvailable > 0 && exports.currentInCents >= coin.value) {
    exports.currentInCents -= coin.value;
    coin.noAvailable--;
  }
}

exports.returnChange = () => {
  let change = exports.currentInCents;

  extractCoins('quarter')
  extractCoins('dime')
  extractCoins('nickel')

  return change;
};
