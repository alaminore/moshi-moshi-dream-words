// display the intro
$(document).ready (setTimeout(displayIntro, introDelay));

// mouseover animations for difficulty levels (intro)
$introPeachDivDisplay.on('mouseover', function () {
    difficultyImageMouseover($(this));
});

$introPeachDivDisplay.on('mouseout', function () {
    difficultyImageMouseout($(this));
});

$introGomaDivDisplay.on('mouseover', function () {
    difficultyImageMouseover($(this));
});

$introGomaDivDisplay.on('mouseout', function () {
    difficultyImageMouseout($(this));
});

$introPairDivDisplay.on('mouseover', function () {
    difficultyImageMouseover($(this));
});

$introPairDivDisplay.on('mouseout', function () {
    difficultyImageMouseout($(this));
});

// Choosing the difficulty levels

//Easy
$introPeachDivDisplay.on('click', function() {
    imgName = "peach";
    gameMode = 1;
    hideIntro();
    startGame(1, dictionaryData, 6);
});

// Normal
$introGomaDivDisplay.on('click', function() {
    imgName = "goma";
    gameMode = 2;
    hideIntro();
    startGame(2, dictionaryData, 6);
});

//Hard
$introPairDivDisplay.on('click', function() {
    imgName = "mochi"
    gameMode = 3;
    hideIntro();
    startGame(3, dictionaryData, 5)
});

// If they decide to continue the current game, restart the game
$tryAgainButton.on('click', function () {
    tryAgain();
});

//If they want to change the difficulty, reset the game completely
$changeDifficultyButton.on('click', function(){
    changeDifficulty();
});

//Skip the intro if you click on the intro screen (I've watched it so much, haha!)
$storyFrameOne.on('click', skipIntro);
$storyFrameTwo.on('click', skipIntro);