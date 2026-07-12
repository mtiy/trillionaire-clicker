let money = 1e12;
let spentMoney = 0;
let player = {
    clickStrength: 0.01
}
const moneyDisplay = document.querySelector(".money-display");
const numberFormat1 = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
const moneyButton = document.querySelector(".money-button");
const messageLog = document.querySelector(".message-log");
const peopleDisplay = document.querySelector(".people-container");
const clickDisplay = document.querySelector(".click-upgrade-container");

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
    {condition: 115, text: "This is Alice. She helps Bob spend more."},
    {condition: 145, text: "Of course, we can clone her too"},
    {condition: 203, text: "You've spent the average cost of a dental cleaning ($203)"},
    {condition: 1013.20, text: "You've spent an average monthly grocery bill for a family of four ($1,013.20)"},
    {condition: 1100, text: "Your clicks sure aren't doing much, are they?"},
    {condition: 1413, text: "You have spent the median rent ($1,413)"},
    {condition: 1600, text: "Let's boost your click power a bit (also applies to cloning)"},
    {condition: 6715, text: "You've spent the average credit card debt ($6,715)"},
    {condition: 15000, text: "Autocloning technology now available"},
    {condition: 24695, text: "You've spent the starting MSRP of a 2026 Honda Civic ($24,695"},
    {condition: 39075, text: "You've spent the average federal student loan debt ($39,075)"},
    {condition: 83730, text: "You've spent the median household income ($83,730)"}
]

let people = [];
let hasBob = false;
let hasBobClone = false;
let hasAlice = false;
let hasAliceClone = false;
let unlockedClickBoost = false;

let activateButtons = {
    clickUpgrade: {
        removeUpgrade(){
            player.clickStrength /= 10;
        }
    }
}

let autocloneObject = {
    unlockedAutocloning: false,
    autocloneActivated: false,
    autocloneAmount: 0,
    autocloneMultiplier: 0
}

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
    });
    if(autocloneObject.autocloneActivated){
        document.getElementById("Bob").textContent = `${people[0].name}s: Spending ${numberFormat1.format(people[0].spendPower*people[0].amount)} per second`;
        document.getElementById("Alice").textContent = `${people[1].name}s: Multiplying spending by ${people[1].spendMultiplier.toFixed(2)}`;
    }
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
            people[0].amount += player.clickStrength*100;
            document.getElementById("Bob").textContent = `${people[0].name}s: Spending ${numberFormat1.format(people[0].spendPower*people[0].amount)} per second`;
        });
        peopleDisplay.append(cloneButton);
        hasBobClone = true;
    }

    if(!hasAlice && Math.round(spentMoney*100)/100 >= 115){
        let alice = new Person(0, 1, "Alice", 1);
        people.push(alice);
        let p = document.createElement("div");
        p.textContent = `${alice.name}: Multiplying spending by ${alice.spendMultiplier}`;
        p.id = alice.name;
        p.classList.add("people");
        peopleDisplay.append(p);
        hasAlice = true;
    }

    if(!hasAliceClone && Math.round(spentMoney*100)/100 >= 145){
        let cloneButton = document.createElement("button");
        cloneButton.textContent = "Clone";
        cloneButton.addEventListener("click", () => {
            people[1].spendMultiplier += player.clickStrength;
            document.getElementById("Alice").textContent = `${people[1].name}s: Multiplying spending by ${people[1].spendMultiplier.toFixed(2)}`;
        });
        peopleDisplay.append(cloneButton);
        hasAliceClone = true;
    }

    if(!unlockedClickBoost && Math.round(spentMoney*100)/100 >= 1600){
        let m = document.createElement("div");
        m.textContent = "Boost Click Strength";
        let b = document.createElement("button");
        b.textContent = "Activate";
        b.addEventListener("click", () => {
            player.clickStrength *= 10;
            b.disabled = true;
        });
        b.classList.add("activate-button");
        b.id = "clickUpgrade";
        m.append(b);
        clickDisplay.append(m);
        unlockedClickBoost = true;
    }

    if(!autocloneObject.unlockedAutocloning && Math.round(spentMoney*100)/100 >= 15000){
        let autoBob = document.createElement("div");
        autoBob.textContent = "Autoclone Bobs";
        let autoBobBtn = document.createElement("button");
        autoBobBtn.textContent = "Activate";
        autoBobBtn.addEventListener("click", () => {
            undoActivateEffects();
            autocloneObject.autocloneActivated = true;
            autocloneObject.autocloneAmount = 0.01;
            autoBobBtn.disabled = true;
        });
        autoBobBtn.classList.add("activate-button");
        autocloneObject.unlockedAutocloning = true;
        autoBob.append(autoBobBtn);
        clickDisplay.append(autoBob);
    }

    let decreaseAmount = 0;
    for(i of people){
        decreaseAmount += i.spendPower * i.amount;
        decreaseAmount *= i.spendMultiplier;
    }
    decreaseMoney(decreaseAmount/1000 * dt);
    if(autocloneObject.autocloneActivated){
        autoclone(autocloneObject)
    }
}

class Person{
    constructor(spendPower, spendMultiplier, name, amount){
        this.spendPower = spendPower;
        this.spendMultiplier = spendMultiplier;
        this.name = name;
        this.amount = amount;
    }
}

function undoActivateEffects(){
    const buttons = document.querySelectorAll(".activate-button");
    for(i of buttons){
        if(i.disabled){
            activateButtons[i.id].removeUpgrade();
            i.disabled = false;
        }
    }
}

function autoclone(ac){
    people[0].amount += ac.autocloneAmount*100;
    people[1].spendMultiplier += ac.autocloneMultiplier;
}

moneyButton.addEventListener("click", () => {
    decreaseMoney(player.clickStrength);
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