/* 
Storing large amounts of text that we can draw from throughout the game.
Current main focus is storing message arrays that we can switch between throughout the runs.
Can also store upgrade/endgame texts, thoughts, and just general walls of text that we don't want in our main file.
*/

const firstRunMessages = [
        {condition: 0.01, text: "This is Bob. He can spend money for you automatically."},
        {condition: 0.3, text: "Wow, this is gonna take forever."},
        {condition: 0.4, text: "But you know, life can be pretty fast."},
        {condition: 0.5, text: "It's important to slow down once in a while. Smell the roses."}
];

const secondRunMessages = [
        {condition: 0, text: `Now the real Trillionaire Clicker begins. Don't worry about unlocking all that stuff again. Just spend that money!`}
];