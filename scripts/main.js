let state;
let messages;
let people;
let activateButtons;
let hiringFair;
let autocloneObject;

function initializeGame(){
    state = {
        money: 1e12,
        spentMoney: 0,
        clickStrength: 0.01,
        paused: false,
        unlocks: {
            hasBob: false,
            hasBobClone: false,
            hasAlice: false,
            hasAliceClone: false,
            unlockedClickBoost: false,
            hasInterns: false,
            hasHiringFair: false,
            hasMisterE: false
        }
    };

    messages = [
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
        {condition: 235, text: "You've spent the average weekly grocery bill for a family of four ($235)"},
        {condition: 1e3, text: "Your clicks sure aren't doing much, are they?"},
        {condition: 1100, text: "Let's boost your click power a bit (also applies to cloning)"},
        {condition: 1413, text: "You've spent the median rent ($1,413)"},
        {condition: 6715, text: "You've spent the average credit card debt ($6,715)"},
        {condition: 13000, text: "Wouldn't it be better if you didn't have to click at all?"},
        {condition: 15000, text: "Introducing: autocloning (note: you can only have one effect active at a time)"},
        {condition: 39075, text: "You've spent the average federal student loan debt ($39,075)"},
        {condition: 83730, text: "You've spent the median household income ($83,730)"},
        {condition: 1e5, text: "You can hire some interns to run the autocloner"},
        {condition: 403200, text: "You've spent the median price of a home ($403,200)"},
        {condition: 5e5, text: "Host a job fair to get more interns (increases the longer you leave it activated)"},
        {condition: 1e6, text: "You've spent a million dollars. Wow!"},
        {condition: 50e6, text: "A strange man named Mr E appears. He doesn't like to be cloned, but accepts human sacrifices..."},
        {condition: 99.8e9, text: "You've spent the federal funding for SNAP in 2024 ($99.8 billion)"},
        {condition: 220e9, text: "You've spent the total medical debt held by the people ($220 billion)"}
    ];
    people = {
        bob: new Person(0.01, "Bob", 0, 1.75, 2.25),
        alice: new Person(0.01, "Alice", 0, 115, 130),
        intern: new Person(0.01, "Interns", 0, 1e5, null),
        misterE: new Person(0, "Mr E", 1, 50e6, null)
    };
    activateButtons = {
        clickUpgrade: {
            removeUpgrade(){
                state.clickStrength = 0.01;
            },
            cost: 1100
        },
        autoclone: {
            removeUpgrade(){
                autocloneObject.bobAmount = 0;
                autocloneObject.aliceAmount = 0;
                autocloneObject.autocloneActivated = false;
            },
            cost: 15000
        },
        hiring: {
            removeUpgrade(){
                hiringFair.timer = 0;
                hiringFair.amount = 1;
                hiringFair.activated = false;
                document.getElementById("hiringFairText").textContent = `Job Fair`;
            }
        }
    };
    hiringFair = {
        activated: false,
        timer: 0,
        amount: 1,
        cost: 5e5
    };
    autocloneObject = {
        unlockedAutocloning: false,
        autocloneActivated: false,
        bobAmount: 0,
        aliceAmount: 0
    };

    moneyButton.addEventListener("click", manualSpend);

    updateDisplay();
}

function resetDisplay(){
    // Removing all our created elements
    while(clickDisplay.firstChild){
        clickDisplay.removeChild(clickDisplay.firstChild);
    }
    while(peopleDisplay.firstChild){
        peopleDisplay.removeChild(peopleDisplay.firstChild);
    }
    while(messageLog.firstChild){
        messageLog.removeChild(messageLog.firstChild);
    }
    while(endgameButtons.firstChild){
        endgameButtons.removeChild(endgameButtons.firstChild);
    }

    gameOverDisplay.hidden = true;
    gameOverDisplay.classList.remove("fade-in");
    moneyDisplay.classList.remove("shrink-out");

    moneyButton.hidden = false;
    peopleDisplay.hidden = false;
    clickDisplay.hidden = false;
    messageLog.hidden = false;
}

const moneyDisplay = document.querySelector(".money-display");
const numberFormat1 = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
const moneyButton = document.querySelector(".money-button");
const messageLog = document.querySelector(".message-log");
const peopleDisplay = document.querySelector(".people-container");
const clickDisplay = document.querySelector(".click-upgrade-container");
const darkModeButton = document.getElementById("darkMode");
const devModeButton = document.getElementById("devMode");
const gameOverDisplay = document.querySelector(".game-over-box");
const endgameButtons = document.querySelector(".button-container");

darkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    clickDisplay.classList.toggle("border-dark");
    peopleDisplay.classList.toggle("border-dark");
    gameOverDisplay.classList.toggle("game-over-box-dark");
});

devModeButton.addEventListener("click", devMode);

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

    createCloneButton(buttonText){
        let cb = document.createElement("button");
        cb.textContent = buttonText;
        cb.addEventListener("click", () => {
            this.amount += state.clickStrength*100;
        });
        return cb;
    }

    createSacrificeButton(buttonText){
        let sb = document.createElement("button");
        sb.textContent = buttonText;
        sb.addEventListener("click", () => {
            let arr = [people.bob.amount-1, people.alice.amount-1, people.intern.amount];
            let expIncrease = arr.reduce((a,b) => a+b, 0) * 1e-4;

            people.misterE.value += expIncrease;
            people.bob.amount = 1;
            people.alice.amount = 1;
            people.intern.amount = 0;
            document.getElementById(people.misterE.name).textContent = `${people.misterE.name}: Multiply spending by e^${people.misterE.value.toFixed(4)}`;
        });
        return sb;
    }
}

function decreaseMoney(amount){
    state.money -= amount;
    state.spentMoney += amount;
}

function updateDisplay(){
    moneyDisplay.textContent = numberFormat1.format(state.money);
    if(messages.length > 0 && round(state.spentMoney) >= messages[0].condition){
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

    if(state.hasBob){
        document.getElementById(people.bob.name).textContent = `${people.bob.name}s: Spending ${numberFormat1.format(people.bob.value*people.bob.amount)} per second`;
    }

    if(state.hasAlice){
        document.getElementById(people.alice.name).textContent = `${people.alice.name}s: Multiply spending by ${(1+people.alice.value*people.alice.amount).toFixed(2)}`;
    }

    if(state.hasInterns){
        document.getElementById(people.intern.name).textContent = `${people.intern.name}: Multiply autocloning by ${(1+people.intern.amount*people.intern.value).toFixed(2)}`;
    }
}

function updateState(dt){
    if(!state.hasBob && round(state.spentMoney) >= people.bob.cost){
        people.bob.amount++;
        peopleDisplay.append(people.bob.createElement(`${people.bob.name}: Spending ${numberFormat1.format(people.bob.value*people.bob.amount)} per second`));
        state.hasBob = true;
    }

    if(!state.hasBobClone && round(state.spentMoney) >= people.bob.cloneCost){
        peopleDisplay.append(people.bob.createCloneButton("Clone"));
        state.hasBobClone = true;
    }

    if(!state.hasAlice && round(state.spentMoney) >= people.alice.cost){
        people.alice.amount++;
        peopleDisplay.append(people.alice.createElement(`${people.alice.name}: Multiply spending by ${1 + people.alice.value*people.alice.amount}`));
        state.hasAlice = true;
    }

    if(!state.hasAliceClone && round(state.spentMoney) >= people.alice.cloneCost){
        peopleDisplay.append(people.alice.createCloneButton("Clone"));
        state.hasAliceClone = true;
    }

    if(!state.unlockedClickBoost && round(state.spentMoney) >= activateButtons.clickUpgrade.cost){
        let clickBoost = new ActivateButton("Boost Click Strength", "clickUpgrade", function() {
            undoActivateEffects();
            state.clickStrength *= 10;
            this.disabled = true;
        });
        clickDisplay.append(clickBoost.createButton());
        state.unlockedClickBoost = true;
    }

    if(!autocloneObject.unlockedAutocloning && round(state.spentMoney) >= activateButtons.autoclone.cost){
        autocloneObject.unlockedAutocloning = true;

        let autoBob = new ActivateButton("Autoclone Bobs", "autoclone", function(){
            undoActivateEffects();
            autocloneObject.autocloneActivated = true;
            autocloneObject.bobAmount++;
            this.disabled = true;
        });
        let autoAlice = new ActivateButton("Autoclone Alices", "autoclone", function(){
            undoActivateEffects();
            autocloneObject.autocloneActivated = true;
            autocloneObject.aliceAmount++;
            this.disabled = true;
        });
        clickDisplay.append(autoBob.createButton("autocloneBobText"), autoAlice.createButton("autocloneAliceText"));
    }

    if(!state.hasInterns && round(state.spentMoney) >= people.intern.cost){
        peopleDisplay.append(people.intern.createElement(`${people.intern.name}: Multiply autocloning by ${1+people.intern.value*people.intern.amount}`));
        peopleDisplay.append(people.intern.createCloneButton("Hire"));
        state.hasInterns = true;
    }

    if(!state.hasHiringFair && round(state.spentMoney) >= hiringFair.cost){
        state.hasHiringFair = true;
        let autoIntern = new ActivateButton("Job Fair", "hiring", function(){
            undoActivateEffects();
            document.getElementById("hiringFairText").textContent = `Job Fair (${hiringFair.amount} interns / s)`;
            hiringFair.activated = true;
            this.disabled = true;
        });
        clickDisplay.append(autoIntern.createButton("hiringFairText"));
    }

    if(!state.hasMisterE && round(state.spentMoney) >= people.misterE.cost){
        peopleDisplay.append(people.misterE.createElement(`${people.misterE.name}: Multiply spending by e^${people.misterE.value.toFixed(4)}`));
        peopleDisplay.append(people.misterE.createSacrificeButton("Sacrifice"));
        state.hasMisterE = true;
    }

    let decreaseAmount = people.bob.amount * people.bob.value * (1 + people.alice.amount * people.alice.value) * Math.E**(people.misterE.value);
    // Check if game is over
    if(state.money - decreaseAmount/1000*dt <= 0){
        state.paused = true;
        state.money = 0.01;
        updateDisplay();
        peopleDisplay.hidden = true;
        clickDisplay.hidden = true;
        messageLog.hidden = true;
        moneyButton.removeEventListener("click", manualSpend);
        moneyButton.addEventListener("click", function lastClick(){
            state.money = 0;
            updateDisplay();
            moneyButton.hidden = true;
            moneyDisplay.classList.add("shrink-out");
            setTimeout(() => {endGame()},5000);
            this.removeEventListener("click", lastClick);
        });
        return;
    }
    decreaseMoney(decreaseAmount/1000 * dt);
    state.money = compoundInterest(state.money, 0.07, dt*3.17e-11);

    if(autocloneObject.autocloneActivated){
        autoclone(autocloneObject, dt);
    }

    if(hiringFair.activated){
        hiringFair.timer += dt;
        hireInterns(dt);
    }

    updateDisplay();
}

// effect is a function we will call on button click
class ActivateButton{
    constructor(upgradeText, name, effect){
        this.upgradeText = upgradeText;
        this.effect = effect;
        this.name = name;
    }

    createButton(textId){
        let d = document.createElement("div");
        let b = document.createElement("button");
        let t = document.createElement("span");
        t.textContent = this.upgradeText;
        t.id = textId;
        d.classList.add("upgrade-text");
        b.textContent = "Activate";
        b.addEventListener("click", this.effect);
        b.classList.add("activate-button");
        b.id = this.name;
        d.append(t);
        d.append(b);
        return d;
    }
}

function autoclone(ac, dt){
    people.bob.amount += ac.bobAmount/1000 * dt * (1+people.intern.amount*people.intern.value);
    people.alice.amount += ac.aliceAmount/1000 * dt * (1+people.intern.amount*people.intern.value);
}

function hireInterns(dt){
    if(hiringFair.amount < 10 && hiringFair.timer % 6e3 === 0){
        hiringFair.amount += 1;
        if(hiringFair.amount === 10){
            document.getElementById("hiringFairText").textContent = `Job Fair (${hiringFair.amount} interns / s - max)`;
        } else {
            document.getElementById("hiringFairText").textContent = `Job Fair (${hiringFair.amount} interns / s)`;
        }
    }
    people.intern.amount += hiringFair.amount/1000 * dt;
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

// Continuous compound interest - p: principal, r: rate (years), t: time step (years)
function compoundInterest(p, r, t){
    return p*Math.E**(r*t);
}

function manualSpend(){
    state.money -= state.clickStrength;
    state.spentMoney += state.clickStrength;
    updateDisplay();
}

function endGame(){
    document.querySelector(".game-over-text").textContent = `Congratulations! You did it! 
    You can play again, with a couple different options. Or you can just go tell all your friends about 
    how you won Trillionaire Clicker. Good work!`;

    gameOverDisplay.hidden = false;
    gameOverDisplay.classList.add("fade-in");
    let options = ["playAgain", "playEasy", "playHard"];
    // Assign replay button functions
    for(i of options){
        let b = document.createElement("button");
        b.classList.add("end-game-button");
        if(i === "playAgain"){
            b.textContent = `Play Again`;
            b.addEventListener("click", () => {
                initializeGame();
                resetDisplay();
            });
        } else if(i === "playEasy"){
            b.textContent = `Play Again with Everything Unlocked`;
            b.addEventListener("click", () => {
                initializeGame();
                resetDisplay();
                devMode();
            });
        } else {
            b.textContent = `Play Again on Hard Mode`;
            b.addEventListener("click", () => {
                console.log("Initialize Hard Mode");
            });
        }
        endgameButtons.append(b);
    }
}

// Game Loop
let lastTime = null;
let timeStep = 25;
let accumulatedLag = 0;
setInterval(function gameLoop(){
    if(state.paused){
        return;
    }
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
    people.bob.cost = 0, people.bob.cloneCost = 0;
    people.alice.cost = 0, people.alice.cloneCost = 0;
    people.intern.cost = 0;
    people.misterE.cost = 0;
    activateButtons.clickUpgrade.cost = 0;
    activateButtons.autoclone.cost = 0;
    hiringFair.cost = 0;
}

initializeGame();