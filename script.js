let price = 19.5;
let cid = [
  ["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]
];
const cash = document.getElementById("cash");
const change = document.getElementById("change-due");
const purchase = document.getElementById("purchase-btn");

let currencyUnits = [
  ["PENNY", 0.01],
  ["NICKEL", 0.05],
  ["DIME", 0.1],
  ["QUARTER", 0.25],
  ["ONE", 1],
  ["FIVE", 5],
  ["TEN", 10],
  ["TWENTY", 20],
  ["ONE HUNDRED", 100]
];

const calculateTotalCid = (cid) => parseFloat(cid.reduce((sum, [_, amount]) => sum + amount, 0).toFixed(2));


const giveChange = (changeDue, cid) => {
  let totalCid = calculateTotalCid(cid);

  if (totalCid < changeDue) return { status: "INSUFFICIENT_FUNDS", change: [] };

  let changeArray = [];
  let remainingChange = changeDue;

  currencyUnits.slice().reverse().forEach(([currencyName, currencyValue], i) => {
    let valueAmountInDrawer = cid[currencyUnits.length - 1 - i][1];
    if (currencyValue <= remainingChange && valueAmountInDrawer > 0) {
      let amountFromUnit = 0;
      while (remainingChange >= currencyValue && valueAmountInDrawer > 0) {
        remainingChange = parseFloat((remainingChange - currencyValue).toFixed(2));
        valueAmountInDrawer -= currencyValue;
        amountFromUnit += currencyValue;
      }
      if (amountFromUnit > 0) changeArray.push([currencyName, amountFromUnit]);
    }
  });

  if (remainingChange > 0) return { status: "INSUFFICIENT_FUNDS", change: [] };
  
  if (changeDue === totalCid) {
    
    const closedChange = cid.filter(([_, amount]) => amount > 0).reverse();
    return { status: "CLOSED", change: closedChange };
  }

  return { status: "OPEN", change: changeArray };
};


const formatChange = (changeArray) =>
  changeArray.map(([name, value]) => `${name}: $${value.toFixed(2)}`).join(" ");

purchase.addEventListener("click", () => {
  const cashValue = parseFloat(cash.value);
  const changeDue = cashValue - price;

  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cashValue === price) {
    change.innerText = "No change due - customer paid with exact cash";
    return;
  }

  const changeResult = giveChange(changeDue, cid);
  const { status, change: changeArray } = changeResult;

  if (status === "INSUFFICIENT_FUNDS") {
    change.innerText = `Status: ${status}`;
  } else {
    const formattedChange = formatChange(status === "CLOSED" ? changeArray.filter(([_, amount]) => amount > 0) : changeArray);
    change.innerText = `Status: ${status} ${formattedChange}`;
  }
});
