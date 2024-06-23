// Variables for main game HTML
$gameSection = $('#game-section');
$mainGameDisplay = $('#main-div');
$mainImageDisplay = $('#img-div');
$mainImageTag = $('#main-img');
$mainWordDisplay = $('#word-div');
$mainDefinitionDisplay = $('#definition-div');
$mainAttemptsDisplay = $('#attempts-div');
$mainWarningDisplay = $('#warning-div');
$buttonDisplay = $('#button-div');

let gameMode = 1;
let dictionaryData = [];
let gameActive = false;
let imgName = "";
let imgPath = "../images/";
let imgExt = ".gif";
let imgNum = 1;
let currentGame = "";
let currentCountdown = 5;
let buttonsCreated = false;


// Variables for introduction HTML
$introDisplay = $('#intro-pop');
introDelay = 2000;
imageChangeDelay = 5000;
$storyFrameOne = $('#story-1');
$storyFrameTwo = $('#story-2');
$storyFrameThree = $('#story-3');
let isIntroDisplayed = false;
$introPeachDivDisplay = $('#peach-img-div');
$introGomaDivDisplay = $('#goma-img-div');
$introPairDivDisplay = $('#pair-img-div');
let timeoutHandler1;
let timeoutHandler2;

//Variables for game ending
$outroDisplay = $('#outro-pop');
$outCon = $('#out-con');
$endDisplay = $('#end');
$tryAgainButton = $('.try-again');
$changeDifficultyButton = $('.change-difficulty');
let win = false;
let lose = false;


// Fetching the JSON data and creating an array of word objects
fetch( "../scripts/dictionary.json" )
    .then(function( response ){
        if( response.ok ){
            const jsonData = response.json()
            return jsonData; 
        }
        throw new Error('Network error.');
    })
    .then(function( incomingData ){
        dictionaryData = incomingData; 
    })
    .catch(function(error){
        console.error('Fetch error',error);
    });

