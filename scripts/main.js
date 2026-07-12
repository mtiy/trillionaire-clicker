let money = 1e12;
let spentMoney = 0;
const moneyDisplay = document.querySelector(".money-display");
const numberFormat1 = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
const moneyButton = document.querySelector(".money-button");
const messageLog = document.querySelector(".message-log");
const peopleDisplay = document.querySelector(".people-container");

const messages = [
    {condition: 0.01, text: "Spent a penny"},
    {condition: 0.05, text: "You have spent one nickel"},
    {condition: 0.10, text: "Now a dime"},
    {condition: 0.25, text: "A whole quarter"},
    {condition: 0.50, text: "Two quarters"},
    {condition: 0.75, text: "Three quarters!!"},
    {condition: 1.00, text: "Your first dollar"},
    {condition: 1.25, text: "Wow, this is getting kind of tiring, huh?"},
    {condition: 1.50, text: "Let's find someone to spend this for you"},
    {condition: 1.75, text: "This is Bob. He can spend money for you automatically."},
    {condition: 2.00, text: "He's not very fast though"},
    {condition: 2.25, text: "Luckily, we can clone him"},
    {condition: 4.22, text: "You've spent enough to buy 1 gallon of milk ($4.22 average)"},
    {condition: 100, text: "$100, wow!"},
    {condition: 203, text: "You've spent the average cost of a dental cleaning ($203)"},
    {condition: 250, text: "This is Alice. She helps Bob spend more."},
    {condition: 275, text: "Of course, we can clone her too"},
    {condition: 1013.20, text: "You've spent an average monthly grocery bill for a family of four ($1,013.20)"}
]

let people = [];
let hasBob = false;
let hasBobClone = false;
let hasAlice = false;
let hasAliceClone = false;

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
    document.querySelectorAll(".message").forEach((element) => {
        if(element.offsetTop > 450){
            element.remove();
        }
    })
}

function updateState(dt){
    if(!hasBob && Math.round(spentMoney*100)/100 >= 1.75){
        let bob = new Person(0.01, 1, "Bob", 1);
        people.push(bob);
        let p = document.createElement("div");
        p.textContent = `${bob.name}: Spending ${numberFormat1.format(bob.spendPower)} per second`;
        p.id = bob.name;
        peopleDisplay.append(p);
        hasBob = true;
    }

    if(!hasBobClone && Math.round(spentMoney*100)/100 >= 2.25){
        let cloneButton = document.createElement("button");
        cloneButton.textContent = "Clone";
        cloneButton.addEventListener("click", () => {
            people[0].amount++;
            document.getElementById("Bob").textContent = `${people[0].name}s: Spending ${numberFormat1.format(people[0].spendPower*people[0].amount)} per second`;
        });
        peopleDisplay.append(cloneButton);
        hasBobClone = true;
    }

    if(!hasAlice && Math.round(spentMoney*100)/100 >= 250){
        let alice = new Person(0, 1, "Alice", 1);
        people.push(alice);
        let p = document.createElement("div");
        p.textContent = `${alice.name}: Multiplying spending by ${alice.spendMultiplier}`;
        p.id = alice.name;
        p.classList.add("people");
        peopleDisplay.append(p);
        hasAlice = true;
    }

    if(!hasAliceClone && Math.round(spentMoney*100)/100 >= 275){
        let cloneButton = document.createElement("button");
        cloneButton.textContent = "Clone";
        cloneButton.addEventListener("click", () => {
            people[1].spendMultiplier += 0.01;
            document.getElementById("Alice").textContent = `${people[1].name}: Multiplying spending by ${people[1].spendMultiplier}`;
        });
        peopleDisplay.append(cloneButton);
        hasAliceClone = true;
    }

    let decreaseAmount = 0;
    for(i of people){
        decreaseAmount += i.spendPower * i.amount;
        decreaseAmount *= i.spendMultiplier;
    }
    decreaseMoney(decreaseAmount/1000 * dt);
}

class Person{
    constructor(spendPower, spendMultiplier, name, amount){
        this.spendPower = spendPower;
        this.spendMultiplier = spendMultiplier;
        this.name = name;
        this.amount = amount;
    }
}

moneyButton.addEventListener("click", () => {
    decreaseMoney(1);
});

let lastTime = null;
let timeStep = 25;
let accumulatedLag = 0;
setInterval(function gameLoop(){
    const currentTime = performance.now();
    if(lastTime === null){
        lastTime = performance.now();
    }
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    accumulatedLag += deltaTime;

    while(accumulatedLag >= timeStep){
        accumulatedLag -= timeStep;
        updateState(timeStep);
    }
},timeStep);

updateDisplay();