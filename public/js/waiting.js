let intervalID;
const exitGame = function() {
  sendAjaxRequest('DELETE','/player');
  goToHome();
};

const updateSeconds = function() {
  let secondBlock = getElement('#sec');
  let seconds = +(secondBlock.innerText);
  seconds--;
  secondBlock.innerHTML = seconds;
};

const showColor = function(players){
  let overlay = getElement(".overlay");
  let colorHolder = getElement('#color');
  let playerName = getElement('#userName').innerText;
  let player = players.find((player)=>player.name == playerName);
  colorHolder.style.backgroundColor = player.color;
  overlay.classList.remove('hide');
  overlay.classList.add('show');
};

const updatePlayers = function() {
  if (this.responseText == "") {
    goToHome();
    return;
  }
  let players = JSON.parse(this.responseText).players;
  if (players == undefined) {
    return;
  }
  players.forEach((player, index) => {
    if(index>3) {
      return;
    }
    if(getElement(`#player${index+2}`)!=undefined){
      getElement(`#player${index+2}`).value ="";
    }
    getElement(`#player${index+1}`).value = player.name;
  });
  if (players.length < 4) {
    return;
  }
  let timer = getElement('#Timer');
  showColor(players);
  getElement('#message').style.visibility = 'hidden';
  timer.style.visibility = 'visible';
  setInterval(updateSeconds, 1000);
  setTimeout(goToBoard, 3000);
  clearInterval(intervalID);
};

const updateGameName = function() {
  let gameName = this.responseText;
  getElement('#gameName').innerText = gameName;
};

const updateUserName = function() {
  let userName = this.responseText;
  getElement('#userName').innerText = userName;
};

const setGameName = function() {
  sendAjaxRequest('GET','/gameName',updateGameName);
};

const setUserName = function() {
  sendAjaxRequest('GET','/userName',updateUserName);
};

const getStatus = function() {
  sendAjaxRequest('GET','/getStatus',updatePlayers);
};

const begin = function() {
  setGameName();
  setUserName();
  getStatus();
  intervalID = setInterval(getStatus, 1000);
};

window.onload = begin;
