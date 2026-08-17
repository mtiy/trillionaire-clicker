let state;
let messages;
let people;
let activateButtons;
let hiringFair;
let autocloneObject;
let firstRandomEvents;
let secondRandomEvents;
let activateButtonsStatus;

// Used for formatting our money
const numberFormat1 = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
const numberFormat2 = new Intl.NumberFormat("en-US", {notation: "scientific", minimumFractionDigits: "4"});
const numberFormat3 = new Intl.NumberFormat("en-US", {maximumFractionDigits:"0"});
const numberFormat4 = new Intl.NumberFormat("en-US", {notation: "scientific", maximumFractionDigits: "2"});

const moneyDisplay = document.querySelector(".money-display");
const moneyButton = document.querySelector(".money-button");
const moneyButtonDisplay = document.querySelector(".money-button-container");
const moneyContainer = document.querySelector(".money-container");
const messageLog = document.querySelector(".message-log");
const peopleDisplay = document.querySelector(".people-container");
const clickDisplay = document.querySelector(".click-upgrade-container");
const optionsDisplay = document.querySelector(".options-banner");
const darkModeButton = document.getElementById("darkMode");
const mobileOptionsDisplay = document.querySelector(".mobile-options-banner");
const mobileDarkModeButton = document.getElementById("mobile-dark-mode");
const mobileResetButton = document.getElementById("mobile-reset");
const gameOverDisplay = document.querySelector(".game-over-box");
const endgameButtons = document.querySelector(".button-container");
const endgameUpgrades = document.querySelector(".endgame-upgrades-container");
const endgameUpgradesButtons = document.querySelector(".endgame-upgrades-button-container");
const startModal = document.getElementById("startScreen");
const hardModeModal = document.getElementById("hardModeStartScreen");
const restartConfirmModal = document.getElementById("restartConfirm");
const eventModal = document.getElementById("eventModal");
const root = document.querySelector(":root");

// Mobile buttons, remove notification effect on click
const mobileButtons = document.querySelectorAll(".mobile-button");
for(i=0; i<mobileButtons.length; i++){
    mobileButtons[i].addEventListener("click", function(){
        this.classList.remove("mobile-notification");
    });
}

// Mobile buttons, display relevant section, hide all others
const mobileHomeButton = document.getElementById("mobile-home-button");
const mobileEffectsButton = document.getElementById("mobile-effects-button");
const mobilePeopleButton = document.getElementById("mobile-people-button");
const mobileOptionsButton = document.getElementById("mobile-options-button");

// Hiding sets of elements, used for mobile and for end game display hiding
function hideScreen(elements, type){
    if(type === `display`){
        elements.forEach((e) => {
            e.style.display = "none";
        });
    } else if(type === `visibility`){
        elements.forEach((e) => {
            e.style.visibility = `hidden`;
        });
    } else {
        console.log("Error: Incorrect type");
    }

}

// Removes extra display/visibility css that we placed on elements using hideScreen - should default to what's written in the stylesheet
function showScreen(elements){
    elements.forEach((e) => {
        e.style.display = ``;
        e.style.visibility = ``;
    });
}

function clearActiveMobileButtons(){
    mobileButtons.forEach((mb) => {
        mb.classList.remove("mobile-selected");
    });
}

mobileHomeButton.addEventListener("click", function(){
    hideScreen([peopleDisplay, clickDisplay, mobileOptionsDisplay], `display`);
    moneyButtonDisplay.style.display = "flex";
    messageLog.style.display = "block";
    clearActiveMobileButtons();
    this.classList.add("mobile-selected");
});

mobileEffectsButton.addEventListener("click", function(){
    hideScreen([peopleDisplay, mobileOptionsDisplay, moneyButtonDisplay, messageLog], `display`);
    clickDisplay.style.display = "block";
    clearActiveMobileButtons();
    this.classList.add("mobile-selected");
});

mobilePeopleButton.addEventListener("click", function(){
    hideScreen([mobileOptionsDisplay, moneyButtonDisplay, messageLog, clickDisplay], `display`);
    peopleDisplay.style.display = "block";
    clearActiveMobileButtons();
    this.classList.add("mobile-selected");
});

mobileOptionsButton.addEventListener("click", function(){
    hideScreen([peopleDisplay, clickDisplay, moneyButtonDisplay, messageLog], `display`);
    mobileOptionsDisplay.style.display = "flex";
    clearActiveMobileButtons();
    this.classList.add("mobile-selected");
});

// Add notifications class to mobile buttons
function addMobileNotification(button){
    if(!button.classList.contains("mobile-selected")){
        button.classList.add("mobile-notification");
    }
}


let permanentState = {
    baseClickStrength: 0.01,
    bobValue: 0.01,
    aliceValue: 0.01,
    autocloneMultiplier: 1,
    clickBoostMax: 1,
    hiringFairMax: 10,
    internValue: 0.01,
    misterEValue: 1e-5,
    money: 1e12,
    totalMoneySpent: 0,
    firstPrestige: false,
    endgameUpgradeCounter: 0,
    darkMode: false,
    maxActiveEffects: 2
}

const endgameRewardsInitialValues = {
    baseClickStrength: 0.5,
    bobValue: 2,
    aliceValue: 2,
    internValue: 2,
    clickBoostMax: 1,
    hiringFairMax: 5,
    autocloneMultiplier: 1,
    money: 1000,
    increaseUpgrades: 2
}

let endgameRewards = [
    {
        name: `Click Strength`,
        text: `Increase your Click Strength`,
        available: true,
        value: 0.99,
        stateKey: `baseClickStrength`,
        getUpgrade(original){
            return original + this.value;
        },
        applyUpgrade(){
            permanentState.baseClickStrength = this.getUpgrade(permanentState.baseClickStrength);
            this.available = false;
            permanentState.endgameUpgradeCounter++;
        }
    },
    {
        name: `Bob Spending`,
        text: `Increase spending per Bob`,
        available: true,
        value: 10,
        stateKey: `bobValue`,
        getUpgrade(original){
            return original * this.value;
        },
        applyUpgrade(){
            permanentState.bobValue = this.getUpgrade(permanentState.bobValue);
            this.available = false;
            permanentState.endgameUpgradeCounter++;
        }
    },
    {
        name: `Alice Multiplier`,
        text: `Increase Alice Multiplier`,
        available: true,
        value: 2,
        stateKey: `aliceValue`,
        getUpgrade(original){
            return original * this.value;
        },
        applyUpgrade(){
            permanentState.aliceValue = this.getUpgrade(permanentState.aliceValue);
            this.available = false;
            permanentState.endgameUpgradeCounter++;
        }
    },
    {
        name: `Intern Multiplier`,
        text: `Increase Intern Multiplier`,
        available: true,
        value: 10,
        stateKey: `internValue`,
        getUpgrade(original){
            return original * this.value;
        },
        applyUpgrade(){
            permanentState.internValue = this.getUpgrade(permanentState.internValue);
            this.available = false;
            permanentState.endgameUpgradeCounter++;
        }
    },
    {
        name: `Click Boost Maximum`,
        text: `Raise Click Boost Maximum`,
        available: true,
        value: 1,
        stateKey: `clickBoostMax`,
        getUpgrade(original){
            return original + this. value;
        },
        applyUpgrade(){
            permanentState.clickBoostMax = this.getUpgrade(permanentState.clickBoostMax);
            this.available = false;
            permanentState.endgameUpgradeCounter++;
        }
    },
    {
        name: `Hiring Fair Maximum`,
        text: `Raise Hiring Fair Maximum`,
        available: true,
        value: 5,
        stateKey: `hiringFairMax`,
        getUpgrade(original){
            return original + this.value;
        },
        applyUpgrade(){
            permanentState.hiringFairMax = this.getUpgrade(permanentState.hiringFairMax);
            this.available = false;
            permanentState.endgameUpgradeCounter++;
        }
    },
    {
        name: `Autocloner Production`,
        text: `Increase Autocloner Production`,
        available: true,
        value: 1,
        stateKey: `autocloneMultiplier`,
        getUpgrade(original){
            return original + this.value;
        },
        applyUpgrade(){
            permanentState.autocloneMultiplier = this.getUpgrade(permanentState.autocloneMultiplier);
            this.available = false;
            permanentState.endgameUpgradeCounter++;
        }
    },
    {
        name: `Double or Nothing`,
        text: ``,
        available: false,
        value: 2,
        stateKey: `increaseUpgrades`,
        getUpgrade(original){
            return original * this.value;
        },
        applyUpgrade(){
            endgameRewards.forEach((r) => {
                if(!r.available){
                    r.available = true;
                    r.value *= this.value;
                }
            });
            this.value += 2;
            this.available = false;
            permanentState.misterEValue *= 2;
            permanentState.endgameUpgradeCounter = 0;
        }
    },
    {
        name: `Increase Starting Money`,
        text: `Going up...`,
        extraText: `Note: Pressing reset during a run will reset your starting money back to 1 trillion`,
        available: true,
        value: 1000,
        stateKey: `money`,
        getUpgrade(original){
            return original * this.value;
        },
        applyUpgrade(){
            permanentState.money = this.getUpgrade(permanentState.money);
        }
    }
];

// Creating endgame permanent upgrade options
function endgameUpgradeScreen(){
    document.querySelector(".endgame-upgrades-text").textContent = `Choose a permanent upgrade`;
    let cancelButton = document.createElement("button");
    cancelButton.textContent = `Nevermind`;
    cancelButton.classList.add("endgame-modal-button");
    cancelButton.addEventListener("click", () => {
        eventModal.close();
    });

    if(permanentState.endgameUpgradeCounter === 7){
        endgameRewards[7].available = true;
    }

    // Clear out the buttons if there are any
    while(endgameUpgradesButtons.firstChild){
        endgameUpgradesButtons.removeChild(endgameUpgradesButtons.firstChild);
    }

    // Loop over our endgame rewards and create a button that opens a yes/no modal
    endgameRewards.forEach((reward) => {
        if(reward.available){
            let b = document.createElement("button");
            let b2 = document.createElement("button");
            let topText = document.createElement("div");
            let upgradeText = document.createElement("div");
            topText.textContent = reward.text;

            if(reward.stateKey === `money`){
                upgradeText.textContent = formatMoney(permanentState[reward.stateKey], 1e12) + " to " + formatMoney(reward.getUpgrade(permanentState[reward.stateKey]), 1e12);
                upgradeText.append(document.createElement("br"),document.createTextNode(reward.extraText));
                b.classList.add("endgame-increase-money-button");
            } else if(reward.name === `Double or Nothing`){
                topText.textContent = `All permanent upgrades get multiplied by ${reward.value}, and will become available again. Mr E sacrifices are twice as effective. This upgrade's value increases by 2`;
            } else {
                upgradeText.textContent = permanentState[reward.stateKey] + " to " + reward.getUpgrade(permanentState[reward.stateKey]);
            }

            b.textContent = reward.name;
            b.classList.add("endgame-upgrades-button");

            b2.textContent = `Okay`;
            b2.classList.add("endgame-modal-button");
            b2.addEventListener("click", () => {
                reward.applyUpgrade();
                eventModal.close();
                endgameUpgrades.hidden = true;
                endGame();
            });

            b.addEventListener("click", function(){
                eventModal.textContent = ``;
                eventModal.append(topText, document.createElement("br"), upgradeText, b2, cancelButton);
                eventModal.showModal();
            });

            endgameUpgradesButtons.append(b);
        }
    });

    endgameUpgrades.hidden = false;
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
            moneyText: false
        },
        events: {
            firstEvent: false,
            secondEvent: false,
            automation: false
        },
        killInterns: false,
        clickPercent: 0,
        roundButtons: false,
        activeEffects: 0
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
        {condition: 1, text: "You've spent 1 dollar"},
        {condition: 50, text: "Your clicks sure aren't doing much, are they?"},
        {condition: 75, text: "Let's boost your click power a bit (also applies to cloning)"},
        {condition: 300, text: "This is Alice. She helps Bob spend more."},
        {condition: 400, text: "Of course, we can clone her too"},
        {condition: 1000, text: "You've spent 1,000 dollars"},
        {condition: 12000, text: "Wouldn't it be better if you didn't have to click at all?"},
        {condition: 20000, text: "Introducing: autocloning (note: you can only have one effect active at a time)"},
        {condition: 2e5, text: "You can hire some interns to run the autocloner"},
        {condition: 1e6, text: "You've spent 1 million dollars"},
        {condition: 1.5e6, text: "Host a job fair to get more interns (increases the longer you leave it activated)"},
        {condition: 50e6, text: "There's a new preacher in town, and his name is Mr. E. He spreads the word of death, and each sacrifice seems to make him stronger..."},
        {condition: 1e9, text: "A billion dollars spent and gone"},
        {condition: 1e11, text: "Money makes the world go round..."},
        {condition: 1e12, text: "1 trillion dollars. But not enough yet"}
    ];

    people = {
        bob: new Person(0, "Bob", 1, 0.50, 0.70),
        alice: new Person(0, "Alice", 1, 300, 400),
        intern: new Person(permanentState.internValue, "Interns", 0, 2e5, null),
        misterE: new Person(0, "Mr E", permanentState.misterEValue, 50e6, null)
    };

    activateButtonsStatus = [0,0,0,0];

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
        autocloneBob: {
            removeUpgrade(){
                autocloneObject.bobAmount = 0;
                autocloneObject.autocloneBobActivated = false;
                activateButtons.autocloneBob.activated = false;
            },
            cost: 20000,
            activated: false
        },
        autocloneAlice: {
            removeUpgrade(){
                autocloneObject.aliceAmount = 0;
                autocloneObject.autocloneAliceActivated = false;
                activateButtons.autocloneAlice.activated = false;
            },
            cost: 20000,
            activated: false
        },
        hiring: {
            removeUpgrade(){
                hiringFair.timer = 0;
                hiringFair.amount = 1;
                hiringFair.activated = false;
                activateButtons.hiring.activated = false;
                document.getElementById("hiringFairText").textContent = `Job Fair`;
            },
            cost: 1.5e6,
            activated: false
        }
    };

    hiringFair = {
        activated: false,
        timer: 0,
        amount: 1
    };

    autocloneObject = {
        unlockedAutocloning: false,
        autocloneBobActivated: false,
        autocloneAliceActivated: false,
        bobAmount: 0,
        aliceAmount: 0,
        multiplier: 1
    };

    firstRandomEvents = [
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
            chance: 0.2,
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
            chance: 0.2,
            name: `Economy Collapses!`,
            buttonText: `Hooray!`,
            flavorText: `The stock market crashes. Billionaires everywhere cry out in agony. Their time has come.`,
            effectText: ``,
            effect(){
                let amount = state.spentMoney*100*Math.random();
                decreaseMoney(amount);
                this.effectText = `Money decreased by ${formatMoney(amount, 1e12)}`;
            }
        },
        {
            chance: 0.2,
            name: `Money Everywhere!`,
            buttonText: `Noooo`,
            flavorText: `Business is booming! The money printers are working overtime to keep up. More money!`,
            effectText: ``,
            effect(){
                let amount = state.spentMoney * 0.3 * Math.random();
                state.money += amount;
                this.effectText = `Money increased by ${formatMoney(amount, 1e12)}`;
            }
        },
        {
            chance: 0.2,
            name: `Age of Automation`,
            buttonText: `Even clicking this button is hard`,
            flavorText: `We have all come to appreciate the benefits of the autocloner. Our hands, once cramped, can now
            rest. In fact, they've rested so much that we're not sure how to use them anymore. The autocloner doesn't mind.
            It just works harder.`,
            effectText: `Autocloner production doubled, cannot manually clone`,
            effect(){
                autocloneObject.multiplier *= 2;
                state.events.automation = true;
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
    ];

    secondRandomEvents = [
        {
            chance: 0.3,
            name: `New Religion`,
            buttonText: `I love Mr E!`,
            flavorText: `The people love Mr E. Or, wait, why do we love Mr E? We love Mr E! We can't wait to be sacrificed!`,
            effectText: `Future sacrifices to Mr E are twice as effective`,
            effect(){
                people.misterE.amount *= 2;
            }
        },
        {
            chance: 0.3,
            name: `Copy of a Copy of a`,
            buttonText: `I'm sure it's fine!`,
            flavorText: `An intern comes up with a bright idea. Instead of cloning the original Bob and Alice, why not just clone the clones? 
            The new clones come out a little...weird...but we can make a lot of them!`,
            effectText: `Autocloner production x10, Bob and Alice efficiency decreased by 90%`,
            effect(){
                people.bob.value *= 0.10;
                people.alice.value *= 0.10;
                autocloneObject.multiplier *= 10;
            }
        },
        {
            chance: 0.3,
            name: `Aesthetic Era`,
            buttonText: `Ran out of ideas for events, huh?`,
            flavorText: `You need a change. A new look. A new you. So you pop over to the store. A few minutes later 
            you've somehow been talked into buying new buttons.`,
            effectText: `Buttons are round now`,
            effect(){
                state.roundButtons = true;
                let buttons = document.querySelectorAll("button");
                for(i of buttons){
                    i.classList.add("button-round");
                }
            }
        },
        {
            chance: 0.1,
            name: `Getting Closer`,
            buttonText: `I won't`,
            flavorText: `You can see it now. Getting closer. Money ticking down. Don't give up.`,
            effectText: `All production doubled`,
            effect(){
                people.bob.value *= 2;
                people.alice.value *= 2;
                people.intern.value *= 2;
                autocloneObject.multiplier *= 2;
            }
        }
    ];

    moneyButton.addEventListener("click", manualSpend);
    moneyButton.textContent = `Spend`;
    
    for(i=0; i<mobileButtons.length; i++){
        mobileButtons[i].classList.remove("mobile-notification");
    }

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
    while(endgameUpgradesButtons.firstChild){
        endgameUpgradesButtons.removeChild(endgameUpgradesButtons.firstChild);
    }

    for(i of document.querySelectorAll("button")){
        i.classList.remove("button-round");
    }

    document.querySelector(".endgame-upgrades-text").textContent = ``;
    endgameUpgrades.hidden = true;

    gameOverDisplay.hidden = true;
    gameOverDisplay.classList.remove("fade-in");
    moneyDisplay.classList.remove("shrink-out");
    eventModal.textContent = ``;
    document.querySelector(".game-over-text").textContent = ``;
    showScreen([moneyButton, peopleDisplay, clickDisplay, messageLog, moneyContainer]);
}

// Dark mode
function toggleDarkMode(){
    if(!permanentState.darkMode){
        root.style.setProperty("--button-background-color", `rgb(48, 37, 37)`);
        root.style.setProperty("--button-color", `rgb(187, 187, 186)`);
        root.style.setProperty("--button-background-hover", `rgb(160, 160, 160)`);
        root.style.setProperty("--button-hover-color", `rgb(42, 81, 1)`);
        root.style.setProperty("--button-disabled-color", `rgb(41, 70, 9)`);
        root.style.setProperty("--button-disabled-background", `rgb(162, 163, 151)`);
        permanentState.darkMode = true;
        darkModeButton.textContent = "Light Mode";
    } else {
        root.style.setProperty("--button-background-color", `rgb(226, 230, 193)`);
        root.style.setProperty("--button-color", `rgb(46, 36, 1)`);
        root.style.setProperty("--button-background-hover", `rgb(185, 188, 158)`);
        root.style.setProperty("--button-hover-color", `rgb(56, 105, 3)`);
        root.style.setProperty("--button-disabled-color", `rgb(176, 245, 102)`);
        root.style.setProperty("--button-disabled-background", `rgb(103, 105, 88)`);
        permanentState.darkMode = false;
        darkModeButton.textContent = "Dark Mode";
    }
    document.body.classList.toggle("dark-mode");
    clickDisplay.classList.toggle("border-dark");
    peopleDisplay.classList.toggle("border-dark");
    document.querySelectorAll(".modal-popup").forEach((e) => {
        e.classList.toggle("dark-modal");
    });
}

// Add dark mode function to our desktop and mobile dark mode buttons
darkModeButton.addEventListener("click", toggleDarkMode);

mobileDarkModeButton.addEventListener("click", function(){
    if(this.textContent === "Dark Mode"){
        this.textContent = "Light Mode";
    } else {
        this.textContent = "Dark Mode";
    }
    toggleDarkMode();
});

// Reset buttons
document.getElementById("reset").addEventListener("click", () => {
    restartConfirmModal.showModal();
});

mobileResetButton.addEventListener("click", () => {
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

// Restart Game
document.getElementById("restartYes").addEventListener("click", () => {
    restartConfirmModal.close();
    restartRun();
});

// Resets state and display but does not change permanent state (besides starting money reset)
function restartRun(){
    permanentState.money = 1e12;
    endgameRewards[8].value = 1000;
    initializeGame();
    resetDisplay();
    saveGame();
    startModal.showModal();
}

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
            sacrifice([people.bob.amount-1, people.alice.amount-1, people.intern.amount]);
        });
        return sb;
    }
}

function decreaseMoney(amount){
    state.money -= amount;
    state.spentMoney += amount;
}

// Mister E sacrifice calculation
function sacrifice(peopleArray){
    let total = 0;
    for(i=0; i < peopleArray.length; i++){
        total += peopleArray[i];
    }
    
    let expIncrease = total * people.misterE.amount;
    people.misterE.value += expIncrease;
    people.bob.amount = 1;
    people.alice.amount = 1;
    people.intern.amount = 0;
    document.getElementById(people.misterE.name).textContent = `${people.misterE.name}: Multiply spending by e^${people.misterE.value.toFixed(4)}`;
}

// Formatting money - if money is above cap, format with scientific notation
function formatMoney(amount, cap){
    if(amount <= cap){
        return numberFormat1.format(amount);
    } else {
        return `$` + numberFormat2.format(amount);
    }
}

function formatPeople(amount, cap){
    if(amount <= cap){
        return numberFormat3.format(amount);
    } else {
        return numberFormat2.format(amount);
    }
}

function updateDisplay(){
    moneyDisplay.textContent = formatMoney(state.money, 1e12);
    if(messages.length > 0 && round(state.spentMoney) >= messages[0].condition){
        let m = document.createElement("div");
        m.textContent = messages[0].text;
        m.classList.add("message");
        m.classList.add("fade-in");
        messages.shift();
        messageLog.prepend(m);
        addMobileNotification(mobileHomeButton);
    }
    document.querySelectorAll(".message").forEach((element) => {
        if(element.offsetTop > 550){
            element.remove();
        }
    });

    if(state.unlocks.hasBob){
        document.getElementById(people.bob.name).textContent = `${formatPeople(people.bob.amount, 1e6)} ${people.bob.name}s: Spending ${formatMoney(people.bob.value*people.bob.amount, 10000)} per second`;
    }

    if(state.unlocks.hasAlice){
        document.getElementById(people.alice.name).textContent = `${formatPeople(people.alice.amount, 1e6)} ${people.alice.name}s: Multiply spending by ${(1+people.alice.value*people.alice.amount).toFixed(2)}`;
    }

    if(state.unlocks.hasInterns){
        document.getElementById(people.intern.name).textContent = `${people.intern.name}: Multiply autocloning by ${(1+people.intern.amount*people.intern.value).toFixed(2)}`;
    }
}

function updateState(dt){
    if(!state.unlocks.hasBob && round(state.spentMoney) >= people.bob.cost){
        people.bob.value = permanentState.bobValue;
        peopleDisplay.append(people.bob.createElement(`${people.bob.name}: Spending ${formatMoney(people.bob.value*people.bob.amount, 10000)} per second`));
        state.unlocks.hasBob = true;
        addMobileNotification(mobilePeopleButton);
    }

    if(!state.unlocks.hasBobClone && round(state.spentMoney) >= people.bob.cloneCost){
        peopleDisplay.append(people.bob.createCloneButton("Clone"));
        state.unlocks.hasBobClone = true;
        addMobileNotification(mobilePeopleButton);
        if(state.events.automation){
            document.querySelectorAll(".clone-button")[0].disabled = true;
        }
    }

    if(!state.unlocks.hasAlice && round(state.spentMoney) >= people.alice.cost){
        people.alice.value = permanentState.aliceValue;
        peopleDisplay.append(people.alice.createElement(`${people.alice.name}: Multiply spending by ${1 + people.alice.value*people.alice.amount}`));
        state.unlocks.hasAlice = true;
        addMobileNotification(mobilePeopleButton);
    }

    if(!state.unlocks.hasAliceClone && round(state.spentMoney) >= people.alice.cloneCost){
        peopleDisplay.append(people.alice.createCloneButton("Clone"));
        state.unlocks.hasAliceClone = true;
        addMobileNotification(mobilePeopleButton);
        if(state.events.automation){
            document.querySelectorAll(".clone-button")[1].disabled = true;
        }
    }

    if(!state.unlocks.unlockedClickBoost && round(state.spentMoney) >= activateButtons.clickUpgrade.cost){
        let clickBoost = new ActivateButton("Boost Click Strength", "clickUpgrade", function() {
            if(activateButtons.clickUpgrade.activated){
                activateButtons.clickUpgrade.removeUpgrade();
                this.classList.remove("activate-button-activated");
                activateButtonsStatus[0] = 0;
                this.textContent = "Activate";
                state.activeEffects--;
            } else {
                if(state.activeEffects >= permanentState.maxActiveEffects){
                    console.log(`Cannot have more than ${permanentState.maxActiveEffects} effects active at once`);
                    return;
                }
                state.activeEffects++;
                activateButtons.clickUpgrade.activated = true;
                this.classList.add("activate-button-activated");
                activateButtonsStatus[0] = 1;
                this.textContent = "Deactivate";
            }
        });
        clickDisplay.append(clickBoost.createButton("clickStrengthText"));
        state.unlocks.unlockedClickBoost = true;
        addMobileNotification(mobileEffectsButton);
        if(activateButtonsStatus[0]){
            document.getElementById("clickUpgrade").classList.add("activate-button-activated");
            document.getElementById("clickUpgrade").textContent = "Deactivate";
        }
    }

    if(!autocloneObject.unlockedAutocloning && round(state.spentMoney) >= activateButtons.autocloneBob.cost){
        autocloneObject.unlockedAutocloning = true;

        let autoBob = new ActivateButton("Autoclone Bobs", "autocloneBob", function(){
            if(activateButtons.autocloneBob.activated){
                activateButtons.autocloneBob.removeUpgrade();
                this.classList.remove("activate-button-activated");
                activateButtonsStatus[1] = 0;
                this.textContent = "Activate";
                state.activeEffects--;
            } else {
                if(state.activeEffects >= permanentState.maxActiveEffects){
                    console.log(`Cannot have more than ${permanentState.maxActiveEffects} effects active at once`);
                    return;
                }
                state.activeEffects++;
                activateButtons.autocloneBob.activated = true;
                autocloneObject.autocloneBobActivated = true;
                autocloneObject.bobAmount++;
                this.classList.add("activate-button-activated");
                activateButtonsStatus[1] = 1;
                this.textContent = "Deactivate";
            }
        });
        let autoAlice = new ActivateButton("Autoclone Alices", "autocloneAlice", function(){
            if(activateButtons.autocloneAlice.activated){
                activateButtons.autocloneAlice.removeUpgrade();
                this.classList.remove("activate-button-activated");
                activateButtonsStatus[2] = 0;
                this.textContent = "Activate";
                state.activeEffects--;
            } else {
                if(state.activeEffects >= permanentState.maxActiveEffects){
                    console.log(`Cannot have more than ${permanentState.maxActiveEffects} effects active at once`);
                    return;
                }
                state.activeEffects++;
                activateButtons.autocloneAlice.activated = true;
                autocloneObject.autocloneAliceActivated = true;
                autocloneObject.aliceAmount++;
                this.classList.add("activate-button-activated");
                activateButtonsStatus[2] = 1;
                this.textContent = "Deactivate";
            }
        });
        clickDisplay.append(autoBob.createButton("autocloneBobText"), autoAlice.createButton("autocloneAliceText"));
        addMobileNotification(mobileEffectsButton);
        if(activateButtonsStatus[1]){
            document.getElementById("autocloneBob").classList.add("activate-button-activated");
            document.getElementById("autocloneBob").textContent = "Deactivate";
        }
        if(activateButtonsStatus[2]){
            document.getElementById("autocloneAlice").classList.add("activate-button-activated");
            document.getElementById("autocloneAlice").textContent = "Deactivate";
        }
    }

    if(!state.unlocks.hasInterns && round(state.spentMoney) >= people.intern.cost){
        peopleDisplay.append(people.intern.createElement(`${people.intern.name}: Multiply autocloning by ${1+people.intern.value*people.intern.amount}`));
        peopleDisplay.append(people.intern.createCloneButton("Hire"));
        state.unlocks.hasInterns = true;
        addMobileNotification(mobilePeopleButton);
    }

    if(!state.unlocks.hasHiringFair && round(state.spentMoney) >= activateButtons.hiring.cost){
        state.unlocks.hasHiringFair = true;
        let autoIntern = new ActivateButton("Job Fair", "hiring", function(){
            if(activateButtons.hiring.activated){
                activateButtons.hiring.removeUpgrade();
                this.classList.remove("activate-button-activated");
                activateButtonsStatus[3] = 0;
                this.textContent = "Activate";
                state.activeEffects--;
            } else {
                if(state.activeEffects >= permanentState.maxActiveEffects){
                    console.log(`Cannot have more than ${permanentState.maxActiveEffects} effects active at once`);
                    return;
                }
                state.activeEffects++;
                document.getElementById("hiringFairText").textContent = `${hiringFair.amount} interns / s`;
                activateButtons.hiring.activated = true;
                hiringFair.activated = true;
                autocloneObject.aliceAmount++;
                this.classList.add("activate-button-activated");
                activateButtonsStatus[3] = 1;
                this.textContent = "Deactivate";
            }
        });
        clickDisplay.append(autoIntern.createButton("hiringFairText"));
        addMobileNotification(mobileEffectsButton);
        if(activateButtonsStatus[3]){
            document.getElementById("hiring").classList.add("activate-button-activated");
            document.getElementById("hiring").textContent = "Deactivate";
        }
    }

    // Million dollar random event
    if(!state.events.firstEvent && round(state.spentMoney) >= 1e6){
        let event = chooseRandomEvent(firstRandomEvents);
        createRandomEvent(event);
        eventModal.showModal();
        state.events.firstEvent = true;
    }

    // Unlocking Mr E
    if(!state.unlocks.hasMisterE && round(state.spentMoney) >= people.misterE.cost){
        peopleDisplay.append(people.misterE.createElement(`${people.misterE.name}: Multiply spending by e^${people.misterE.value.toFixed(4)}`));
        peopleDisplay.append(people.misterE.createSacrificeButton("Sacrifice"));
        state.unlocks.hasMisterE = true;
        addMobileNotification(mobilePeopleButton);
    }

    // Billion dollar random event
    if(!state.events.secondEvent && round(state.spentMoney) >= 1e9){
        let event = chooseRandomEvent(secondRandomEvents);
        createRandomEvent(event);
        eventModal.showModal();
        state.events.secondEvent = true;
    }

    // Change money button text
    if(!state.unlocks.moneyText && round(state.spentMoney) >= 1e11){
        moneyButton.textContent = `More`;
        state.unlocks.moneyText = true;
    }

    // Equation determining how much our money decreases per tick
    let decreaseAmount = people.bob.amount * people.bob.value * (1 + people.alice.amount * people.alice.value) * Math.E**(people.misterE.value);

    // Check if game is over
    if(state.money - decreaseAmount/1000*dt <= 0){
        state.paused = true;
        state.money = 0.01;
        updateDisplay();
        hideScreen([peopleDisplay, clickDisplay, messageLog], `visibility`);
        moneyButton.removeEventListener("click", manualSpend);
        moneyButton.addEventListener("click", function lastClick(){
            state.money = 0;
            updateDisplay();
            hideScreen([moneyButton], `visibility`);
            moneyDisplay.classList.add("shrink-out");
            setTimeout(() => {
                hideScreen([peopleDisplay, clickDisplay, messageLog, moneyButton, moneyContainer], `display`);
                endgameUpgradeScreen();
                console.log("Ending game");
            },5000);
            this.removeEventListener("click", lastClick);
        });
        return;
    }

    decreaseMoney(decreaseAmount/1000 * dt);

    // Add interest if hard mode is active
    if(state.hardMode){
        state.money = compoundInterest(state.money, 0.05, dt/1000/25);
    }

    if(autocloneObject.autocloneBobActivated || autocloneObject.autocloneAliceActivated){
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



// Take an array of strings corresponding to effects we want to disable
function undoActivateEffects(){
    const buttons = document.querySelectorAll(".activate-button");
    for(i of buttons){
        if(i.classList.contains("activate-button-activated")){
            activateButtons[i.id].removeUpgrade();
            i.classList.remove("activate-button-activated");
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

// Picks a random event from an given array of objects
function chooseRandomEvent(eventArray){
    let randNum = Math.random();
    console.log(randNum);
    let event = undefined;

    // Choosing an event based on their weighted probabilities
    for(i of eventArray){
        if(randNum < i.chance){
            event = i;
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
    if(state.roundButtons){
        exitButton.classList.add("button-round");
    }

    mainText.append(titleText);
    mainText.append(document.createElement("br"));
    mainText.append(flavdiv);
    mainText.append(document.createElement("br"));
    mainText.append(effdiv);

    eventModal.append(mainText, exitButton);
    messageLog.prepend(titleText.textContent + `: ` + effdiv.textContent);
}

// Creates game over text and handles end of game states (hard mode or normal)
function endGame(){
    permanentState.totalMoneySpent += state.spentMoney;

    // Endgame Text
    let t1 = document.createTextNode(`You find yourself here again. Or is this the first time?`);
    let t2 = document.createTextNode(`Mr E stares at the pile of money you've spent.`);
    let t3 = document.createTextNode(`"More," he says, "I need more".`);
    let spendText = document.createTextNode(`You have spent a total of ${formatMoney(permanentState.totalMoneySpent, 1e12)}`);
    let thoughtText = document.createElement("div");
    thoughtText.textContent = `I spent a trillion dollars, how much more could he want?`;
    thoughtText.classList.add("thought-text");

    document.querySelector(".game-over-text").append(t1,document.createElement("br"),t2,document.createElement("br"),t3,document.createElement("br"),spendText, document.createElement("br"), thoughtText);

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

// Playtesting functions: devMode unlocks everything, trueReset clears all variables including permanent upgrades
function devMode(){
    people.bob.cost = 0, people.bob.cloneCost = 0;
    people.alice.cost = 0, people.alice.cloneCost = 0;
    people.intern.cost = 0;
    people.misterE.cost = 0;
    activateButtons.clickUpgrade.cost = 0;
    activateButtons.autocloneBob.cost = 0;
    activateButtons.hiring.cost = 0;
}

// Save and Load functions using JSON and localStorage
function saveGame(){
    localStorage.clear();

    // Save the endgame rewards state
    let endgameRewardsValues = [];
    endgameRewards.forEach((reward) => {
        let data = {
            value: reward.value,
            available: reward.available
        };
        endgameRewardsValues.push(data);
    });

    let save = {
        state: state,
        messages: messages,
        people: people,
        activateButtons: activateButtons,
        permanentState: permanentState,
        endgameRewardsValues: endgameRewardsValues,
        autocloneObject: autocloneObject,
        hiringFair: hiringFair,
        activateButtonsStatus: activateButtonsStatus
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
        activateButtons[ab].activated = save.activateButtons[ab].activated;
    }

    autocloneObject = save.autocloneObject;
    autocloneObject.unlockedAutocloning = false;
    hiringFair = save.hiringFair;

    activateButtonsStatus = save.activateButtonsStatus;

    for(i in state.unlocks){
        state.unlocks[i] = false;
    }

    for(i=0; i<endgameRewards.length; i++){
        endgameRewards[i].value = save.endgameRewardsValues[i].value;
        endgameRewards[i].available = save.endgameRewardsValues[i].available;
    }

    if(permanentState.darkMode){
        permanentState.darkMode = false;
        toggleDarkMode();
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