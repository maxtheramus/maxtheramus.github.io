const testItem = document.getElementById("textDisplay");
const inputItem = document.getElementById("textInput");
const timeName = document.getElementById("timeName");
const time = document.getElementById("time");
const cwName = document.getElementById("cwName");
const cw = document.getElementById("cw");
const restartBtn = document.getElementById("restartBtn");
const thirty = document.getElementById("thirty");
const sixty = document.getElementById("sixty");
const beg = document.getElementById("beg");
const pro = document.getElementById("pro");

window.onload = function() {
    loadLeaderboard();
};

// Function to prompt for user name
function promptForUserName() {
    var userName = prompt("Please enter your name"); // Prompt for user name
    if (!userName) {
        userName = promptForUserName(); // Prompt again if no name is entered
    }
    return userName;
}


var userName;
var wordNo = 1;
var wordsSubmitted = 0;
var wordsCorrect = 0;
var timer = 30;
var flag = 0;
var factor = 2;
var seconds;
var difficulty = 1;
var leaderboard = []; // Array to store leaderboard data

userName = promptForUserName();

displayTest(difficulty);

//on Input
inputItem.addEventListener('input', function(event){
  if(flag===0){
    flag=1;
    timeStart();
  }
  var charEntered = event.data;
  if(/\s/g.test(charEntered)){  //check if the character entered is a whitespace
    checkWord();
  }
  else{
    currentWord();
  }
});

//time selection
thirty.addEventListener("click",function(){
  timer = 30;
  factor = 2;
  limitColor(thirty,sixty);
  time.innerText = timer;
});
sixty.addEventListener("click",function(){
  timer = 60;
  factor = 1;
  limitColor(sixty, thirty);
  time.innerText = timer;
});

//difficulty Selection
beg.addEventListener("click",function(){
  difficulty = 1;
  displayTest(difficulty);
  limitColor(beg,pro);
});
pro.addEventListener("click",function(){
  difficulty = 2;
  displayTest(difficulty);
  limitColor(pro,beg);
});

//set the color of time and difficulty
function limitColor(itema,itemr ){
  itema.classList.add('yellow');
  itemr.classList.remove('yellow');
}

//restart the Test
restartBtn.addEventListener("click",function(){

  wordsSubmitted = 0;
  wordsCorrect = 0;
  flag=0;

  time.classList.remove("current");
  cw.classList.remove("current");
  time.innerText = timer;
  timeName.innerText = "Time";
  cw.innerText = wordsCorrect;
  cwName.innerText = "CW";
  inputItem.disabled = false;
  inputItem.value = '';
  inputItem.focus();

  displayTest(difficulty);
  clearInterval(seconds);
  limitVisible();
  userName = promptForUserName();
});

//start the timer countdown
function timeStart(){
  limitInvisible();
  seconds = setInterval(function() {
    time.innerText--;
    if (time.innerText == "-1") {
        timeOver();
        clearInterval(seconds);
    }
  }, 1000);
}

//diable textarea and wait for restart
function timeOver(){
  inputItem.disabled = true;
  restartBtn.focus();
    displayScore();
    updateLeaderboard(); // Update leaderboard

  displayScore();
}

//set Limit visibility
function limitVisible(){
  thirty.style.visibility = 'visible';
  sixty.style.visibility = 'visible';
  beg.style.visibility = 'visible';
  pro.style.visibility = 'visible';
}
function limitInvisible(){
  thirty.style.visibility = 'hidden';
  sixty.style.visibility = 'hidden';
  beg.style.visibility = 'hidden';
  pro.style.visibility = 'hidden';
}

//display the score
function displayScore(){
  let percentageAcc = 0;
  if(wordsSubmitted!==0){
    percentageAcc = Math.floor((wordsCorrect/wordsSubmitted)*100);
  }

  time.classList.add("current");
  cw.classList.add("current");

  time.innerText = percentageAcc+"%";
  timeName.innerText = "PA";

  cw.innerText = factor*wordsCorrect;
  cwName.innerText = "WPM";
}

//check if the user is entering correcrt word
function currentWord(){
  const wordEntered = inputItem.value;
  const currentID = "word "+wordNo;
  const currentSpan = document.getElementById(currentID);
  const curSpanWord = currentSpan.innerText;

  if(wordEntered == curSpanWord.substring(0,wordEntered.length)){
    colorSpan(currentID, 2);
  }
  else{
    colorSpan(currentID, 3);
  }

}


// Calculate the score
function calculateScore() {
    let percentageAcc = wordsSubmitted !== 0 ? Math.floor((wordsCorrect / wordsSubmitted) * 100) : 0;
    let wpm = factor * wordsCorrect; // Calculate WPM
    return { percentageAcc, wpm };
}


function saveLeaderboard() {
    try {
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    } catch (e) {
        console.error("Error saving leaderboard to localStorage:", e);
    }
}

function loadLeaderboard() {
    let savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
        try {
            leaderboard = JSON.parse(savedLeaderboard);
            displayLeaderboard();
        } catch (e) {
            console.error("Error loading leaderboard from localStorage:", e);
        }
    }
}
// Update and display leaderboard
function updateLeaderboard() {
    let { percentageAcc, wpm } = calculateScore();
    leaderboard.push({ name: userName, accuracy: percentageAcc, wpm: wpm });
    leaderboard.sort((a, b) => b.wpm - a.wpm); 
    displayLeaderboard();
    saveLeaderboard(); // Save updated leaderboard to local storage
}





// Display the leaderboard
function displayLeaderboard() {
    const leaderboardElement = document.getElementById("leaderboard");
    leaderboardElement.innerHTML = '<h2>Leaderboard</h2>';
    leaderboard.forEach(entry => {
        leaderboardElement.innerHTML += `<p>${entry.name}: ${entry.accuracy}% Acc, ${entry.wpm} WPM</p>`;
    });
}



//checks word entered
function checkWord(){
  const wordEntered = inputItem.value;
  inputItem.value='';

  const wordID = "word "+wordNo;
  const checkSpan = document.getElementById(wordID);
  wordNo++;
  wordsSubmitted++;

  if(checkSpan.innerText === wordEntered){
    colorSpan(wordID, 1);
    wordsCorrect++;
    cw.innerText=wordsCorrect;
  }
  else{
    colorSpan(wordID, 3);
  }

  if(wordNo>40){

    displayTest(difficulty);
  }
  else{
    const nextID = "word "+wordNo;
    colorSpan(nextID, 2);
  }
}

//color the words
function colorSpan(id, color){
  const span = document.getElementById(id);
  if(color === 1 ){
    span.classList.remove('wrong');
    span.classList.remove('current');
    span.classList.add('correct');
  }
  else if(color ===2){
    span.classList.remove('correct');
    span.classList.remove('wrong');
    span.classList.add('current');
  }
  else{
    span.classList.remove('correct');
    span.classList.remove('current');
    span.classList.add('wrong');
  }
}

//display the random words on screen
function displayTest(diff){
  wordNo = 1;
  testItem.innerHTML = '';

  let newTest = randomWords(diff);
  newTest.forEach(function(word, i){
    let wordSpan = document.createElement('span');
    wordSpan.innerText = word;
    wordSpan.setAttribute("id", "word " + (i+1));
    testItem.appendChild(wordSpan);
  });

  const nextID = "word "+wordNo;
  colorSpan(nextID, 2);
}

//Generate an array of random 50 words
function randomWords(diff){

  var topWords = [ "kenneth", "clarissa", "angpow", "diamond", "wedding", "ceremony", "bride", "groom", "bouquet", "vows", "celebration", "reception", "engagement", "honeymoon", "nuptials", "banquet", "toast", "rings", "anniversary",
    "singapore", "marinabay", "sentosa", "orchardroad", "merlion", "hawkercenter", "laksa", "durian", "chillicrab", "gardensbythebay", "littleindia", "chinatown", "hdb", "mrt", "lioncity",
    "tropical", "humidity", "rainforest", "equator", "monsoon", "palm", "mangrove", "jungle", "exotic", "paradise", "climate", "flora", "fauna", "island", "ocean",
    "beach", "sand", "waves", "sunbathing", "coral", "shoreline", "seashells", "coastline", "tide", "surfing", "sunscreen", "bikini", "snorkeling", "boardwalk", "seaside",
    "altar", "aisle", "bestman", "bridesmaid", "catering", "florist", "photographer", "weddingcake", "firstdance", "bachelorparty", "bridalshower", "dress", "suit", "veil", "weddingplanner",
    "esplanade", "satay", "rotiprata", "kayatoast", "tehtarik", "clarkequay", "pulauubin", "botanicgardens", "nightzoo", "singlish", "supertree", "rooftopbar", "cityscape", "skyscraper", "cuisine",
    "tropics", "coconut", "mango", "papaya", "bamboo", "hibiscus", "sunset", "sunrise", "rainfall", "lagoon", "reef", "toucan", "gecko", "parrotfish", "tigerbalm",
    "beachvolleyball", "waterski", "kitesurf", "beachparty", "tan", "scubadiving", "fishing", "canoeing", "yachting", "jetski", "seabreeze", "sandcastle", "beachtowel", "flipflops", "beachball"
];
  var basicWords = ["cat", "dog", "sun", "moon", "star", "tree", "bird", "fish", "book", "road", "rain", "snow", "leaf", "wind", "sand", "rock", "hill", "lake", "river", "sea", "sky", "cloud", "grass", "flower", "fruit", "apple", "orange", "grape", "pear", "plum", "peach", "cherry", "berry", "melon", "corn", "rice", "bread", "milk", "cheese", "egg", "meat", "fish", "cake", "pie", "tea", "coffee", "juice", "water", "soda", "chair", "table", "bed", "sofa", "lamp", "door", "window", "house", "room", "wall", "floor", "roof", "yard", "garden", "fence", "gate", "path", "road", "street", "town", "city", "school", "class", "teacher", "student", "book", "pen", "pencil", "paper", "note", "exam", "test", "grade", "lesson", "study", "learn", "read", "write", "spell", "count", "add", "subtract", "multiply", "divide", "number", "shape", "color", "size", "big", "small", "long"];
  
  if(diff==1){
    wordArray = basicWords;
  }
  else{
    wordArray =topWords;
  }

  var selectedWords = [];
  for(var i=0;i<40;i++){
    var randomNumber = Math.floor(Math.random()*wordArray.length);
    selectedWords.push(wordArray[randomNumber]+" ");
  }
  return selectedWords;
}
