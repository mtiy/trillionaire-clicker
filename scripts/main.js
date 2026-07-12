let money = 1e12;
let spentMoney = 0;
const moneyDisplay = document.querySelector(".money-display");
const numberFormat1 = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
const moneyButton = document.querySelector(".money-button");
const messageLog = document.querySelector(".message-log");

const messages = [
    {condition: 0.05, text: "You have one nickel"},
    {condition: 0.10, text: "You have a dime!"},
    {condition: 0.25, text: "A whole quarter!"},
    {condition: 1.00, text: "Your first dollar"},
    {condition: 3.78, text: "You've spent enough to buy 1 gallon of gasoline (3.78 average)"}
]

function decreaseMoney(amount){
    money -= amount;
    spentMoney += amount;
    updateDisplay();
}

function updateDisplay(){
    moneyDisplay.textContent = numberFormat1.format(money);
    if(Math.round(spentMoney*100)/100 >= messages[0].condition){
        let m = document.createElement("div");
        m.textContent = messages[0].text;
        m.classList.add("message");
        messages.shift();
        messageLog.prepend(m);
    }
}

moneyButton.addEventListener("click", () => {
    decreaseMoney(0.01);
});



updateDisplay();

