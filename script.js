let price = 3.26;
let cid = [
  ["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]
];
const cash = document.getElementById("cash");
const change = document.getElementById("change-due");
const purchase = document.getElementById("purchase-btn");


let currencyUnits=[
  ['PENNY', .01],
  ['NICKEL', .05],
  ['DIME', .1],
  ['QUARTER', .25],
  ['ONE', 1],
  ['FIVE', 5],
  ['TEN', 10],
  ['TWENTY', 20],
  ['ONE HUNDRED', 100]
]


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

  const changeResult = getChange(changeDue,cid)
  if (changeResult.status === "CLOSED") {
    const filteredChange = changeResult.change.filter(([_, amount]) => amount > 0); 
    change.innerText = `Status: ${changeResult.status} ${formatChange(filteredChange)}`; 
  } else if (changeResult.status === "INSUFFICIENT_FUNDS") {
    change.innerText = `Status: ${changeResult.status}`;
  } else {
    change.innerText = `Status: OPEN ${formatChange(changeResult.change)}`;
  }
});

const getChange = (changeDue, cid) => {
  let totalCid = parseFloat(cid.reduce((sum, [_, amount]) => sum + amount, 0).toFixed(2));

  if (totalCid < changeDue) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  let changeArray = [];
  let remainingChange = changeDue;

  for (let i = currencyUnits.length - 1; i >= 0; i--) {
    let unit = currencyUnits[i][0];
    let unitValue = currencyUnits[i][1];
    let unitInDrawer = cid[i][1];
        // console.log(unit,unitValue,unitInDrawer)

    if (unitValue <= remainingChange && unitInDrawer > 0) {
      let amountFromUnit = 0;

      while (remainingChange >= unitValue && unitInDrawer > 0) {
        remainingChange = (remainingChange - unitValue).toFixed(2);
        unitInDrawer -= unitValue;
        amountFromUnit += unitValue;
        // console.log(remainingChange,unitInDrawer,amountFromUnit)
      }

      if (amountFromUnit > 0) {
        changeArray.push([unit, amountFromUnit]);
        // console.log(changeArray)
      }
    } // end of IF
  } // end of for
  remainingChange = parseFloat(remainingChange);

  if(remainingChange > 0){
    return { status: "INSUFFICIENT_FUNDS", change: [] } //// modifica aici
  }
  if(changeDue === totalCid){
    return { status: "CLOSED", change: cid }
  }
  return { status: "OPEN", change: changeArray }
} // end of change

const formatChange = (changeArray) =>
  changeArray.map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join(" ");
// console.log(formatChange([["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));

// console.log(getChange(.74,cid))
