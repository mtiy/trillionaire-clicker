let state;
let messages;
let people;
let activateButtons;
let hiringFair;
let autocloneObject;
let firstRandomEvents;
let secondRandomEvents;
let activateButtonsStatus;
let internUpgrades;

// Used for formatting our money
const numberFormat1 = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
const numberFormat2 = new Intl.NumberFormat("en-US", {notation: "scientific", minimumFractionDigits: "8", maximumFractionDigits:"8"});
const numberFormat3 = new Intl.NumberFormat("en-US", {maximumFractionDigits:"0"});
const numberFormat4 = new Intl.NumberFormat("en-US", {notation: "scientific"});
const numberFormat5 = new Intl.NumberFormat("en-US", {notation: "scientific", maximumFractionDigits:"2"});

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
const importModal = document.getElementById("importModal");
const statsScreenButton = document.getElementById("stats-screen");
const mobileStatsButton = document.getElementById("mobile-stats-screen");
const statsModal = document.getElementById("stats-modal");
const extraNotifications = document.querySelector(".extra-notifications");
const internUpgradeModal = document.getElementById("intern-upgrades-modal");
const internUpgradeContainer = document.getElementById("intern-upgrades-buttons");

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

const thoughts = [
    `I spent a trillion dollars, how much more could he want?`,
    `What are we even spending this money on?`
];

let permanentState = {
    baseClickStrength: 1,
    bobValue: 0.01,
    bobMax: 5000,
    bobLow: 4000,
    aliceValue: 0.01,
    aliceMax: 5000,
    aliceLow: 4000,
    autocloneMultiplier: 1,
    autocloneMax: 10,
    clickBoostMax: 10,
    hiringFairMax: 10,
    internValue: 0.01,
    misterEValue: 1e-5,
    sacrificeAmount: 1,
    money: 1e12,
    totalMoneySpent: 0,
    darkMode: false,
    maxActiveEffects: 1,
    totalProgress: 0
};

let coin = {
    flip(){
        let result = Math.random();
        if(result < 0.5){
            return `heads`;
        } else {
            return `tails`;
        }
    },
    animate(){
        eventModal.textContent = ``;
        let coinDisplay = document.createElement("div");
        coinDisplay.classList.add("coin");
        coinDisplay.textContent = `—`;
        eventModal.append(coinDisplay);
        coinDisplay.classList.add("flipping");
    },
    createResultText(matches){
        let b = createButton(`Continue`, `endgame-modal-button`);
        let t;
        eventModal.textContent = ``;
        b.addEventListener("click", () => {
            eventModal.close();
        });
        if(matches){
            t = createUpgradeText(`Your guess is correct! The stranger smiles at you. You feel lucky.`, `All stats doubled (except Mr. E value).`, ``);

        } else {
            t = createUpgradeText(`Your guess is wrong! The stranger shakes his head. Better luck next time.`, `All stats halved (except Mr. E value).`, ``);
        }
        eventModal.append(t, b);
    }
};

// New object, goal is to hold all our upgrade tiers and relevant info
const upgrades = {
    tier1: {
        clickStrength: {
            available: true,
            increase: 49,
            buttonText: `Click Strength`,
            displayText: `Click Strength is the value you get per click. It determines how much you spend, clone, and hire.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Current: ${permanentState.baseClickStrength}`, `Upgraded: ${permanentState.baseClickStrength + this.increase}`);
                return t;
            },
            applyEffect(){
                permanentState.baseClickStrength += this.increase;
                this.available = false;
            }
        },
        bobUpgrade: {
            available: true,
            increase: 0.09,
            buttonText: `Bob Spending`,
            displayText: `Bob Spending is how much each Bob spends per second.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Current: ${permanentState.bobValue.toFixed(2)}`, `Upgraded: ${(permanentState.bobValue + this.increase).toFixed(2)}`);
                return t;
            },
            applyEffect(){
                permanentState.bobValue += this.increase;
                this.available = false;
            }
        },
        autoclonerProduction: {
            available: true,
            increase: 9,
            buttonText: `Autocloner Production`,
            displayText: `Autocloner Production is how many clones the autocloner creates per second.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Current: ${permanentState.autocloneMultiplier}`, `Upgraded: ${permanentState.autocloneMultiplier + 9}`);
                return t;
            },
            applyEffect(){
                permanentState.autocloneMultiplier += this.increase;
                this.available = false;
            }
        },
        hardModeReward: {
            available: false,
            increase: 2,
            buttonText: `Hard Mode Reward`,
            displayText: `Mr. E is impressed. Not everyone has what it takes to do the hard thing. But someone has to do it.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Sacrifices to Mr. E are twice as effective (this reward can only be taken once per money level).`, ``);
                return t;
            },
            applyEffect(){
                permanentState.misterEValue *= this.increase;
                this.available = false;
            }
        },
        flipCoin: {
            available: true,
            increase: null,
            buttonText: `A Stranger`,
            displayText: `A strange man approaches you. He holds out a coin. "Call it," he says. You sense a lot is on the line.`,
            createText(){
                let t = document.createElement("p");
                t.textContent = this.displayText;
                return t;
            },
            applyEffect(choice){
                let result = coin.flip();
                if(result === choice){
                    multiplyAllPermanentStats(2);
                } else {
                    multiplyAllPermanentStats(0.5);
                }
                coin.animate();
                setTimeout(() => {
                    coin.createResultText(result === choice);
                    endGame();
                }, 7000);
            }
        },
        theJob: {
            available: true,
            increase: null,
            buttonText: `The Job`,
            displayText: `There's nothing wrong with taking the safe option. You put your head down, do your work, and see the results. It could be more, but it can't be less, and that makes you happy.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Slight increase to all stats`, `(Except Mr. E value)`);
                return t;
            },
            applyEffect(){
                addAllPermanentStats(0.02, 1);
            }
        },
        increaseMoney: {
            available: true,
            increase: 1e3,
            buttonText: `Increase Money`,
            displayText: `Increase your starting money to access new upgrades. You can press reset at any time to go back to 1 trillion.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Current: ${numberFormat4.format(permanentState.money)}`, `Upgraded: ${numberFormat4.format(permanentState.money*1000)}`);
                return t;
            },
            applyEffect(){
                permanentState.money *= 1000;
                this.available = false;
                upgrades.tierLevel = `tier2`;
            }
        }
    },
    tier2: {
        hiringFairMax: {
            available: true,
            increase: 100,
            buttonText: `Hiring Fair Max`,
            displayText: `Hiring Fair Max is the maximum interns per second the hiring fair can hire when fully charged.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Current: ${permanentState.hiringFairMax}`, `Upgraded: ${permanentState.hiringFairMax + this.increase}`);
                return t;
            },
            applyEffect(){
                permanentState.hiringFairMax += this.increase;
                this.available = false;
            }
        },
        clickBoostMax: {
            available: true,
            increase: 100,
            buttonText: `Click Boost Max`,
            displayText: `Click Boost Max is the maximum click strength the click boost upgrade will go to.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Current: ${permanentState.clickBoostMax}`, `Upgraded: ${permanentState.clickBoostMax + this.increase}`);
                return t;
            },
            applyEffect(){
                permanentState.clickBoostMax += this.increase;
                this.available = false;
            }
        },
        effectsMax: {
            available: true,
            increase: 1,
            buttonText: `Active Effects Max`,
            displayText: `Isn't it annoying only activating one effect at a time? Well, now you can activate two!`,
            createText(){
                let t = createUpgradeText(this.displayText, `Can have two effects active at once`, ``);
                return t;
            },
            applyEffect(){
                permanentState.maxActiveEffects += this.increase;
                this.available = false;
            }
        },
        hardModeReward: {
            available: false,
            increase: 2,
            buttonText: `Hard Mode Reward`,
            displayText: `Mr. E is impressed. Not everyone has what it takes to do the hard thing. But someone has to do it.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Sacrifices to Mr. E are twice as effective (this reward can only be taken once per money level).`, ``);
                return t;
            },
            applyEffect(){
                permanentState.misterEValue *= this.increase;
                this.available = false;
            }
        },
        increaseMoney: {
            available: true,
            increase: 1e85,
            buttonText: `Increase Money`,
            displayText: `Increase your starting money to access new upgrades. You can press reset at any time to go back to 1 trillion.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Current: ${numberFormat4.format(permanentState.money)}`, `Upgraded: ${numberFormat4.format(permanentState.money*this.increase)}`);
                return t;
            },
            applyEffect(){
                permanentState.money *= this.increase;
                this.available = false;
                upgrades.tierLevel = `tier3`;
            }
        }
    },
    tier3: {
        increaseMoney: {
            available: true,
            increase: 1e200,
            buttonText: `Increase Money`,
            displayText: `This is currently the end of playable content. No guarantee that anything happens from here on out.`,
            createText(){
                let t = createUpgradeText(this.displayText, `Current: ${numberFormat4.format(permanentState.money)}`, `Upgraded: ${numberFormat4.format(permanentState.money*this.increase)}`);
                return t;
            },
            applyEffect(){
                permanentState.money *= this.increase;
                this.available = false;
            }
        }
    },
    tierLevel: `tier1`
}

function multiplyAllPermanentStats(value){
    permanentState.baseClickStrength *= value;
    permanentState.bobValue *= value;
    permanentState.aliceValue *= value;
    permanentState.autocloneMultiplier *= value;
    permanentState.clickBoostMax *= value;
    permanentState.hiringFairMax *= value;
    permanentState.internValue *= value;
}

function addAllPermanentStats(decimal, integer){
    permanentState.baseClickStrength += integer;
    permanentState.bobValue += decimal;
    permanentState.aliceValue += decimal;
    permanentState.autocloneMultiplier += integer;
    permanentState.clickBoostMax += integer;
    permanentState.hiringFairMax += integer;
    permanentState.internValue += decimal;
}

function handleEndgameRewards(){
    // Clear out the buttons if there are any
    while(endgameUpgradesButtons.firstChild){
        endgameUpgradesButtons.removeChild(endgameUpgradesButtons.firstChild);
    }

    document.querySelector(".endgame-upgrades-text").textContent = `Choose one permanent upgrade`;

    // Start by navigating to the object based on current tier
    let tier = upgrades[upgrades.tierLevel];

    // Loop through the tier, create the elements we need and append to the upgrade area
    for(u in tier){
        if(tier[u].available){
            let upgradeBtn = createUpgrade(tier[u], u);
            endgameUpgradesButtons.append(upgradeBtn);
        }
    }

    // Show our rewards
    endgameUpgrades.hidden = false;
}

function createUpgrade(upgradeObj, key){
    // Create our buttons
    [cancelButton, chooseButton, headsButton, tailsButton] = createUpgradeButtons();
    let upgradeBtn = createButton(upgradeObj.buttonText, `endgame-upgrades-button`);
    let div = document.createElement("div");

    // Text is displayed in the popup
    let text = upgradeObj.createText();
    div.append(text);
    div.append(document.createElement("br"));

    cancelButton.addEventListener("click", () => {eventModal.close()});

    if(key === `flipCoin`){
        headsButton.addEventListener("click", function(){
            upgradeObj.applyEffect(`heads`);
            endgameUpgrades.hidden = true;
        });
        tailsButton.addEventListener("click", function(){
            upgradeObj.applyEffect(`tails`);
            endgameUpgrades.hidden = true;
        });
        div.append(headsButton, tailsButton);
        upgradeBtn.classList.add("endgame-coin-button");
    } else {
        chooseButton.addEventListener("click", function(){
            upgradeObj.applyEffect();
            eventModal.close();
            endgameUpgrades.hidden = true;
            endGame();
        });
        div.append(chooseButton);
    }

    // Add some special styling for certain upgrades
    if(key === `increaseMoney`){
        upgradeBtn.classList.add("endgame-increase-money-button");
    }

    if(key === `hardModeReward`){
        upgradeBtn.classList.add("endgame-hard-mode-reward");
    }

    if(key === `theJob`){
        upgradeBtn.classList.add("endgame-job-button");
    }

    div.append(cancelButton);

    upgradeBtn.addEventListener("click", function(){
        eventModal.textContent = ``;
        eventModal.append(div);
        eventModal.showModal();
    });

    return upgradeBtn;
}

function createUpgradeButtons(){
    let cancelButton = createButton("Go Back", "endgame-modal-button");
    let chooseButton = createButton("Choose", "endgame-modal-button");
    let headsButton = createButton("Heads", "endgame-modal-button");
    let tailsButton = createButton("Tails", "endgame-modal-button");

    
    return [cancelButton, chooseButton, headsButton, tailsButton];
}

function createButton(text, style){
    let b = document.createElement("button");
    b.textContent = text;
    b.classList.add(style);
    return b;
}

// Text that is displayed when you click an endgame upgrade
// main, current, upgraded are strings, repeatable is true/false
function createUpgradeText(main, current, upgraded, repeatable){
    let text = document.createElement("div");
    let mainText = document.createElement("p");
    mainText.textContent = main;
    let upgradeText = document.createElement("p");
    let c = document.createTextNode(current);
    let u = document.createTextNode(upgraded);
    upgradeText.append(current, document.createElement("br"), upgraded);
    text.append(mainText, upgradeText);
    return text;
}

statsScreenButton.addEventListener("click", displayStats);
mobileStatsButton.addEventListener("click", displayStats);

function displayStats(){
    statsModal.textContent = ``;
    let content = getStats([
        {name: "Click Strength", value: permanentState.baseClickStrength},
        {name: "Bob Value", value: permanentState.bobValue},
        {name: "Alice Value", value: permanentState.aliceValue},
        {name: "Intern Value", value: permanentState.internValue},
        {name: "Autocloner Multiplier", value: permanentState.autocloneMultiplier},
        {name: "Click Boost Max", value: permanentState.clickBoostMax},
        {name: "Hiring Fair Max", value: permanentState.hiringFairMax},
        {name: "Mr. E Value (per sacrifice)", value: permanentState.misterEValue},
        {name: "Starting Money", value: numberFormat4.format(permanentState.money)},
        {name: "Max Active Effects", value: permanentState.maxActiveEffects}
    ]);
    let closeButton = createButton(`Close`, `modal-button`);
    closeButton.addEventListener("click", () => statsModal.close());
    statsModal.append(content, closeButton);
    statsModal.showModal();
}

// Pass in an array of objects with names and values to display ex. [{name: "Click Strength", value: 0.01}]
function getStats(stats){
    let c = document.createElement("div");
    for(i of stats){
        let d = document.createElement("div");
        d.textContent = `${i.name}: ${i.value}`;
        d.classList.add("stats-line");
        c.append(d);
    }
    return c;
}

let tutorial = {
    level: 0
};

// For the first run, guide the player to each unlock and display goals at the top
function tutorialGoals(){
    if(tutorial.level === 0){
        extraNotifications.textContent = `Press Spend`;
        if(state.money < 1e12) tutorial.level = 1;
    }
    if(tutorial.level === 1){
        extraNotifications.textContent = `Spend $1`;
        if(state.unlocks.hasBobClone) tutorial.level = 2;
    }
    if(tutorial.level === 2){
        extraNotifications.textContent = `Clone Bobs ${formatPeople(people.bob.amount, 10000)}/10`;
        if(!tutorial.bobMessage){
            let msg = createMessage(`You can clone Bob to speed things up.`);
            messageLog.prepend(msg);
            tutorial.bobMessage = true;
        }
        if(people.bob.amount >= 10) tutorial.level = 3;
    }
    if(tutorial.level === 3){
        extraNotifications.textContent = `Clone Bobs ${formatPeople(people.bob.amount, 10000)}/100`;
        if(!tutorial.clickBoostMessage){
            let msg = createMessage(`Your clicks aren't doing much, are they? Boosting your click strength should help.`);
            messageLog.prepend(msg);
            tutorial.clickBoostMessage = true;
        }
        if(people.bob.amount >= 100) tutorial.level = 4;
    }
    if(tutorial.level === 4){
        extraNotifications.textContent = `Clone Alices ${formatPeople(people.alice.amount, 10000)}/100`;
        if(!tutorial.aliceMessage){
            let msg = createMessage("This is Alice. She multiplies Bob's spending. Of course, you can clone her too.");
            messageLog.prepend(msg);
            tutorial.aliceMessage = true;
        }
        if(people.alice.amount >= 100) tutorial.level = 5;
    }
    if(tutorial.level === 5){
        extraNotifications.textContent = `Total Clones ${formatPeople(people.bob.total() + people.alice.total(), 10000)}/2,500`;
        if(!tutorial.autocloneMessage){
            let msg = createMessage(`You find a dusty piece of equipment in the basement. Faded letters on its side say "Autocloner".`);
            messageLog.prepend(msg);
            tutorial.autocloneMessage = true;
        }
        if((people.alice.total() + people.bob.total()) >= 2500) tutorial.level = 6;
    }
    if(tutorial.level === 6){
        extraNotifications.textContent = `Reach the "Sweet Spot"`;
        if(!tutorial.sweetSpotMessage){
            let msg = createMessage(`You might have noticed a maximum for the clones. Go past that and efficiency drops dramatically. But right before the max is a SWEET SPOT, where you get a boost to productivity.`);
            messageLog.prepend(msg);
            tutorial.sweetSpotMessage = true;
        }
        if((people.bob.total() > people.bob.lowAmount) || (people.alice.total() > people.alice.lowAmount)) tutorial.level = 7;
    }
    if(tutorial.level === 7){
        extraNotifications.textContent = `Assign interns to projects 5 times`;
    }
}

// Creates a message element to be appended to the message log
function createMessage(text){
    let m = document.createElement("div");
    m.textContent = text;
    m.classList.add("message");
    m.classList.add("fade-in");
    return m;
}

// Initialize all states and conditions for the purpose of starting a new game
function initializeGame(){
    state = {
        money: permanentState.money,
        spentMoney: 0,
        clickStrength: permanentState.baseClickStrength,
        baseClickStrength: permanentState.baseClickStrength,
        clickBoostMax: permanentState.clickBoostMax,
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
            automation: false,
            bloodMoon: {unlocked: false, used: false},
            dontClick: false
        },
        killInterns: false,
        hiringFairMax: permanentState.hiringFairMax,
        autocloneMax: permanentState.autocloneMax,
        clickPercent: 0,
        roundButtons: false,
        activeEffects: 0,
        maxActiveEffects: permanentState.maxActiveEffects,
        autoSacrifice: false,
        internModalOpen: false
    };

    messages = firstRunMessages;

    people = {
        bob: new Person(0, "Bob", 1, 0.01, 1, 0, permanentState.bobMax, permanentState.bobLow),
        alice: new Person(0, "Alice", 1, 300, 400, 0, permanentState.aliceMax, permanentState.aliceLow),
        intern: new Person(permanentState.internValue, "Interns", 0, 2e5),
        misterE: new Person(0, "Mr E", permanentState.misterEValue, 50e6)
    };

    activateButtonsStatus = [0,0,0,0,0];

    activateButtons = {
        clickUpgrade: {
            removeUpgrade(){
                activateButtons.clickUpgrade.activated = false;
                activateButtons.clickUpgrade.decrease = true;
                activateButtons.clickUpgrade.timer = 0;
            },
            cost: 10,
            timer: 0,
            activated: false,
            decrease: false
        },
        autocloneBob: {
            removeUpgrade(){
                autocloneObject.autocloneBobActivated = false;
                activateButtons.autocloneBob.activated = false;
                activateButtons.autocloneBob.decrease = true;
            },
            cost: 100,
            activated: false,
            decrease: false
        },
        autocloneAlice: {
            removeUpgrade(){
                autocloneObject.autocloneAliceActivated = false;
                activateButtons.autocloneAlice.activated = false;
                activateButtons.autocloneAlice.decrease = true;
            },
            cost: 100,
            activated: false,
            decrease: false
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
        },
        sacrifice: {
            removeUpgrade(){
                state.autoSacrifice = false;
                activateButtons.sacrifice.timer = 0;
                activateButtons.sacrifice.activated = false;
            },
            cost: 50e6,
            activated: false,
            timer: 0
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
        bobAmount: 1,
        bobTimer: 0,
        aliceTimer: 0,
        aliceAmount: 1,
        multiplier: permanentState.autocloneMultiplier
    };

    firstRandomEvents = [
        {
            chance: 0.25,
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
            chance: 0.25,
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
            chance: 0.25,
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
            chance: 0.25,
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
            chance: 0.33,
            name: `Blood Moon`,
            buttonText: `Spooky`,
            flavorText: `The Blood Moon rises over the waste land. Mr. E walks outside and stares up at it. He must offer a good sacrifice.`,
            effectText: `Next sacrifice is 100 times stronger, no more sacrifices after that.`,
            effect(){
                state.events.bloodMoon.unlocked = true;
            }
        },
        {
            chance: 0.34,
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
            chance: 0.33,
            name: `Don't Click`,
            buttonText: `Does this count? That's not fair!`,
            flavorText: `Here's a thought: what if you don't click. What if the longer you don't click, the stronger your next click is? I knew you'd love it.`,
            effectText: `Click Strength increases continuously, clicking resets it.`,
            effect(){
                state.events.dontClick = true;
                extraNotifications.style.visibility = `visible`;
            }
        }
    ];

    internUpgrades = [
        new InternUpgrade({amount: 0, base: 10, growth: 1.15}, {buttonId:`internCloneUpgrade`, title: `Coffee Run`, body: `+20% clone productivity`}, () => {
            people.bob.value *= 1.2;
            people.alice.value *= 1.2;
        }),
        new InternUpgrade({amount: 0, base: 10, growth: 1.17}, {buttonId: `internClickUpgrade`, title: `Company Gym`, body: `+1 click boost max`}, () => {
            state.clickBoostMax += 1;
        }),
        new InternUpgrade({amount: 0, base: 10, growth: 1.14}, {buttonId: `internBobMaxUpgrade`, title: `Shoppers`, body: `+10% bob maximum`}, () => {
            people.bob.maxAmount *= 1.1;
            people.bob.lowAmount *= 1.1;
            people.bob.addFromOverMax();
            document.getElementById("BobButton").textContent = `Clone | Max: ${people.bob.maxAmount}`;
        }),
        new InternUpgrade({amount: 0, base: 10, growth: 1.14}, {buttonId: `internAliceMaxUpgrade`, title: `Analyze Spreadsheets`, body: `+10% alice maximum`}, () => {
            people.alice.maxAmount *= 1.1;
            people.bob.lowAmount *= 1.1;
            people.alice.addFromOverMax();
            document.getElementById("AliceButton").textContent = `Clone | Max: ${people.alice.maxAmount}`;
        })
    ];

    createInternUpgrades(internUpgrades);

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
    upgrades.tierLevel = `tier1`;
    upgrades.tier1.increaseMoney.available = true;
    upgrades.tier2.increaseMoney.available = true;
    initializeGame();
    resetDisplay();
    saveGame();
    startModal.showModal();
}

// For playtesting right now, fully resets game
function mobileFullReset(){
    localStorage.removeItem("trillionaireClickerSave");
    window.location.reload();
}

document.getElementById("mobile-full-reset").addEventListener("click", mobileFullReset);

document.getElementById("restartNo").addEventListener("click", () => {
    restartConfirmModal.close();
});

class Person{
    constructor(value, name, amount, cost, cloneCost, overMax, maxAmount, lowAmount){
        this.value = value;
        this.name = name;
        this.amount = amount;
        this.cost = cost;
        this.cloneCost = cloneCost;
        this.overMax = overMax;
        this.maxAmount = maxAmount;
        this.lowAmount = lowAmount;
        this.sweetSpot = false;
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
        cb.textContent = buttonText + ` | Max: ${formatPeople(this.maxAmount,1e5)}`;
        cb.id = this.name + "Button";
        cb.addEventListener("click", () => {
            this.clone(state.clickStrength);
        });
        cb.classList.add("clone-button");
        return cb;
    }

    createHireButton(buttonText){
        let cb = document.createElement("button");
        cb.textContent = buttonText;
        cb.addEventListener("click", () => {
            this.amount += state.clickStrength;
        });
        cb.classList.add("clone-button");
        return cb;
    }

    createAssignButton(buttonText){
        let ab = createButton(buttonText, `clone-button`);
        ab.addEventListener("click", () => {
            internUpgradeModal.showModal();
            state.internModalOpen = true;
        });
        return ab;
    }

    createSacrificeButton(buttonText){
        let sb = document.createElement("button");
        sb.textContent = buttonText;
        sb.classList.add("clone-button");
        sb.addEventListener("click", function(){
            if(state.events.bloodMoon.unlocked){
                sacrifice([(people.bob.amount*100)-1, (people.alice.amount*100)-1, (people.intern.amount*100)]);
                this.disabled = true;
                state.events.bloodMoon.used = true;
            } else {
                sacrifice([people.bob.amount-1, people.alice.amount-1, people.intern.amount]);
            }
        });
        if(state.events.bloodMoon.used) sb.disabled = true;
        return sb;
    }

    // Handles increases to clone count for Bob/Alice
    clone(toIncrease){
        if((this.amount + toIncrease) < this.maxAmount){
            this.amount += toIncrease;
            return;
        }
        if(this.amount === this.maxAmount){
            this.overMax += toIncrease;
            return;
        }
        if((this.amount + toIncrease) >= this.maxAmount){
            let diff = this.amount + toIncrease - this.maxAmount;
            this.amount = this.maxAmount;
            this.overMax += diff;
            return;
        }
    }

    // In the case where we increase the max and had some overmax, move them over to amount
    addFromOverMax(){
        let diff = this.maxAmount - this.amount;
        if(this.overMax >= diff){
            this.overMax -= diff;
            this.amount += diff;
        } else {
            this.amount += this.overMax;
            this.overMax = 0;
        }
    }

    // Up to a fixed maximum clones produce at 100% efficiency, 10% after max, with a sweet spot that has x100 boost
    calculate(){
        let total = this.amount * this.value + this.overMax * this.value * 0.1;
        if(this.lowAmount <= (this.amount + this.overMax) && (this.amount + this.overMax) <= this.maxAmount){
            total *= 10;
            if(!this.sweetSpot){
                this.sweetSpot = true;
                document.getElementById(this.name).classList.add("clone-sweet-spot");
            }
        } else {
            if(this.sweetSpot){
                this.sweetSpot = false;
                document.getElementById(this.name).classList.remove("clone-sweet-spot");
            }
        }
        return total;
    }

    total(){
        return this.amount + this.overMax;
    }
}

// Handle intern upgrade data storage/calculations
class InternUpgrade{
    constructor(data={amount, base, growth}, textObj={buttonId, title, body}, effect){
        this.amount = data.amount;
        this.base = data.base;
        this.growth = data.growth;
        this.text = textObj;
        this.cost = this.getNewCost();
        this.effect = effect;
    }

    getNewCost(){
        return Math.floor(this.base * (this.growth**this.amount));
    }

    createButton(){
        let b = document.createElement("button");
        b.classList.add("intern-modal-button");
        b.id = this.text.buttonId;
        let topText = document.createElement("div");
        topText.textContent = this.text.title;
        let middleText = document.createElement("div");
        middleText.textContent = this.text.body;
        let bottomText = document.createElement("div");
        bottomText.textContent = `Cost: ` + this.cost;
        bottomText.id = this.text.buttonId + `Cost`;
        b.append(topText, middleText, bottomText);
        return b;
    }
}

// Fill out intern upgrade modal, called in initializeGame
function createInternUpgrades(upgradeArray){
    upgradeArray.forEach((upgrade) => {
        let button = upgrade.createButton();
        button.addEventListener("click", () => {
            if(people.intern.amount >= upgrade.cost){
                upgrade.effect();
                people.intern.amount -= upgrade.cost;
                upgrade.amount++;
                upgrade.cost = upgrade.getNewCost();
                document.getElementById(upgrade.text.buttonId + `Cost`).textContent = `Cost: ` + upgrade.cost;
            } else {
                console.log("Not Enough Interns");
            }
        });
        internUpgradeContainer.append(button);
    });
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

// Auto Sacrifice: sacrifices 1 person per second from each person category, does not do it if at minimum
function autoSacrifice(dt){
    if(activateButtons.sacrifice.timer + dt >= 1000){
        activateButtons.sacrifice.timer = 0;
        let total = 0;
        if((people.bob.negAmount - permanentState.sacrificeAmount) >= 0){
            people.bob.negAmount -= permanentState.sacrificeAmount;
            total += permanentState.sacrificeAmount;
        } else if((people.bob.amount - permanentState.sacrificeAmount) >= 1){
            people.bob.amount -= permanentState.sacrificeAmount;
            total += permanentState.sacrificeAmount;
        }
        if((people.alice.negAmount - permanentState.sacrificeAmount) >= 0){
            people.alice.negAmount -= permanentState.sacrificeAmount;
            total += permanentState.sacrificeAmount;
        } else if((people.alice.amount - permanentState.sacrificeAmount) >= 1){
            people.alice.amount -= permanentState.sacrificeAmount;
            total += permanentState.sacrificeAmount;
        }
        if((people.intern.amount - permanentState.sacrificeAmount) >= 0){
            people.intern.amount -= permanentState.sacrificeAmount;
            total += permanentState.sacrificeAmount;
        }
        people.bob.amount = Math.round(people.bob.amount);
        people.bob.negAmount = Math.round(people.bob.negAmount);
        people.alice.amount = Math.round(people.alice.amount);
        people.alice.negAmount = Math.round(people.alice.negAmount);
        people.intern.amount = Math.round(people.intern.amount);
        people.misterE.value += (total * 1e-4);
    } else {
        activateButtons.sacrifice.timer += dt;
    }

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
        return numberFormat5.format(amount);
    }
}

function updateDisplay(){
    moneyDisplay.textContent = formatMoney(state.money, 1e12);
    if(messages.length > 0 && round(state.spentMoney) >= messages[0].condition){
        let m = createMessage(messages[0].text);
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
        document.getElementById(people.bob.name).textContent = `${formatPeople(people.bob.amount + people.bob.overMax, 1e4)} ${people.bob.name}s: Spending ${formatMoney(people.bob.calculate(), 10000)} per second`;
    }

    if(state.unlocks.hasAlice){
        document.getElementById(people.alice.name).textContent = `${formatPeople(people.alice.amount + people.alice.overMax, 1e6)} ${people.alice.name}s: Multiply spending by ${(1+people.alice.calculate()).toFixed(2)}`;
    }

    if(state.unlocks.hasInterns){
        document.getElementById(people.intern.name).textContent = `${formatPeople(people.intern.amount, 1e6)} ${people.intern.name}`;
    }

    if(state.events.dontClick){
        extraNotifications.textContent = `Click Strength: ${state.clickStrength.toFixed(2)}`;
    }

    if(state.autoSacrifice){
        document.getElementById(people.misterE.name).textContent = `${people.misterE.name}: Multiply spending by e^${people.misterE.value.toFixed(4)}`;
    }

    if(state.internModalOpen){
        for(i of internUpgrades){
            if(people.intern.amount >= i.cost){
                document.getElementById(i.text.buttonId).disabled = false;
            } else {
                document.getElementById(i.text.buttonId).disabled = true;
            }
        }
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

    if(!state.unlocks.hasAlice && people.bob.amount >= 100){
        people.alice.value = permanentState.aliceValue;
        peopleDisplay.append(people.alice.createElement(`${people.alice.name}: Multiply spending by ${1 + people.alice.value*people.alice.amount}`));
        state.unlocks.hasAlice = true;
        addMobileNotification(mobilePeopleButton);
    }

    if(!state.unlocks.hasAliceClone && people.bob.amount >= 100){
        peopleDisplay.append(people.alice.createCloneButton("Clone"));
        state.unlocks.hasAliceClone = true;
        addMobileNotification(mobilePeopleButton);
        if(state.events.automation){
            document.querySelectorAll(".clone-button")[1].disabled = true;
        }
    }

    if(!state.unlocks.unlockedClickBoost && people.bob.amount >= activateButtons.clickUpgrade.cost){
        let clickBoost = new ActivateButton("Boost Click Strength", "clickUpgrade", function() {
            if(activateButtons.clickUpgrade.activated){
                activateButtons.clickUpgrade.removeUpgrade();
                this.classList.remove("activate-button-activated");
                activateButtonsStatus[0] = 0;
                this.textContent = "Activate";
                state.activeEffects--;
            } else {
                if(state.activeEffects >= state.maxActiveEffects){
                    console.log(`Cannot have more than ${state.maxActiveEffects} effects active at once`);
                    return;
                }
                state.activeEffects++;
                activateButtons.clickUpgrade.activated = true;
                activateButtons.clickUpgrade.decrease = false;
                this.classList.add("activate-button-activated");
                activateButtonsStatus[0] = 1;
                this.textContent = "Deactivate";
                document.getElementById("clickStrengthText").textContent = `Click Strength: ${state.clickStrength.toFixed()} / ${state.clickBoostMax}`;
            }
        });
        clickDisplay.append(clickBoost.createButton("clickStrengthText"));
        state.unlocks.unlockedClickBoost = true;
        addMobileNotification(mobileEffectsButton);
        if(activateButtonsStatus[0]){
            document.getElementById("clickUpgrade").classList.add("activate-button-activated");
            document.getElementById("clickUpgrade").textContent = "Deactivate";
            document.getElementById("clickStrengthText").textContent = `Click Strength: ${state.clickStrength.toFixed()} / ${state.clickBoostMax}`;
        }
    }

    if(!autocloneObject.unlockedAutocloning && people.alice.amount >= 100){
        autocloneObject.unlockedAutocloning = true;

        let autoBob = new ActivateButton("Autoclone Bobs", "autocloneBob", function(){
            if(activateButtons.autocloneBob.activated){
                activateButtons.autocloneBob.removeUpgrade();
                this.classList.remove("activate-button-activated");
                activateButtonsStatus[1] = 0;
                this.textContent = "Activate";
                state.activeEffects--;
            } else {
                if(state.activeEffects >= state.maxActiveEffects){
                    console.log(`Cannot have more than ${state.maxActiveEffects} effects active at once`);
                    return;
                }
                state.activeEffects++;
                activateButtons.autocloneBob.activated = true;
                activateButtons.autocloneBob.decrease = false;
                autocloneObject.autocloneBobActivated = true;
                this.classList.add("activate-button-activated");
                activateButtonsStatus[1] = 1;
                this.textContent = "Deactivate";
                document.getElementById("autocloneBobText").textContent = `${autocloneObject.bobAmount} Bobs / s`;
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
                if(state.activeEffects >= state.maxActiveEffects){
                    console.log(`Cannot have more than ${state.maxActiveEffects} effects active at once`);
                    return;
                }
                state.activeEffects++;
                activateButtons.autocloneAlice.activated = true;
                activateButtons.autocloneAlice.decrease = false;
                autocloneObject.autocloneAliceActivated = true;
                this.classList.add("activate-button-activated");
                activateButtonsStatus[2] = 1;
                this.textContent = "Deactivate";
                document.getElementById("autocloneAliceText").textContent = `${autocloneObject.aliceAmount} Alices / s`;
            }
        });
        clickDisplay.append(autoBob.createButton("autocloneBobText"), autoAlice.createButton("autocloneAliceText"));
        addMobileNotification(mobileEffectsButton);
        if(activateButtonsStatus[1]){
            document.getElementById("autocloneBob").classList.add("activate-button-activated");
            document.getElementById("autocloneBob").textContent = "Deactivate";
            document.getElementById("autocloneBobText").textContent = `${autocloneObject.bobAmount} Bobs / s`;
        }
        if(activateButtonsStatus[2]){
            document.getElementById("autocloneAlice").classList.add("activate-button-activated");
            document.getElementById("autocloneAlice").textContent = "Deactivate";
            document.getElementById("autocloneAliceText").textContent = `${autocloneObject.aliceAmount} Alices / s`;
        }
    }

    if(!state.unlocks.hasInterns && ((people.bob.total() > people.bob.lowAmount) || (people.alice.total() > people.alice.lowAmount))){
        peopleDisplay.append(people.intern.createElement(`${people.intern.amount} ${people.intern.name}`));
        peopleDisplay.append(people.intern.createHireButton("Hire"));
        peopleDisplay.append(people.intern.createAssignButton("Assign"));
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
                if(state.activeEffects >= state.maxActiveEffects){
                    console.log(`Cannot have more than ${state.maxActiveEffects} effects active at once`);
                    return;
                }
                state.activeEffects++;
                document.getElementById("hiringFairText").textContent = `${hiringFair.amount} interns / s`;
                activateButtons.hiring.activated = true;
                hiringFair.activated = true;
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

    // First random event
    if(!state.events.firstEvent && round(state.spentMoney) >= (permanentState.money*1e-6)){
        let event = chooseRandomEvent(firstRandomEvents);
        createRandomEvent(event);
        eventModal.showModal();
        state.events.firstEvent = true;
    }

    // Unlocking Mr E
    if(!state.unlocks.hasMisterE && round(state.spentMoney) >= people.misterE.cost){
        let autoSacrifice = new ActivateButton("Sacrifice", "sacrificeButton", function(){
            if(activateButtons.sacrifice.activated){
                activateButtons.sacrifice.removeUpgrade();
                this.classList.remove("activate-button-activated");
                activateButtonsStatus[4] = 0;
                this.textContent = "Activate";
                state.activeEffects--;
            } else {
                if(state.activeEffects >= state.maxActiveEffects){
                    console.log(`NOPE`);
                    return;
                }
                state.activeEffects++;
                this.classList.add("activate-button-activated");
                activateButtonsStatus[4] = 1;
                this.textContent = "Deactivate";
                activateButtons.sacrifice.activated = true;
                state.autoSacrifice = true;
            }
        });
        peopleDisplay.append(people.misterE.createElement(`${people.misterE.name}: Multiply spending by e^${people.misterE.value.toFixed(4)}`));
        state.unlocks.hasMisterE = true;
        clickDisplay.append(autoSacrifice.createButton("sacrificeText"));
        addMobileNotification(mobilePeopleButton);
        if(activateButtonsStatus[4]){
            document.getElementById("sacrificeButton").classList.add("activate-button-activated");
            document.getElementById("sacrificeButton").textContent = "Deactivate";
        }
    }

    // Second random event
    if(!state.events.secondEvent && round(state.spentMoney) >= (permanentState.money*1e-3)){
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

    // Equation determining how much our money decreases per tick: y = bob x alice x e^mister E value
    let decreaseAmount = people.bob.calculate() * (1 + people.alice.calculate()) * Math.E**(people.misterE.value);

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
                handleEndgameRewards();
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

    if(activateButtons.autocloneBob.activated){
        autocloneBob(dt, 1);
    }

    if(activateButtons.autocloneBob.decrease){
        autocloneBob(dt, -1)
    }

    if(activateButtons.autocloneAlice.activated){
        autocloneAlice(dt, 1);
    }

    if(activateButtons.autocloneAlice.decrease){
        autocloneAlice(dt, -1);
    }

    if(hiringFair.activated){
        hireInterns(dt);
    }

    if(activateButtons.clickUpgrade.activated){
        boostClickPower(dt, 1);
    }

    if(activateButtons.clickUpgrade.decrease){
        boostClickPower(dt, -1);
    }

    if(state.events.dontClick){
        linearClickStrengthIncrease(dt);
    }

    if(state.killInterns && people.intern.amount > 0){
        people.intern.amount -= 1/1000 * dt;
        if(people.intern.amount < 0){
            people.intern.amount = 0;
        }
    }

    if(state.autoSacrifice){
        autoSacrifice(dt);
    }

    if(totalTime - lastSave >= 5000){
        saveGame();
        lastSave = totalTime;
        console.log("Game Saved!");
    }

    if(permanentState.totalProgress === 0){
        tutorialGoals();
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

// Two separate functions for bob/alice autocloning with decay, yeah it could prob be better whatever
function autocloneBob(dt, sign){
    autocloneObject.bobTimer += dt;
    if(autocloneObject.bobAmount >= state.autocloneMax){
        document.getElementById("autocloneBobText").textContent = `${autocloneObject.bobAmount} Bobs / s - max`;
    }
    if(autocloneObject.bobAmount <= state.autocloneMax && autocloneObject.bobAmount >= 1 && (autocloneObject.bobTimer >= 6000)){
        autocloneObject.bobAmount += state.autocloneMax/10*sign;
        autocloneObject.bobTimer = 0;
        if(autocloneObject.bobAmount >= state.autocloneMax){
            autocloneObject.bobAmount = state.autocloneMax;
        }
        if(autocloneObject.bobAmount < 1){
            activateButtons.autocloneBob.decrease = false;
            autocloneObject.bobAmount = 1;
            document.getElementById("autocloneBobText").textContent = `Autoclone Bobs`;
            return;
        }
        document.getElementById("autocloneBobText").textContent = `${autocloneObject.bobAmount} Bobs / s`;
    }
    people.bob.clone(autocloneObject.bobAmount/1000 * dt * (1+people.intern.amount*people.intern.value));
}

function autocloneAlice(dt, sign){
    autocloneObject.aliceTimer += dt;
    if(autocloneObject.aliceAmount >= state.autocloneMax){
        document.getElementById("autocloneAliceText").textContent = `${autocloneObject.aliceAmount} Alices / s - max`;
    }
    if(autocloneObject.aliceAmount <= state.autocloneMax && autocloneObject.aliceAmount >= 1 && (autocloneObject.aliceTimer >= 6000)){
        autocloneObject.aliceAmount += state.autocloneMax/10*sign;
        autocloneObject.aliceTimer = 0;
        if(autocloneObject.aliceAmount >= state.autocloneMax){
            autocloneObject.aliceAmount = state.autocloneMax;
        }
        if(autocloneObject.aliceAmount < 1){
            activateButtons.autocloneAlice.decrease = false;
            autocloneObject.aliceAmount = 1;
            document.getElementById("autocloneAliceText").textContent = `Autoclone Alices`;
            return;
        }
        document.getElementById("autocloneAliceText").textContent = `${autocloneObject.aliceAmount} Alices / s`;
    }
    people.alice.clone(autocloneObject.aliceAmount/1000 * dt * (1+people.intern.amount*people.intern.value));
}

// Increase rate of hiring interns to a maximum over 1 minute
function hireInterns(dt){
    hiringFair.timer += dt;
    if(hiringFair.amount >= state.hiringFairMax){
        document.getElementById("hiringFairText").textContent = `${hiringFair.amount} interns / s - max`;
    }
    if(hiringFair.amount < state.hiringFairMax && (hiringFair.timer >= 6000)){
        hiringFair.amount += state.hiringFairMax/10;
        hiringFair.timer = 0;
        if(hiringFair.amount >= state.hiringFairMax){
            hiringFair.amount = state.hiringFairMax;
            document.getElementById("hiringFairText").textContent = `${hiringFair.amount} interns / s - max`;
        } else {
            document.getElementById("hiringFairText").textContent = `${hiringFair.amount} interns / s`;
        }
    }
    people.intern.amount += hiringFair.amount/1000 * dt;
}

// Boost click strength to a maximum over 1 minute
function boostClickPower(dt, sign){
    activateButtons.clickUpgrade.timer += dt;
    if(state.clickStrength <= state.clickBoostMax && state.clickStrength >= state.baseClickStrength && (activateButtons.clickUpgrade.timer >= 6000)){
        state.clickStrength += state.clickBoostMax/10*sign;
        activateButtons.clickUpgrade.timer = 0;
        if(state.clickStrength > state.clickBoostMax){
            state.clickStrength = state.clickBoostMax;
        }
        if(state.clickStrength < state.baseClickStrength){
            activateButtons.clickUpgrade.decrease = false;
            state.clickStrength = state.baseClickStrength;
            document.getElementById("clickStrengthText").textContent = `Boost Click Strength`;
            return;
        }
        document.getElementById("clickStrengthText").textContent = `Click Strength: ${state.clickStrength.toFixed()} / ${state.clickBoostMax}`;
    }
}

// For the Don't Click event, just increases click strength indefinitely. Strength reset is handled in the window event listener below
function linearClickStrengthIncrease(dt){
    state.clickStrength += 0.1/1000 * dt;
}

// For future "Don't click Event"
window.addEventListener("click", () => {
    if(state.events.dontClick){
        state.clickStrength = 0;
    }
});

function round(s){
    return Math.floor(s*100)/100;
}

// Continuous compound interest - p: principal, r: rate (years), t: time step (years)
function compoundInterest(p, r, t){
    return p*Math.E**(r*t);
}

// Happens when you click the big spend button
function manualSpend(){
    if(state.paused) state.paused = false;
    state.money -= (state.clickStrength/100 + state.money*state.clickPercent);
    state.spentMoney += (state.clickStrength/100 + state.money*state.clickPercent);
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

    let eventMessage = document.createElement("div");
    eventMessage.classList.add("message");
    eventMessage.classList.add("fade-in");
    eventMessage.textContent = titleText.textContent + `: ` + effdiv.textContent;

    eventModal.append(mainText, exitButton);
    messageLog.prepend(eventMessage);
}

// Creates game over text and handles end of game states (hard mode or normal)
function endGame(){
    permanentState.totalMoneySpent += state.spentMoney;
    permanentState.totalProgress++;

    let text = createEndgameText();
    for(i of text){
        document.querySelector(".game-over-text").append(i);
    }

    let unlockText = getUnlock(permanentState.totalProgress);
    if(unlockText){
        let div = document.createElement("div");
        div.classList.add("unlock-text");
        div.textContent = unlockText;
        document.querySelector(".game-over-text").append(div);
    }

    let buttons = createReplayButtons();

    for(i of buttons){
        endgameButtons.append(i);
    }
    
    gameOverDisplay.hidden = false;
    gameOverDisplay.classList.add("fade-in");
}

// Endgame text is always the same, except for thoughts and unlocks that appear as you complete runs
function createEndgameText(){
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let p4 = document.createElement("p");
    let p5 = document.createElement("p");
    p1.textContent = `You find yourself here again. Or is this the first time?`;
    p2.textContent = `Mr. E pulls out another briefcase of money.`;
    p3.textContent = `"More," he says, "We need to spend more."`;
    p4.textContent = `You have spent a total of ${formatMoney(permanentState.totalMoneySpent, 1e12)}`;
    p5.textContent = getThought(permanentState.totalProgress);
    p5.classList.add("thought-text");
    return [p1, p2, p3, p4, p5];
}

// Find the current thought to display based on runs completed
function getThought(runs){
    let index = 0;
    if(runs > 2){
        index = 1;
    }
    return thoughts[index];
}

// Create the play again/hard mode buttons
function createReplayButtons(){
    let playAgain = createButton(`Play Again`, `end-game-button`);
    let playAgainHard = createButton(`Play Again (Hard Mode)`, `end-game-button`);

    playAgain.addEventListener("click", () => {
        initializeGame();
        resetDisplay();
    });

    playAgainHard.addEventListener("click", () => {
        initializeGame();
        resetDisplay();
        state.paused = true;
        lastTime = null;
        state.hardMode = true;
        hardModeModal.showModal(); 
    });

    return [playAgain, playAgainHard];
}

// Give unlocks based on player progress through upgrade tiers
function getUnlock(runs){
    if(runs === 1){
        statsScreenButton.hidden = false;
        mobileStatsButton.hidden = false;
        return `Stats Screen Unlocked`;
    }
}

// Game Loop
let lastTime = null;
let timeStep = 50;
let accumulatedLag = 0;
let totalTime = 0;
let lastSave = 0;
setInterval(function gameLoop(){
    if(state.paused){
        return;
    }
    const currentTime = Date.now();
    if(lastTime === null){
        lastTime = currentTime;
    }
    const deltaTime = currentTime - lastTime;
    totalTime += deltaTime;
    lastTime = currentTime;
    accumulatedLag += deltaTime;

    // If loop has been paused for a minute, switch to different calculation method
    if(deltaTime > 6e4){
        state.paused = true;
        lastTime = null;
        accumulatedLag = 0;
        calculateOfflineProgress(deltaTime/1000);
    } else {
        while(accumulatedLag >= timeStep){
            accumulatedLag -= timeStep;
            updateState(timeStep);
        }
    }
},timeStep);

// Save and Load functions using JSON and localStorage
function saveGame(){
    localStorage.removeItem("trillionaireClickerSave");
    let tier1upgrades = {};
    let tier2upgrades = {};
    for(i in upgrades.tier1){
        tier1upgrades[i] = upgrades.tier1[i].available;
    }
    for(i in upgrades.tier2){
        tier2upgrades[i] = upgrades.tier2[i].available;
    }

    let save = {
        state: state,
        messages: messages,
        people: people,
        activateButtons: activateButtons,
        permanentState: permanentState,
        autocloneObject: autocloneObject,
        hiringFair: hiringFair,
        activateButtonsStatus: activateButtonsStatus,
        tier1upgrades: tier1upgrades,
        tier2upgrades: tier2upgrades,
        tierLevel: upgrades.tierLevel,
        statsButton: statsScreenButton.hidden,
        tutorial: tutorial
    }

    localStorage.setItem("trillionaireClickerSave", JSON.stringify(save));
}

function loadGame(save){
    initializeGame();
    resetDisplay();

    state = save.state;
    messages = save.messages;
    permanentState = save.permanentState;
    let tier1upgrades = save.tier1upgrades;
    let tier2upgrades = save.tier2upgrades;
    let tierLevel = save.tierLevel;
    tutorial = save.tutorial;

    people = {
        bob: new Person(save.people.bob.value, save.people.bob.name, save.people.bob.amount, save.people.bob.cost, save.people.bob.cloneCost, save.people.bob.overMax, save.people.bob.maxAmount, save.people.bob.lowAmount),
        alice: new Person(save.people.alice.value, save.people.alice.name, save.people.alice.amount, save.people.alice.cost, save.people.alice.cloneCost, save.people.alice.overMax, save.people.alice.maxAmount, save.people.alice.lowAmount),
        intern: new Person(save.people.intern.value, save.people.intern.name, save.people.intern.amount, save.people.intern.cost, save.people.intern.cloneCost),
        misterE: new Person(save.people.misterE.value, save.people.misterE.name, save.people.misterE.amount, save.people.misterE.cost, save.people.misterE.cloneCost)
    };

    for(ab in activateButtons){
        activateButtons[ab].cost = save.activateButtons[ab].cost;
        activateButtons[ab].activated = save.activateButtons[ab].activated;
    }

    activateButtons.clickUpgrade.decrease = save.activateButtons.clickUpgrade.decrease;
    activateButtons.autocloneBob.decrease = save.activateButtons.autocloneBob.decrease;
    activateButtons.autocloneAlice.decrease = save.activateButtons.autocloneAlice.decrease;

    autocloneObject = save.autocloneObject;
    autocloneObject.unlockedAutocloning = false;
    hiringFair = save.hiringFair;

    activateButtonsStatus = save.activateButtonsStatus;

    for(i in state.unlocks){
        state.unlocks[i] = false;
    }

    if(permanentState.darkMode){
        permanentState.darkMode = false;
        toggleDarkMode();
    }

    if(!save.statsButton){
        statsScreenButton.hidden = false;
        mobileStatsButton.hidden = false;
    } 

    for(i in tier1upgrades){
        upgrades.tier1[i].available = tier1upgrades[i]; 
    }
    for(i in tier2upgrades){
        upgrades.tier2[i].available = tier2upgrades[i];
    }

    if(tierLevel === undefined) tierLevel = `tier1`;
    upgrades.tierLevel = tierLevel;

    console.log("Game Loaded");
}

// Loads in the game state 
window.onload = (event) => {
    try {
        loadGame(JSON.parse(localStorage.getItem("trillionaireClickerSave")));
    } catch(error){
        console.error(error);
        startModal.showModal();
        initializeGame();
    }
}

// Import and export saves
const importButton = document.getElementById("importSave");
const exportButton = document.getElementById("exportSave");

function exportSave(){
    let save = localStorage.getItem("trillionaireClickerSave");
    document.getElementById("saveInput").value = save;
}

function importSave(){
    try{
        let save = JSON.parse(document.getElementById("saveInput").value);
        loadGame(save);
    } catch (error){
        document.getElementById("saveInput").value = error;
    }

}

exportButton.addEventListener("click", exportSave);
importButton.addEventListener("click", importSave);
document.getElementById("closeInputModal").addEventListener("click", () => {
    importModal.close();
});
document.getElementById("importExport").addEventListener("click", () => {
    importModal.showModal();
});
document.getElementById("mobile-import-export").addEventListener("click", () => {
    importModal.showModal();
});

// Offline Progress: (ripping off Antimatter Dimensions)
// Using a min tick length of 50ms, up to a maximum of 1000 ticks, to simulate offline progress
function calculateOfflineProgress(seconds){
    if(seconds < 0) return;
    const maxTicks = 1000;
    let ticks = Math.floor(seconds*20);
    if(ticks > maxTicks){
        ticks = maxTicks;
    }

    // Loop our update function passing in the tick increments
    // For small times this will be equal to just playing in real time, for large ones
    // It will be less accurate as our ticks could be multiple second deltas
    let delta = seconds/ticks;
    for(i = 0; i < ticks; i++){
        updateState(delta*1000);
    }
    console.log("Offline progress finished calculating");
    state.paused = false;
}

// Dev Tools
const changes = document.querySelectorAll(".dev-input");
const stateButtons = document.querySelectorAll(".dev-perm-button");
const devButtons = document.querySelectorAll(".dev-button");
devButtons[0].addEventListener("click", devMode);
devButtons[1].addEventListener("click", () => {
    localStorage.removeItem("trillionaireClickerSave");
    window.location.reload();
});
devButtons[2].addEventListener("click", () => {
    updateDisplay();
    hideScreen([peopleDisplay, clickDisplay, messageLog, moneyButton, moneyContainer], `display`);
    handleEndgameRewards();
});
devButtons[3].addEventListener("click", () => {
    permanentState.baseClickStrength = parseFloat(changes[0].value);
    permanentState.clickBoostMax = parseFloat(changes[1].value);
    permanentState.bobValue = parseFloat(changes[3].value);
    permanentState.aliceValue = parseFloat(changes[5].value);
    permanentState.internValue = parseFloat(changes[7].value);
    permanentState.autocloneMultiplier = parseFloat(changes[8].value);
    permanentState.maxActiveEffects = parseFloat(changes[9].value);
    permanentState.hiringFairMax = parseFloat(changes[10].value);
});

// unlocks everything
function devMode(){
    people.bob.cost = 0, people.bob.cloneCost = 0;
    people.alice.cost = 0, people.alice.cloneCost = 0;
    people.intern.cost = 0;
    people.misterE.cost = 0;
    activateButtons.clickUpgrade.cost = 0;
    activateButtons.autocloneBob.cost = 0;
    activateButtons.hiring.cost = 0;
}

stateButtons[0].addEventListener("click", () => {state.clickStrength = parseFloat(changes[0].value)});
stateButtons[1].addEventListener("click", () => {state.clickBoostMax = parseFloat(changes[1].value)});
stateButtons[2].addEventListener("click", () => {people.bob.amount = parseFloat(changes[2].value)});
stateButtons[3].addEventListener("click", () => {people.bob.value = parseFloat(changes[3].value)});
stateButtons[4].addEventListener("click", () => {people.alice.amount = parseFloat(changes[4].value)});
stateButtons[5].addEventListener("click", () => {people.alice.value = parseFloat(changes[5].value)});
stateButtons[6].addEventListener("click", () => {people.intern.amount = parseFloat(changes[6].value)});
stateButtons[7].addEventListener("click", () => {people.intern.value = parseFloat(changes[7].value)});
stateButtons[8].addEventListener("click", () => {autocloneObject.multiplier = parseFloat(changes[8].value)});
stateButtons[9].addEventListener("click", () => {state.maxActiveEffects = parseFloat(changes[9].value)});
stateButtons[10].addEventListener("click", () => {state.hiringFairMax = parseFloat(changes[10].value)});