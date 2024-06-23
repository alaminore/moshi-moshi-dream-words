
// The game object
class DreamWordsGame {
    constructor (difficulty, wordList, maxStrikes = 6) {
        this.difficulty = difficulty;
        this.wordList = wordList.filter(word => word.difficulty.includes(parseInt(difficulty)) && word.countdown === 0);
        this.maxStrikes = maxStrikes;
        this.currentWord = '';
        this.currentWordDisplay = '';
        this.currentDefinition = '';
        this.attempts = 0;
        this.guessedLetters = [];
    }

    describeSelf() {
        console.dir(this);
    }

    // Blantantly stolen from Jeff Parker ;) - shuffling the word list
    shuffleWords (){
        let j, x, i;
        for (i = this.wordList.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.wordList[i];
            this.wordList[i] = this.wordList[j];
            this.wordList[j] = x;
        }; 
        return this.wordList;
    };

    // Also "borrowed" (thanks Jeff!) - dealing the current word
    dealWord () {
       const word = this.wordList.shift();
       if(word === undefined){
           return 'No more cards';
       }else{
            this.currentDefinition = word.definition;
            this.currentWord = word.word;
            this.currentWordDisplay ="_".repeat(this.currentWord.length);
            return word;
       }   
    }

    // Function to change the image in the game area
    changeImage () {
        let attemptPercent = (this.attempts/this.maxStrikes * 100);
        let halfway = (((this.maxStrikes / 2) / this.maxStrikes) * 100);
        let remaining = this.maxStrikes - this.attempts;
        let pronoun = "";
        let imageURL = `${imgPath}${imgName}-0${imgNum}${imgExt}`;

        if (this.difficulty === 3) {
            pronoun = "we";
        } else {
            pronoun = "I";
        }

        // set up the first image
        if (attemptPercent === 0) {

            $mainAttemptsDisplay.html(`<p><strong>Attempts Remaining: </strong>${remaining}</p>
                <p><em>Currently sleeping soundly</em></p>`);

            $mainImageTag.attr({
                'src': imageURL,
                'alt': imageURL 
            });

        // otherwise, if less than half attempts made, then change to the 2nd picture
        } else if (attemptPercent < halfway) {
            imgNum = 2;

            $mainAttemptsDisplay.fadeOut(500, function () {
                $(this).html(`<p><strong>Attempts Remaining: </strong>${remaining}</p>
                    <p><em>Still sleepy...</em></p>`).fadeIn(500);
            });

            $mainImageTag.fadeOut(500, function() {
                $(this).attr({
                'src': imageURL,
                'alt': imageURL
                }).fadeIn(500);
            });
        // after that, change to the third picture
        } else {
            imgNum = 3;
            
            $mainAttemptsDisplay.fadeOut(500, function () {
                $(this).html(`<p><strong>Attempts Remaining: </strong>${remaining}</p>
                    <p><em>Will ${pronoun} ever get back to sleep?</em></p>`).fadeIn(500);
            });

            $mainImageTag.fadeOut(500, function() {
                $(this).attr({
                'src': imageURL,
                'alt': imageURL
                }).fadeIn(500);
            });
        }
    } 
 
}; // end DreamWordsGame class

function startGame (difficulty, wordList, maxStrikes = 6) {

    // The game is on!
    gameActive = true;
    isIntroDisplayed = false;
    win = false;
    lose = false;

    // Create the buttons [if not already created]
    if (!buttonsCreated) {
        for (let i = 65; i <= 90; i++) {
        createButton(String.fromCharCode(i));
        };
    };

    //Display the game area
    $gameSection.fadeIn(1000);

    //Reset the warnings
    $mainWarningDisplay.html('');

    //Reset the image number
    imgNum = 1;

    //create a new game
    currentGame = new DreamWordsGame (difficulty, wordList, maxStrikes);

    //shuffle the word list and deal the first word
    currentGame.shuffleWords();
    currentWord = currentGame.dealWord();

    //Display the word blanks
    $mainWordDisplay.html (`<p>${currentGame.currentWordDisplay}</p>`);

    //Display the hint
    $mainDefinitionDisplay.html(`<p><strong>Hint: </strong>${currentGame.currentDefinition}</p>`);

    //Display the first image & current number of attempts
    currentGame.changeImage();
}; // end startGame 

// Generating the buttons & adding a listener to each one
function createButton(letter) {
    let $button = $('<button></button>');

    $button.attr('id', `button-${letter}`);
    $button.text(letter);
    $button.addClass('keyboard-button');

    $button.on('click', function(){
        handleClick(letter);
    });

    $buttonDisplay.append($button);
    
    $(document).on('keydown', function(event) {
        let keyPressed = String.fromCharCode(event.which).toUpperCase();

        if (keyPressed === letter) {
            handleClick(keyPressed);
        }
    });

    buttonsCreated = true;
}; // end createButton 

// Behaviour when buttons are clicked
function handleClick(letter) {
    checkLetter(letter);
    currentGame.changeImage();
    
}; // end handleClick

function checkLetter(letter) {
    let wordSplit = currentWord.word.split('');
    let blankSplit = currentGame.currentWordDisplay.split('');

    //Check if the letter has been used
    if (currentGame.guessedLetters.includes(letter)) {
        $mainWarningDisplay.html(`<p>That word has already been used! Try again.</p>`); // ADD STYLES
        return;
    }

    // Add the letter to the guessed letters
    currentGame.guessedLetters.push(letter);

    //Check if the letter is in the word & update the blank spaces
    for(i = 0; i < wordSplit.length; i++) {
        if (wordSplit[i].toUpperCase() === letter) {
            blankSplit[i] = letter;
        }
        else {
            continue;
        }
    }

    // Update the blank spaces on the board if applicable & congratulate player
    if (blankSplit.includes(letter)) {
        $mainWarningDisplay.html(`<p>The word contains ${letter}! Great job!</p>`); // ADD STYLES
        currentGame.currentWordDisplay = blankSplit.join('');
        
        //Display the word blanks
        $mainWordDisplay.fadeOut(500, function(){
            $(this).html (`<p>${currentGame.currentWordDisplay}</p>`).fadeIn(500);
        });

        // If the letter isn't in the word, let them know, update the attempts, change the pictures.
    } else {
        $mainWarningDisplay.html(`<p>The word doesn't contain ${letter}! Try again!</p>`); // ADD STYLES
        currentGame.attempts += 1;
        currentGame.changeImage();
    };
    
    //Check to see if they've won the game
    if (!blankSplit.includes('_')) {
        win = true;
        endGame();
    };

    // Check to see if they've lost
    if (currentGame.attempts === currentGame.maxStrikes) {
        lose = true;
        endGame();
    };
}; // end checkLetter

//End the game
function endGame () {
    gameActive = false;
    
    // Fade out the game display
    $gameSection.fadeOut(1000);

    if (win) {
        imgNum = 5;
        let imageURL = `${imgPath}${imgName}-0${imgNum}${imgExt}`;

        $('#end img').attr ({
            'src': imageURL,
            'alt': imageURL 
        })

        $('#end h3').text(`You Win`);
        $('#end p').text(`The Moshi Moshi cats aced their exam! Great job!`)

    };

    if (lose) {
        imgNum = 4;
        let imageURL = `${imgPath}${imgName}-0${imgNum}${imgExt}`;

        $('#end img').attr ({
            'src': imageURL,
            'alt': imageURL 
        });

        $('#end h3').text(`You Lose`);
        $('#end p').text(`The Moshi Moshi cats failed their exam...`)
    }

    // Display the end of the game
    $outCon.removeClass('outro-container');
    $outCon.addClass('outro-container-displayed');
    $outroDisplay.fadeIn(1000);
    $outroDisplay.css('display', 'grid');
}; // end endGame

// Try Again button handling
function tryAgain () {
    $outroDisplay.fadeOut(500);
    $outCon.removeClass('outro-container-displayed');
    $outCon.addClass('outro-container');
    resetDictionary();
    restartGame();
    $gameSection.fadeIn(500);
}; // end tryAgain

// Change Difficulty button handling
function changeDifficulty () {
    $outroDisplay.fadeOut(500);
    $outCon.removeClass('outro-container-displayed');
    $outCon.addClass('outro-container');
    resetDictionary();
    resetGame;
    $introDisplay.css('display', 'grid');
    $storyFrameThree.fadeIn(500);
    isIntroDisplayed = true;
}; // end changeDifficulty

//reset the dictionary values
function resetDictionary () {
    dictionaryData.forEach (function(word) {
        if (word.countdown > 0) {
            word.countdown--;
        }
        if(word.word === currentGame.currentWord) {
            word.countdown = currentCountdown;
        };
    });

    // Reset dictionary if empty
    if (currentGame.wordList.length === 0) {
        currentGame.wordList = dictionaryData.filter(word => word.difficulty === difficulty && word.countdown === 0);
    }
} // end resetDictionary

//Restart current game 
function restartGame () {

    // Reset the game state variables
    currentGame.attempts = 0;
    currentGame.guessedLetters = [];
    imgNum = 1;
    win = false;
    lose = false;
    $mainWarningDisplay.html('');

    //Deal a new word
    currentWord = currentGame.dealWord();

    //Update Displays
    $mainWordDisplay.html (`<p>${currentGame.currentWordDisplay}</p>`);
    $mainDefinitionDisplay.html(`<p><strong>Hint: </strong>${currentGame.currentDefinition}</p>`);
    currentGame.changeImage();

} // end restartGame

//Reset the game 
function resetGame () {
    // Reset the current game value to 0;
    currentGame = "";
    currentWord = ""; 
    win = false;
    lose = false;
}; // end resetGame

// Displaying the intro & generating the content
function displayIntro () {
    $introDisplay.fadeIn(500);
    $introDisplay.css('display','grid');
    isIntroDisplayed = true;

    timeoutHandler1 = setTimeout(function(){
        $storyFrameOne.fadeOut(1500);
        $storyFrameTwo.fadeIn(1500);

        timeoutHandler2 = setTimeout(function() {
            $storyFrameTwo.fadeOut(1500);
            $storyFrameThree.fadeIn(1500);
            $storyFrameThree.css('display','grid');
        }, 5000);

    }, 5000);
}; //end displayIntro

//Hide the intro
function hideIntro () {
    $introDisplay.fadeOut(1000);
    isIntroDisplayed = false;
}; // end hideIntro

// Change the src for hovered-over difficulty divs
function difficultyImageMouseover ($div) {
    $div.find('img').each(function() {
        let $img = $(this);
        let src = $img.attr('src');
        let newSrc = src.replace('-static', '');
        $img.attr('src', newSrc);
    });
}; // end dImgMouseover

function difficultyImageMouseout ($div) {
    $div.find('img').each(function() {
        let $img = $(this);
        let src = $img.attr('src');
        let newSrc = src.replace('.gif', '-static.gif');
        $img.attr('src', newSrc);
    });
}; // end dImgMouseout

// Skip that intro!
function skipIntro () {
    clearTimeout(timeoutHandler1);
    clearTimeout(timeoutHandler2);
    $storyFrameOne.stop(true, true).hide();
    $storyFrameTwo.stop(true,true).hide();
    $storyFrameThree.show();
    $storyFrameThree.css('display','grid');
}
