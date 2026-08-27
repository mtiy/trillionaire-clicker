/* 
Storing large amounts of text that we can draw from throughout the game.
Current main focus is storing message arrays that we can switch between throughout the runs.
Can also store upgrade/endgame texts, thoughts, and just general walls of text that we don't want in our main file.
*/

const firstRunMessages = [
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
        {condition: 3, text: "Some advice when it comes to clones."},
        {condition: 5, text: "There is a maximum number of clones that you can be 100% efficient with."},
        {condition: 10, text: "Past the max you get diminishing returns. Too many clones in the kitchen."},
        {condition: 20, text: "But right before you hit the max, there's a SWEET SPOT."},
        {condition: 25, text: "You'll get a huge boost to spending in the sweet spot."},
        {condition: 35, text: "Remember: don't go past the max. Find the sweet spot and stay in it."},
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