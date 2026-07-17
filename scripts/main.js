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
    {condition: 24695, text: "You've spent the price of a new Honda Civic ($24,695)"},
    {condition: 39075, text: "You've spent the average federal student loan debt ($39,075)"},
    {condition: 83730, text: "You've spent the median household income ($83,730)"}
]

class Person{
    constructor(value, name, amount, cost, cloneCost){
        this.value = value;
        this.name = name;
        this.amount = amount;
        this.cost = cost;
        this.cloneCost = cloneCost;
    }

    createElement(text){
        let p = document.createElement("div");
        p.textContent = text;
        p.id = this.name;
        p.classList.add("people");
        return p;
    }

    createCloneButton(createText, buttonText){
        let cb = document.createElement("button");
        cb.textContent = buttonText;
        cb.addEventListener("click", () => {
            this.amount += player.clickStrength*100;
            createText();
        });
        return cb;
    }
}

let people = {
    bob: new Person(0.01, "Bob", 0, 1.75, 2.25),
    alice: new Person(0.01, "Alice", 0, 115, 145),
    intern: new Person(0.01, "Interns", 0, 0.01, null)
}

let hasBob = false;
let hasBobClone = false;
let hasAlice = false;
let hasAliceClone = false;
let unlockedClickBoost = false;
let hasInterns = false;

let activateButtons = {
    clickUpgrade: {
        removeUpgrade(){
            player.clickStrength /= 10;
        },
        cost: 1600
    },
    autoclone: {
        removeUpgrade(){
            autocloneObject.bobAmount = 0;
            autocloneObject.aliceAmount = 0;
            autocloneObject.internAmount = 0;
            autocloneActivated = false;
        },
        cost: 15000
    }
}

let autocloneObject = {
    unlockedAutocloning: false,
    autocloneActivated: false,
    amount: 1,
    bobAmount: 0,
    aliceAmount: 0,
    internAmount: 0
}

function decreaseMoney(amount){
    money -= amount;
    spentMoney += amount;
    updateDisplay();
}

function updateDisplay(){
    moneyDisplay.textContent = numberFormat1.format(money);
    if(messages.length > 0 && round(spentMoney) >= messages[0].condition){
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
        document.getElementById(people.bob.name).textContent = `${people.bob.name}s: Spending ${numberFormat1.format(people.bob.value*people.bob.amount)} per second`;
        document.getElementById(people.alice.name).textContent = `${people.alice.name}s: Multiplying spending by ${(1+people.alice.value*people.alice.amount).toFixed(2)}`;
        document.getElementById(people.intern.name).textContent = `${people.intern.name}: Multiply autocloning by ${(1+people.intern.amount*people.intern.value).toFixed(2)}`;
    }
}

function updateState(dt){
    if(!hasBob && round(spentMoney) >= people.bob.cost){
        people.bob.amount++;
        peopleDisplay.append(people.bob.createElement(`${people.bob.name}: Spending ${numberFormat1.format(people.bob.value*people.bob.amount)} per second`));
        hasBob = true;
    }

    if(!hasBobClone && round(spentMoney) >= people.bob.cloneCost){
        peopleDisplay.append(people.bob.createCloneButton(() => {
            document.getElementById("Bob").textContent = `${people.bob.name}s: Spending ${numberFormat1.format(people.bob.value*people.bob.amount)} per second`;
        }, "Clone"));
        hasBobClone = true;
    }

    if(!hasAlice && round(spentMoney) >= people.alice.cost){
        people.alice.amount++;
        peopleDisplay.append(people.alice.createElement(`${people.alice.name}: Multiplying spending by ${1 + people.alice.value*people.alice.amount}`));
        hasAlice = true;
    }

    if(!hasAliceClone && round(spentMoney) >= people.alice.cloneCost){
        peopleDisplay.append(people.alice.createCloneButton(() => {
            document.getElementById("Alice").textContent = `${people.alice.name}s: Multiplying spending by ${(1 + people.alice.value*people.alice.amount).toFixed(2)}`; 
        }, "Clone"));
        hasAliceClone = true;
    }

    if(!unlockedClickBoost && round(spentMoney) >= activateButtons.clickUpgrade.cost){
        let clickBoost = new ActivateButton("Boost Click Strength", "clickUpgrade", function() {
            undoActivateEffects();
            player.clickStrength *= 10;
            this.disabled = true;
        });
        clickDisplay.append(clickBoost.createButton());
        unlockedClickBoost = true;
    }

    if(!autocloneObject.unlockedAutocloning && round(spentMoney) >= activateButtons.autoclone.cost){
        autocloneObject.unlockedAutocloning = true;

        let autoBob = new ActivateButton("Autoclone Bobs", "autoclone", function(){
            undoActivateEffects();
            autocloneObject.autocloneActivated = true;
            autocloneObject.bobAmount = autocloneObject.amount;
            this.disabled = true;
        });
        let autoAlice = new ActivateButton("Autoclone Alices", "autoclone", function(){
            undoActivateEffects();
            autocloneObject.autocloneActivated = true;
            autocloneObject.aliceAmount = autocloneObject.amount;
            this.disabled = true;
        });
        let autoIntern = new ActivateButton("Autoclone Interns", "autoclone", function(){
            undoActivateEffects();
            autocloneObject.autocloneActivated = true;
            autocloneObject.internAmount = autocloneObject.amount;
            this.disabled = true;
        });
        clickDisplay.append(autoBob.createButton(), autoAlice.createButton(), autoIntern.createButton());
    }

    if(!hasInterns && round(spentMoney >= people.intern.cost)){
        peopleDisplay.append(people.intern.createElement(`${people.intern.name}: multiply autocloning by ${1+people.intern.value*people.intern.amount}`));
        peopleDisplay.append(people.intern.createCloneButton(() => {
            document.getElementById(people.intern.name).textContent = `${people.intern.name}: multiply autocloning by ${(1+people.intern.value*people.intern.amount).toFixed(2)}`;
        }, "Clone"));
        hasInterns = true;
    }

    let decreaseAmount = people.bob.amount * people.bob.value * (1 + people.alice.amount * people.alice.value);
    decreaseMoney(decreaseAmount/1000 * dt);
    if(autocloneObject.autocloneActivated){
        autoclone(autocloneObject, dt)
    }
}

// effect is a function we will call on button click
class ActivateButton{
    constructor(upgradeText, name, effect){
        this.upgradeText = upgradeText;
        this.effect = effect;
        this.name = name;
    }

    createButton(){
        let d = document.createElement("div");
        let b = document.createElement("button");
        d.textContent = this.upgradeText;
        d.classList.add("upgrade-text");
        b.textContent = "Activate";
        b.addEventListener("click", this.effect);
        b.classList.add("activate-button");
        b.id = this.name;
        d.append(b);
        return d;
    }
}

function autoclone(ac, dt){
    people.bob.amount += ac.bobAmount/1000 * dt * (1+people.intern.amount * people.intern.value);
    people.alice.amount += ac.aliceAmount/1000 * dt * (1+people.intern.amount * people.intern.value);
    people.intern.amount += ac.internAmount/1000 *dt *(1+people.intern.amount * people.intern.value);
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

function round(s){
    return Math.round(s*100)/100;
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

function devMode(){
    people.bob.cost = 0.01, people.bob.cloneCost = 0.01;
    people.alice.cost = 0.01, people.alice.cloneCost = 0.01;
    people.intern.cost = 0.01;
    activateButtons.clickUpgrade.cost = 0.01;
    activateButtons.autoclone.cost = 0.01;
}

updateDisplay();