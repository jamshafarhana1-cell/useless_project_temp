/* ========================================
   ELEMENTS
======================================== */

const fileInput =
  document.getElementById("fileInput");

const photo =
  document.getElementById("photo");

const game =
  document.getElementById("game");

const photoBox =
  document.getElementById("photoBox");

const emoji =
  document.getElementById("emoji");

const message =
  document.getElementById("message");

const angerBar =
  document.getElementById("angerBar");

const angerPercent =
  document.getElementById("angerPercent");

const scoreElement =
  document.getElementById("score");

const hitsElement =
  document.getElementById("hits");

const comboElement =
  document.getElementById("combo");

const historyList =
  document.getElementById("historyList");

const resetBtn =
  document.getElementById("resetBtn");

const removeBtn =
  document.getElementById("removeBtn");

const attackButtons =
  document.querySelectorAll(".attack");


/* ========================================
   GAME VARIABLES
======================================== */

let anger = 0;

let score = 0;

let hits = 0;

let combo = 0;

let lastHitTime = 0;


/* ========================================
   PHOTO UPLOAD
======================================== */

fileInput.addEventListener(
  "change",
  function () {

    const file = this.files[0];

    if (!file) {
      return;
    }


    /* Check image type */

    if (!file.type.startsWith("image/")) {

      alert(
        "Please select an image!"
      );

      return;
    }


    /* Maximum 10 MB */

    if (
      file.size >
      10 * 1024 * 1024
    ) {

      alert(
        "Image is too large. " +
        "Please choose an image under 10MB."
      );

      return;
    }


    const reader =
      new FileReader();


    reader.onload =
      function (event) {

        photo.src =
          event.target.result;

        game.style.display =
          "block";

        resetGame();

        message.innerText =
          "Photo loaded! " +
          "Now release your anger! 😈";


        window.scrollTo({
          top:
            game.offsetTop - 20,

          behavior:
            "smooth"
        });

      };


    reader.readAsDataURL(file);

  }
);


/* ========================================
   ATTACK BUTTONS
======================================== */

attackButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const icon =
          this.dataset.icon;

        const text =
          this.dataset.text;

        const power =
          Number(
            this.dataset.power
          );


        action(
          icon,
          text,
          power
        );

      }
    );

  }
);


/* ========================================
   ATTACK FUNCTION
======================================== */

function action(
  icon,
  text,
  power
) {

  /* Already finished */

  if (anger >= 100) {

    message.innerText =
      "😂 Your anger tank is already EMPTY!";

    return;
  }


  const now =
    Date.now();


  /* Combo */

  if (
    now - lastHitTime <
    1500
  ) {

    combo++;

  } else {

    combo = 1;

  }


  lastHitTime =
    now;


  /* Increase anger */

  anger += power;


  if (anger > 100) {
    anger = 100;
  }


  /* Increase stats */

  hits++;

  score +=
    power * combo;


  /* Update UI */

  updateUI();


  /* Show hit emoji */

  showHit(
    icon
  );


  /* Message */

  if (anger < 100) {

    message.innerText =
      text +
      " +" +
      power +
      "% 🔥";

  }


  /* History */

  addHistory(
    icon +
    " " +
    text +
    " +" +
    power +
    "%"
  );


  /* Sound */

  playSound(
    power >= 15
      ? 180
      : 250
  );


  /* Finish */

  if (anger >= 100) {

    finishGame();

  }

}


/* ========================================
   UPDATE UI
======================================== */

function updateUI() {

  angerBar.style.width =
    anger + "%";


  angerPercent.innerText =
    anger + "% Angry";


  scoreElement.innerText =
    score;


  hitsElement.innerText =
    hits;


  comboElement.innerText =
    combo;

}


/* ========================================
   SHOW HIT
======================================== */

function showHit(icon) {

  emoji.innerText =
    icon;


  emoji.style.display =
    "block";


  /* Random position */

  const maxX =
    photoBox.clientWidth - 110;

  const maxY =
    photoBox.clientHeight - 110;


  emoji.style.left =
    Math.max(
      10,
      Math.random() * maxX
    ) + "px";


  emoji.style.top =
    Math.max(
      10,
      Math.random() * maxY
    ) + "px";


  /* Restart animation */

  emoji.classList.remove(
    "hit-animation"
  );


  void emoji.offsetWidth;


  emoji.classList.add(
    "hit-animation"
  );


  /* Photo flash */

  photoBox.classList.remove(
    "flash"
  );


  void photoBox.offsetWidth;


  photoBox.classList.add(
    "flash"
  );

}


/* ========================================
   ATTACK HISTORY
======================================== */

function addHistory(text) {

  if (
    historyList.children.length === 1 &&
    historyList.children[0].innerText ===
      "No attacks yet..."
  ) {

    historyList.innerHTML =
      "";

  }


  const li =
    document.createElement("li");


  const time =
    new Date().toLocaleTimeString();


  li.innerText =
    time +
    " — " +
    text;


  historyList.prepend(
    li
  );


  /* Maximum 20 */

  while (
    historyList.children.length >
    20
  ) {

    historyList.removeChild(
      historyList.lastChild
    );

  }

}


/* ========================================
   FINISH GAME
======================================== */

function finishGame() {

  document.body.classList.add(
    "rage"
  );


  message.classList.add(
    "complete"
  );


  message.innerText =
    "😂 CONGRATULATIONS! " +
    "YOU WASTED ALL YOUR ANGER! 🎉";


  playFinishSound();


  setTimeout(
    function () {

      document.body.classList.remove(
        "rage"
      );

    },
    1200
  );

}


/* ========================================
   RESET GAME
======================================== */

function resetGame() {

  anger = 0;

  score = 0;

  hits = 0;

  combo = 0;

  lastHitTime = 0;


  updateUI();


  message.classList.remove(
    "complete"
  );


  message.innerText =
    "Choose your weapon! 😈";


  historyList.innerHTML =
    "<li>No attacks yet...</li>";


  document.body.classList.remove(
    "rage"
  );

}


resetBtn.addEventListener(
  "click",
  resetGame
);


/* ========================================
   REMOVE PHOTO
======================================== */

removeBtn.addEventListener(
  "click",
  function () {

    photo.src = "";

    fileInput.value = "";

    game.style.display =
      "none";


    resetGame();


    window.scrollTo({
      top: 0,

      behavior:
        "smooth"
    });

  }
);


/* ========================================
   ATTACK SOUND
======================================== */

function playSound(
  frequency
) {

  try {

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;


    const audio =
      new AudioContext();


    const oscillator =
      audio.createOscillator();


    const gain =
      audio.createGain();


    oscillator.type =
      "square";


    oscillator.frequency.value =
      frequency;


    gain.gain.setValueAtTime(
      0.08,
      audio.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audio.currentTime + 0.15
    );


    oscillator.connect(
      gain
    );


    gain.connect(
      audio.destination
    );


    oscillator.start();


    oscillator.stop(
      audio.currentTime + 0.15
    );

  } catch (error) {

    console.log(
      "Audio unavailable"
    );

  }

}


/* ========================================
   FINISH SOUND
======================================== */

function playFinishSound() {

  try {

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;


    const audio =
      new AudioContext();


    const notes = [
      300,
      400,
      500,
      700
    ];


    notes.forEach(
      function (
        frequency,
        index
      ) {

        const oscillator =
          audio.createOscillator();

        const gain =
          audio.createGain();


        const startTime =
          audio.currentTime +
          index * 0.12;


        oscillator.frequency.value =
          frequency;


        gain.gain.setValueAtTime(
          0.08,
          startTime
        );


        gain.gain.exponentialRampToValueAtTime(
          0.001,
          startTime + 0.15
        );


        oscillator.connect(
          gain
        );


        gain.connect(
          audio.destination
        );


        oscillator.start(
          startTime
        );


        oscillator.stop(
          startTime + 0.15
        );

      }
    );

  } catch (error) {

    console.log(
      "Audio unavailable"
    );

  }

}


/* ========================================
   KEYBOARD CONTROLS
======================================== */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      game.style.display ===
      "none"
    ) {

      return;

    }


    switch (
      event.key.toLowerCase()
    ) {

      case "1":

        action(
          "🛏️",
          "Pillow Attack!",
          10
        );

        break;


      case "2":

        action(
          "🍅",
          "Tomato Attack!",
          10
        );

        break;


      case "3":

        action(
          "🐔",
          "HONK HONK! Chicken Attack!",
          15
        );

        break;


      case "4":

        action(
          "�",
          "Hammer Smash!",
          20
        );

        break;


      case "r":

        resetGame();

        break;

    }

  }
);