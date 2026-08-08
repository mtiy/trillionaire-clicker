let state;
let messages;
let people;
let activateButtons;
let hiringFair;
let autocloneObject;
let randomEvents;

// Used for formatting our money
const numberFormat1 = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});

const moneyDisplay = document.querySelector(".money-display");
const moneyButton = document.querySelector(".money-button");
const messageLog = document.querySelector(".message-log");
const peopleDisplay = document.querySelector(".people-container");
const clickDisplay = document.querySelector(".click-upgrade-container");
const darkModeButton = document.getElementById("darkMode");
const devModeButton = document.getElementById("devMode");
const gameOverDisplay = document.querySelector(".game-over-box");
const endgameButtons = document.querySelector(".button-container");
const startModal = document.getElementById("startScreen");
const hardModeModal = document.getElementById("hardModeStartScreen");
const restartConfirmModal = document.getElementById("restartConfirm");
const eventModal = document.getElementById("eventModal");
const root = document.querySelector(":root");

let permanentState = {
    baseClickStrength: 0.01,
    bobValue: 0.01,
    aliceValue: 0.01,
    autocloneMultiplier: 1,
    clickBoostMax: 1,
    hiringFairMax: 10,
    internValue: 0.01,
    money: 1e12,
    totalMoneySpent: 0
}

let prestigeRewards = {
    index: 0,
    clickStrengthUpgrade: 0.5,
    bobMult: 2,
    aliceMult: 2,
    clickBoostMaxIncrease: 1,
    internMult: 2,
    hiringFairMaxIncrease: 5,
    autocloneMultiplierIncrease: 1,
    upgrade(){
        let upgradeText = ``;
        if(this.index === 0){
            permanentState.baseClickStrength += this.clickStrengthUpgrade;
            upgradeText = `Click Strength permanently increased to ${permanentState.baseClickStrength.toFixed(2)}`;
        }
        if(this.index === 1){
            permanentState.bobValue *= this.bobMult;
            upgradeText = `Bob spending per clone permanently increased to ${numberFormat1.format(permanentState.bobValue)}`;
        }
        if(this.index === 2){
            permanentState.aliceValue *= this.aliceMult;
            upgradeText = `Alice multiplier per clone permanently increased to ${permanentState.aliceValue.toFixed(2)}`;
        }
        if(this.index === 3){
            permanentState.clickBoostMax += this.clickBoostMaxIncrease;
            upgradeText = `Click Boost maximum permanently increased to ${permanentState.clickBoostMax}`;
        }
        if(this.index === 4){
            permanentState.internValue *= this.internMult;
            upgradeText = `Multiplier from each intern permanently increased to ${permanentState.internValue}`;
        }
        if(this.index === 5){
            permanentState.hiringFairMax += this.hiringFairMaxIncrease;
            upgradeText = `Hiring Fair maximum permanently increased to ${permanentState.hiringFairMax}`;
        }
        if(this.index === 6){
            permanentState.autocloneMultiplier += this.autocloneMultiplierIncrease;
            upgradeText = `Autoclone efficiency multiplier permanently increased to ${permanentState.autocloneMultiplier}`;
        }

        this.index++;
        if(this.index === 7){
            this.index = 0;
        }

        return upgradeText;
    }
    
}

// Initialize all states and conditions for the purpose of starting a new game
function initializeGame(){
    state = {
        money: permanentState.money,
        spentMoney: 0,
        clickStrength: permanentState.baseClickStrength,
        paused: false,
        hardMode: false,
        unlocks: {
            hasBob: false,
            hasBobClone: false,
            hasAlice: false,
            hasAliceClone: false,
            unlockedClickBoost: false,
            hasInterns: false,
            hasHiringFair: false,
            hasMisterE: false,
            millionEvent: false,
            billionEvent: false
        },
        killInterns: false,
        clickPercent: 0,
        randomConstant: 0
    };

    messages = [
        {condition: 0.01, text: "Spent a penny"},
        {condition: 0.05, text: "You have spent one nickel"},
        {condition: 0.10, text: "Now a dime"},
        {condition: 0.25, text: "A whole quarter"},
        {condition: 0.30, text: "Wow, this is getting kind of tiring, huh?"},
        {condition: 0.40, text: "Let's find someone to spend this for you"},
        {condition: 0.50, text: "This is Bob. He can spend money for you automatically."},
        {condition: 0.60, text: "He's not very fast though"},
        {condition: 0.70, text: "Luckily, we can clone him"},
        {condition: 5, text: "You've spent 5 dollars"},
        {condition: 50, text: "Your clicks sure aren't doing much, are they?"},
        {condition: 75, text: "Let's boost your click power a bit (also applies to cloning)"},
        {condition: 100, text: "$100, wow!"},
        {condition: 300, text: "This is Alice. She helps Bob spend more."},
        {condition: 400, text: "Of course, we can clone her too"},
        {condition: 1000, text: "You've spent a thousand dollars"},
        {condition: 10000, text: "$10,000 spent now"},
        {condition: 12000, text: "Wouldn't it be better if you didn't have to click at all?"},
        {condition: 16000, text: "Introducing: autocloning (note: you can only have one effect active at a time)"},
        {condition: 90000, text: "You can hire some interns to run the autocloner"},
        {condition: 1e5, text: "You've spent $100,000"},
        {condition: 5e5, text: "Host a job fair to get more interns (increases the longer you leave it activated)"},
        {condition: 1e6, text: "1 million dollars"},
        {condition: 10e6, text: "10 million"},
        {condition: 50e6, text: "A strange man named Mr E appears. He doesn't like to be cloned, but accepts human sacrifices..."},
        {condition: 100e6, text: "100 million"},
        {condition: 1e9, text: "A billion dollars spent and gone"},
        {condition: 10e9, text: "10 billion"},
        {condition: 100e9, text: "100 billion. Getting closer"},
        {condition: 1e12, text: "1 trillion dollars. But not enough yet"}
    ];

    people = {
        bob: new Person(0, "Bob", 1, 0.50, 0.70),
        alice: new Person(0, "Alice", 1, 300, 400),
        intern: new Person(permanentState.internValue, "Interns", 0, 90000, null),
        misterE: new Person(0, "Mr E", 1, 50e6, null)
    };

    activateButtons = {
        clickUpgrade: {
            removeUpgrade(){
                state.clickStrength = permanentState.baseClickStrength;
                activateButtons.clickUpgrade.activated = false;
                document.getElementById("clickStrengthText").textContent = `Boost Click Strength`;
            },
            cost: 75,
            activated: false
        },
        autoclone: {
            removeUpgrade(){
                autocloneObject.bobAmount = 0;
                autocloneObject.aliceAmount = 0;
                autocloneObject.autocloneActivated = false;
            },
            cost: 16000
        },
        hiring: {
            removeUpgrade(){
                hiringFair.timer = 0;
                hiringFair.amount = 1;
                hiringFair.activated = false;
                document.getElementById("hiringFairText").textContent = `Job Fair`;
            },
            cost: 5e5
        }
    };

    hiringFair = {
        activated: false,
        timer: 0,
        amount: 1
    };

    autocloneObject = {
        unlockedAutocloning: false,
        autocloneActivated: false,
        bobAmount: 0,
        aliceAmount: 0,
        multiplier: 1
    };

    randomEvents = [
        {
            chance: 0.15,
            name: `Clone Uprising`,
            buttonText: `Good for them, I guess`,
            flavorText: `The clones of Bob and Alice have unionized, citing extreme work hours as the
            primary cause. You agree to reduce their working hours, at the cost of some efficiency.`,
            effectText: `Bob and Alice efficiency decreased by 50%`,
            effect(){
                people.bob.value *= 0.5;
                people.alice.value *= 0.5;
            }
        },
        {
            chance: 0.15,
            name: `Ambitious Interns`,
            buttonText: `Hm. Okay`,
            flavorText: `Your interns are ruthless. Cutthroat. They don't sleep. Don't eat. All they do is work.
            Even though they don't get paid, they put every ounce of their beings into the job. Unfortunately, this is
            terrible for their health.`,
            effectText: `Intern production doubled, intern amount decreases over time`,
            effect(){
                people.intern.value *= 2;
                state.killInterns = true;
            }
        },
        {
            chance: 0.4,
            name: `Economy Collapses!`,
            buttonText: `Hooray!`,
            flavorText: `The stock market crashes. Billionaires everywhere cry out in agony. Their time has come.`,
            effectText: ``,
            effect(){
                let amount = state.spentMoney*100*Math.random();
                decreaseMoney(amount);
                this.effectText = `Money decreased by ${numberFormat1.format(amount)}`;
            }
        },
        {
            chance: 0.15,
            name: `Money Everywhere!`,
            buttonText: `Noooo`,
            flavorText: `Business is booming! The money printers are working overtime to keep up. More money!`,
            effectText: ``,
            effect(){
                let amount = state.spentMoney * 0.3 * Math.random();
                state.money += amount;
                this.effectText = `Money increased by ${numberFormat1.format(amount)}`;
            }
        },
        {
            chance: 0.1,
            name: `Age of Automation`,
            buttonText: `Even clicking this button is hard`,
            flavorText: `We have all come to appreciate the benefits of the autocloner. Our hands, once cramped, can now
            rest. In fact, they've rested so much that we're not sure how to use them anymore. The autocloner doesn't mind.
            It just works harder.`,
            effectText: `Autocloner production doubled, cannot manually clone`,
            effect(){
                autocloneObject.multiplier *= 2;
                let cloneButtons = document.querySelectorAll(".clone-button");
                cloneButtons[0].disabled = true;
                cloneButtons[1].disabled = true;
            }
        },
        {
            chance: 0.05,
            name: `The Invisible Hand`,
            buttonText: `I love clicking buttons!`,
            flavorText: `You've really got the hang of this clicking business. Guiding money in the right direction - your pockets. No one does it like the boss.`,
            effectText: ``,
            effect(){
                let percent = (0.1 + Math.random()*2)/100;
                state.clickPercent = percent;
                this.effectText = `Manually spending decreases money by ${(percent*100).toFixed(2)}%`;
            }
        }
    ]

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
    eventModal.textContent = ``;
    document.querySelector(".game-over-text").textContent = ``;

    moneyButton.hidden = false;
    peopleDisplay.hidden = false;
    clickDisplay.hidden = false;
    messageLog.hidden = false;
}

// Dark mode
darkModeButton.addEventListener("click", () => {
    if(darkModeButton.textContent === "Dark Mode"){
        darkModeButton.textContent = "Light Mode";
        root.style.setProperty("--button-background-color", `rgb(48, 37, 37)`);
        root.style.setProperty("--button-color", `rgb(187, 187, 186)`);
        root.style.setProperty("--button-background-hover", `rgb(160, 160, 160)`);
        root.style.setProperty("--button-hover-color", `rgb(42, 81, 1)`);
        root.style.setProperty("--button-disabled-color", `rgb(41, 70, 9)`);
        root.style.setProperty("--button-disabled-background", `rgb(162, 163, 151)`);
    } else {
        darkModeButton.textContent = "Dark Mode";
        root.style.setProperty("--button-background-color", `rgb(226, 230, 193)`);
        root.style.setProperty("--button-color", `rgb(46, 36, 1)`);
        root.style.setProperty("--button-background-hover", `rgb(185, 188, 158)`);
        root.style.setProperty("--button-hover-color", `rgb(56, 105, 3)`);
        root.style.setProperty("--button-disabled-color", `rgb(176, 245, 102)`);
        root.style.setProperty("--button-disabled-background", `rgb(103, 105, 88)`);
    }
    document.body.classList.toggle("dark-mode");
    clickDisplay.classList.toggle("border-dark");
    peopleDisplay.classList.toggle("border-dark");
    gameOverDisplay.classList.toggle("game-over-box-dark");
    document.querySelectorAll(".modal-popup").forEach((e) => {
        e.classList.toggle("dark-modal");
    });
});

document.getElementById("reset").addEventListener("click", () => {
    restartConfirmModal.showModal();
});

// Modal buttons
document.getElementById("startButton").addEventListener("click", () => {
    startModal.close();
});

document.getElementById("hardModeButton").addEventListener("click", () => {
    people.bob.cost = 0, people.bob.cloneCost = 0;
    people.alice.cost = 0, people.alice.cloneCost = 0;
    activateButtons.clickUpgrade.cost = 0;
    hardModeModal.close();
    state.paused = false;
});

document.getElementById("restartYes").addEventListener("click", () => {
    restartConfirmModal.close();
    permanentState = {
        baseClickStrength: 0.01,
        bobValue: 0.01,
        aliceValue: 0.01,
        autocloneMultiplier: 1,
        clickBoostMax: 1,
        hiringFairMax: 10,
        internValue: 0.01,
        money: 1e12,
        totalMoneySpent: 0
    }
    initializeGame();
    resetDisplay();
    saveGame();
    startModal.showModal();
});

document.getElementById("restartNo").addEventListener("click", () => {
    restartConfirmModal.close();
});

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
        cb.classList.add("clone-button");
        return cb;
    }

    createSacrificeButton(buttonText){
        let sb = document.createElement("button");
        sb.textContent = buttonText;
        sb.classList.add("clone-button");
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
        m.classList.add("fade-in");
        messages.shift();
        messageLog.prepend(m);
    }
    document.querySelectorAll(".message").forEach((element) => {
        if(element.offsetTop > 550){
            element.remove();
        }
    });

    if(state.unlocks.hasBob){
        document.getElementById(people.bob.name).textContent = `${people.bob.name}s: Spending ${numberFormat1.format(people.bob.value*people.bob.amount)} per second`;
    }

    if(state.unlocks.hasAlice){
        document.getElementById(people.alice.name).textContent = `${people.alice.name}s: Multiply spending by ${(1+people.alice.value*people.alice.amount).toFixed(2)}`;
    }

    if(state.unlocks.hasInterns){
        document.getElementById(people.intern.name).textContent = `${people.intern.name}: Multiply autocloning by ${(1+people.intern.amount*people.intern.value).toFixed(2)}`;
    }
}

function updateState(dt){
    if(!state.unlocks.hasBob && round(state.spentMoney) >= people.bob.cost){
        people.bob.value = permanentState.bobValue;
        peopleDisplay.append(people.bob.createElement(`${people.bob.name}: Spending ${numberFormat1.format(people.bob.value*people.bob.amount)} per second`));
        state.unlocks.hasBob = true;
    }

    if(!state.unlocks.hasBobClone && round(state.spentMoney) >= people.bob.cloneCost){
        peopleDisplay.append(people.bob.createCloneButton("Clone"));
        state.unlocks.hasBobClone = true;
    }

    if(!state.unlocks.hasAlice && round(state.spentMoney) >= people.alice.cost){
        people.alice.value = permanentState.aliceValue;
        peopleDisplay.append(people.alice.createElement(`${people.alice.name}: Multiply spending by ${1 + people.alice.value*people.alice.amount}`));
        state.unlocks.hasAlice = true;
    }

    if(!state.unlocks.hasAliceClone && round(state.spentMoney) >= people.alice.cloneCost){
        peopleDisplay.append(people.alice.createCloneButton("Clone"));
        state.unlocks.hasAliceClone = true;
    }

    if(!state.unlocks.unlockedClickBoost && round(state.spentMoney) >= activateButtons.clickUpgrade.cost){
        let clickBoost = new ActivateButton("Boost Click Strength", "clickUpgrade", function() {
            undoActivateEffects();
            activateButtons.clickUpgrade.activated = true;
            this.disabled = true;
        });
        clickDisplay.append(clickBoost.createButton("clickStrengthText"));
        state.unlocks.unlockedClickBoost = true;
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

    if(!state.unlocks.hasInterns && round(state.spentMoney) >= people.intern.cost){
        peopleDisplay.append(people.intern.createElement(`${people.intern.name}: Multiply autocloning by ${1+people.intern.value*people.intern.amount}`));
        peopleDisplay.append(people.intern.createCloneButton("Hire"));
        state.unlocks.hasInterns = true;
    }

    if(!state.unlocks.hasHiringFair && round(state.spentMoney) >= activateButtons.hiring.cost){
        state.unlocks.hasHiringFair = true;
        let autoIntern = new ActivateButton("Job Fair", "hiring", function(){
            undoActivateEffects();
            document.getElementById("hiringFairText").textContent = `${hiringFair.amount} interns / s`;
            hiringFair.activated = true;
            this.disabled = true;
        });
        clickDisplay.append(autoIntern.createButton("hiringFairText"));
    }

    // Million dollar random event
    if(!state.unlocks.millionEvent && round(state.spentMoney) >= 1e6){
        let event = chooseRandomEvent();
        createRandomEvent(event);
        eventModal.showModal();
        state.unlocks.millionEvent = true;
    }

    // Unlocking Mr E
    if(!state.unlocks.hasMisterE && round(state.spentMoney) >= people.misterE.cost){
        peopleDisplay.append(people.misterE.createElement(`${people.misterE.name}: Multiply spending by e^${people.misterE.value.toFixed(4)}`));
        peopleDisplay.append(people.misterE.createSacrificeButton("Sacrifice"));
        state.unlocks.hasMisterE = true;
    }

    // Billion dollar random event
    if(!state.unlocks.billionEvent && round(state.spentMoney) >= 1e9){
        let event = chooseRandomEvent();
        createRandomEvent(event);
        eventModal.showModal();
        state.unlocks.billionEvent = true;
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

    // Add interest if hard mode is active
    if(state.hardMode){
        state.money = compoundInterest(state.money, 0.05, dt/1000/25);
    }

    if(autocloneObject.autocloneActivated){
        autoclone(autocloneObject, dt);
    }

    if(hiringFair.activated){
        hiringFair.timer += dt;
        hireInterns(dt);
    }

    if(activateButtons.clickUpgrade.activated){
        boostClickPower(dt);
    }

    if(state.killInterns && people.intern.amount > 0){
        people.intern.amount -= 1/1000 * dt;
        if(people.intern.amount < 0){
            people.intern.amount = 0;
        }
    }

    if(totalTime - lastSave >= 5000){
        saveGame();
        lastSave = totalTime;
        console.log("Game Saved!");
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
    people.bob.amount += ac.multiplier * ac.bobAmount/1000 * dt * (1+people.intern.amount*people.intern.value);
    people.alice.amount += ac.multiplier * ac.aliceAmount/1000 * dt * (1+people.intern.amount*people.intern.value);
}

function hireInterns(dt){
    if(hiringFair.amount < permanentState.hiringFairMax && hiringFair.timer % 6e3 === 0){
        hiringFair.amount += permanentState.hiringFairMax/10;
        if(hiringFair.amount >= permanentState.hiringFairMax){
            hiringFair.amount = permanentState.hiringFairMax;
            document.getElementById("hiringFairText").textContent = `${hiringFair.amount} interns / s - max`;
        } else {
            document.getElementById("hiringFairText").textContent = `${hiringFair.amount} interns / s`;
        }
    }
    people.intern.amount += hiringFair.amount/1000 * dt;
}

function boostClickPower(dt){
    if(state.clickStrength <= permanentState.clickBoostMax){
        // Evenly divide the maximum we want to reach over 10 minutes
        state.clickStrength += (permanentState.clickBoostMax/600000) * dt;
        if(state.clickStrength > permanentState.clickBoostMax){
            state.clickStrength = permanentState.clickBoostMax;
        }
        document.getElementById("clickStrengthText").textContent = `Click Strength: ${state.clickStrength.toFixed(2)} / ${permanentState.clickBoostMax}`;
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

function round(s){
    return Math.round(s*100)/100;
}

// Continuous compound interest - p: principal, r: rate (years), t: time step (years)
function compoundInterest(p, r, t){
    return p*Math.E**(r*t);
}

function manualSpend(){
    state.money -= (state.clickStrength + state.money*state.clickPercent);
    state.spentMoney += (state.clickStrength + state.money*state.clickPercent);
    updateDisplay();
}

//
function chooseRandomEvent(){
    let randNum = Math.random() * (1-state.randomConstant);
    console.log(randNum);
    let event = undefined;

    // Choosing an event based on their weighted probabilities
    for(i of randomEvents){
        if(randNum < i.chance){
            event = i;
            state.randomConstant = i.chance;
            i.chance = 0;
            break;
        } else {
            randNum -= i.chance;
        }
    }

    return event;
}

// Fill the event modal based on which random event was chosen
function createRandomEvent(obj){
    obj.effect();

    eventModal.textContent = ``;

    let titleText = document.createElement("div");
    let mainText = document.createElement("div");
    let effdiv = document.createElement("div");
    let flavdiv = document.createElement("div");
    let exitButton = document.createElement("button");
    titleText.classList.add("headline");
    titleText.textContent = obj.name;
    effdiv.classList.add("effect-text");
    effdiv.textContent = obj.effectText;
    flavdiv.textContent = obj.flavorText;
    exitButton.textContent = obj.buttonText;
    exitButton.addEventListener("click", () => {
        eventModal.close();
    });
    exitButton.classList.add("modal-button");

    mainText.append(titleText);
    mainText.append(document.createElement("br"));
    mainText.append(flavdiv);
    mainText.append(document.createElement("br"));
    mainText.append(effdiv);

    eventModal.append(mainText, exitButton);
}

// Creates game over text and handles end of game states (hard mode or normal)
function endGame(){
    // Apply upgrade (for now just click strength boost)
    let text = prestigeRewards.upgrade();
    permanentState.totalMoneySpent += state.spentMoney;

    // Endgame Text
    let gameOverText = document.createTextNode(`You find yourself here again. Or is this the first time? Mr. E stares at you, then at the pile of
    money you've spent. "More", he says, "I need more."`);
    let spendText = document.createTextNode(`You have spent a total of ${numberFormat1.format(permanentState.totalMoneySpent)}`);
    let upgradeText = document.createElement("div");
    upgradeText.textContent = text;
    upgradeText.classList.add("permanent-upgrade-text");

    document.querySelector(".game-over-text").append(gameOverText, document.createElement("br"), spendText, document.createElement("br"), upgradeText);

    // Create play again buttons
    let playAgain = document.createElement("button");
    let playAgainHard = document.createElement("button");

    playAgain.classList.add("end-game-button");
    playAgain.textContent = `Play Again`;
    playAgain.addEventListener("click", () => {
        initializeGame();
        resetDisplay();
    });

    playAgainHard.classList.add("end-game-button");
    playAgainHard.textContent = `Play Again (Hard Mode)`;
    playAgainHard.addEventListener("click", () => {
        initializeGame();
        resetDisplay();
        state.paused = true;
        lastTime = null;
        state.hardMode = true;
        hardModeModal.showModal();
    });

    endgameButtons.append(playAgain, playAgainHard);
       
    // Show game over text
    gameOverDisplay.hidden = false;
    gameOverDisplay.classList.add("fade-in");
}

// Game Loop
let lastTime = null;
let timeStep = 25;
let accumulatedLag = 0;
let totalTime = 0;
let lastSave = 0;
setInterval(function gameLoop(){
    if(state.paused){
        return;
    }
    const currentTime = performance.now();
    if(lastTime === null){
        lastTime = performance.now();
    }
    const deltaTime = currentTime - lastTime;
    totalTime += deltaTime;
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
    activateButtons.hiring.cost = 0;
}

function saveGame(){
    localStorage.clear();

    let save = {
        state: state,
        messages: messages,
        people: people,
        activateButtons: activateButtons,
        permanentState: permanentState
    }

    localStorage.setItem("trillionaireClickerSave", JSON.stringify(save));
}

function loadGame(){
    initializeGame();
    resetDisplay();
    let save = JSON.parse(localStorage.getItem("trillionaireClickerSave"));

    state = save.state;
    messages = save.messages;
    permanentState = save.permanentState;

    people = {
        bob: new Person(save.people.bob.value, save.people.bob.name, save.people.bob.amount, save.people.bob.cost, save.people.bob.cloneCost),
        alice: new Person(save.people.alice.value, save.people.alice.name, save.people.alice.amount, save.people.alice.cost, save.people.alice.cloneCost),
        intern: new Person(save.people.intern.value, save.people.intern.name, save.people.intern.amount, save.people.intern.cost, save.people.intern.cloneCost),
        misterE: new Person(save.people.misterE.value, save.people.misterE.name, save.people.misterE.amount, save.people.misterE.cost, save.people.misterE.cloneCost)
    };

    for(ab in activateButtons){
        activateButtons[ab].cost = save.activateButtons[ab].cost;
    }

    for(i in state.unlocks){
        state.unlocks[i] = false;
    }
}

// Loads in the game state 
window.onload = (event) => {
    if(localStorage.getItem("trillionaireClickerSave") != null){
        loadGame();
    } else {
        startModal.showModal();
        initializeGame();
    }
}