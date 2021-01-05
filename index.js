import R from "ramda";

const cars = [
  {
    name: "Aston Martin One-77",
    horsepower: 750,
    dollarValue: 1850000,
    inStock: true,
  },
  {
    name: "Aston Martin One-100",
    horsepower: 800,
    dollarValue: 1900000,
    inStock: false,
  },
  {
    name: "Aston Martin One-110",
    horsepower: 770,
    dollarValue: 1700000,
    inStock: false,
  },
];

// Last In Stock
const isLastInStock = R.compose(R.prop("inStock"), R.last)(cars);

// Dollar Average
const averageDollarValue = R.compose(
  R.converge(R.divide, [R.sum, R.length]),
  R.pluck("dollarValue")
)(cars);

// Fastest Car
const fastestCar = R.concat(
  R.compose(R.prop("name"), R.last, R.sortBy(R.prop("horsepower")))(cars),
  " is the fastest"
);

// accounts' total payout
const data = [{ acc_1: 1 }, { acc_1: 2 }, { acc_2: 3 }];

const totalPayout = R.compose(
  R.values,
  R.map(R.reduce(R.mergeWith(R.add), 0)),
  R.groupBy(R.keys)
)(data);
