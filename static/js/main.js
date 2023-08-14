import Swal from 'sweetalert2';
import particles from './animations/particles.js';
import Background from './background.js';
import Camera from './camera.js';
import Director from './director.js';
import Menu from './menu.js';
import Player from './player.js';
import Render from './render.js';
import Road from './road.js';
import Tachometer from './tachometer.js';
import {
  canvas,
  resource,
  toggleMusic
} from './util.js';



window.onload = () => {
  const containerCanvas = document.querySelector('.container');
  containerCanvas.height = Math.min(window.innerHeight, (0.5625 * window.innerWidth));
};

// 定義基本參數
let nextPauseTime = 0;
let checkInterval = 1000;  // 每秒檢查一次
let intervalID = null;

const pauseTimes = [  21.430, 51.830, 64.187, 88.962, 104.094, 122.493, 138.507, 152.441, 172.250, 188.1000, 201.780, 223.978, 242.160, 254.730, 273.990,   291.060, 310.270, 330.590, 372.370, 400.160, 426.290, 446.060, 465.300, 483.810, 511.590, 538.640, 560.150, 571.570, 594.060, 611.080]

const pauseMessages = [
  {
    "message": "科學博物館重現「騰雲號」！全球首座一比一真實尺寸模型，你敢來體驗嗎？",
    "type": "question"
  },
  {
    "message": "請小心前方街道上的汽車和摩托車。前面有紅白色的警示標誌，別忘了停下。駕駛時，也要注意路邊的紅線!",
    "type": "warning"
  },
  {
    "message": "城市驚見「生存遊戲商店」！安全疑慮升級，居民震驚！你準備好了嗎?",
    "type": "question"
  },
  {
    "message": "請留意路上的白色廂型車和白色卡車。周圍有多輛摩托車和機車，也請特別小心。注意路上的雙黃線，不能穿越雙黃線超車或換到另一車道。",
    "type": "warning"
  },
  {
    "message": "右前方ubike與旅店界的秘密聯盟!你覺得這是策略還是巧合呢?",
    "type": "question"
  },
  {
    "message": "你知道嗎，高雄中學是高雄市的一所知名學府，擁有豐富的學術歷史和文化遺產，另外我們前方的那個電話亭，它其實是高雄市街頭一個相當特別的景象，你是否也想使用看看呢？或許可以用電話問出年份呢！",
    "type": "question"
  },
  {
    "message": "請留意街上的銀色小型廂型車和綠色公車，以及騎黑色摩托車的男子。同時，注意交通標誌。在街上小心駕駛，避免其他車輛，並注意你的周圍，如建築物、旗幟和行人。",
    "type": "warning"
  },
  {
    "message": "訊我們的前方有一家烤鴨店，地點就在愛河的附近，你會不會想要吃愛河特色的烤鴨呢？?",
    "type": "question"
  },
  {
    "message": "請注意周圍的交通，特別是停在街上的車輛和附近駕駛的車輛。留意前方的綠燈，並小心可能從停車輛或建築物後面走出的行人。此外，別忘了留意任何表示可能有道路施工或障礙物。?",
    "type": "warning"
  },
  {
    "message": "聽說壽山動物園的動物會講話？你想去看看他們還有哪些秘密對話嗎?",
    "type": "question"
  },
  {
    "message": "元亨寺，蔚為台灣最大寺院的真實歷史，讓你有興趣了嗎？",
    "type": "question"
  },
  {
    "message": "請留意前方街道上的橙色錐筒，並在靠近它們時小心駕駛。也要與你前方的公車保持安全的距離。",
    "type": "warning"
  },
  {
    "message": "右前方逃逸的狗狗成為熱議焦點! 壽山動物園的監管真的足夠嚴格嗎？",
    "type": "question"
  },
  {
    "message": "請小心駕駛，並注意路上的黃線。要留意前方的橙白色錐筒，以及街道上停著的黑白色車旁穿著黃綠色背心的男子。",
    "type": "warning"
  },
  {
    "message": "中山大學熱門科系曝光!AI語言模型竟選此系就讀?你能猜到我想念甚麼嗎?",
    "type": "question"
  },
  {
    "message": "英國研究驚人發現曝光，參與童軍活動的孩童未來更容易成功？你覺得是這樣嗎?",
    "type": "question"
  },
  {
    "message": "請小心騎機車的人，並注意交通燈變成黃色。同時，也要留意任何可能提供重要資訊或警告的相關標誌。",
    "type": "warning"
  },
  {
    "message": "跟你說一個珊瑚的冷知識， 由於珊瑚的結構和化學性質與人體骨骼極為相似，因此可以使用珊瑚做為替代骨移植。這樣的方法可以接受嗎？",
    "type": "question"
  },
  {
    "message": "留意街上的汽車和機踏板車，以及你左側騎自行車的男子。同時，請小心兩側停著的車輛和附近的行人。前方的交通燈是閃爍的紅燈，所以在接近時請做好停車的準備。",
    "type": "warning"
  },
  {
    "message": "前方的牌樓是高雄港的地標之一，牌樓上的標語萬商雲集、航業海發，你有沒有發大財的感覺?",
    "type": "question"
  },
  {
    "message": "右前方是巨人的積木，引爆觀光熱潮的駁二新地標，僅以三點支撐，是不是覺得不可思議?",
    "type": "question"
  },
  {
    "message": "請注意路上的汽車和過馬路的行人，特別是穿白色大衣的女士。要留意交通標誌，例如帶有紅色三角形的白色標誌。在這城市街道上保持警覺，因為交通或行人的動向可能會突然改變。",
    "type": "warning"
  },
  {
    "message": "請小心，因為前方有人騎摩托車。請注意路上的黃線並留意交通標誌。另外，如果公車後方的黃燈表示停車或轉彎，請減速慢行。",
    "type": "warning"
  },
  {
    "message": "左前方是著名牛肉麵店，不禁讓我想到如果牛角麵包裡也沒牛角，牛肉麵真的需要牛肉嗎？你覺得需要嗎?",
    "type": "question"
  },
  {
    "message": "前方右手邊的大樓設計很特別，你覺得這些線條有代表什麼意義嗎，或是假如你是設計師，你會想設計何種外觀的大樓呢？",
    "type": "question"
  },
  {
    "message": "炎炎夏日，找不到遮陽的地方嗎？右前方的冰店的特色冰品是不錯的選擇，你想停下來嗎?",
    "type": "question"
  },
  {
    "message": "請小心，因為前方有人騎摩托車轉彎。請注意路上的黃線並留意交通標誌。",
    "type": "warning"
  },
  {
    "message": "左前方是高雄文化中心，當前藝術市集包從麵包花藝到手工皂都有，你會期望在市集內看到什麼手工藝品呢?",
    "type": "question"
  },
  {
    "message": "保持警覺並與路上的汽車保持安全距離，特別是前方的黃色汽車。留意交通標誌，例如你右側的藍色街道標誌。",
    "type": "warning"
  },
  {
    "message": "英國最新研究證實：定期在衛武營音樂廳聽音樂，對健康有好處？你覺得有那些好處?",
    "type": "question"
  }
];

const video = document.getElementById("streetview");
const pauseBtn = document.querySelector('#pauseBtn');
const closeEnough = 0.01; // 容錯值

// 每個場景的播放起始和結束時間
const sceneTimes = {
  "城市": {
      startTimes: [0, 105.480, 189.960, 280.860, 403.240, 514.780],
  },
  "太空": {
      startTimes: [/*... your times for scene 2 */],
  }
};

let currentScene = '城市';

let entryCount = localStorage.getItem('entryCount') ? parseInt(localStorage.getItem('entryCount')) : 0;

// 設定開始時間
const setVideoStartTime = () => {
  let startTimes = sceneTimes[currentScene].startTimes;

  if (entryCount < startTimes.length) {
      video.currentTime = startTimes[entryCount];
  } else {
      // 如果超過設定的次數，則從第一次開始
      entryCount = 0;
      video.currentTime = startTimes[entryCount];
  }
  localStorage.setItem('entryCount', entryCount + 1);
};

// 更新下一次的暫停時間
const updateNextPauseTime = (currentTime) => {
    const upcomingPauseTimes = pauseTimes.filter(time => time > currentTime);
    nextPauseTime = upcomingPauseTimes[0] || Infinity;
    console.log('nextPauseTime', nextPauseTime);
};

function showMessage(index) {
  return new Promise((resolve) => {
    const messageItem = pauseMessages[index];
    let options = {
      title: messageItem.message,
      didClose: () => resolve() // 當 Swal 關閉時，解析此 Promise
    };

    if (messageItem.type === "question") {
        Swal.fire(options);
    } else if (messageItem.type === "warning") {
        options.icon = 'warning';
        Swal.fire(options);
    }
  });
}


//錄音
function startVoiceInput() {
  return new Promise((resolve, reject) => {
    let mediaRecorder;
    let audioChunks = [];

    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            console.log("ondataavailable triggered");
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            console.log("onstop triggered");
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            sendToWhisper(audioBlob, (text) => {
                const textarea = Swal.getInput();
                textarea.value = text;
            });
        };
    })
    .catch(error => {
        // Handle errors related to getting the user media
        reject(error);
    });

    Swal.fire({
        willOpen: (swal) => {
            console.log("Swal onOpen triggered");
            const recordBtn = document.createElement('button');
            recordBtn.innerText = '開始錄音';
            recordBtn.addEventListener('click', () => {
                if (recordBtn.innerText === '開始錄音') {
                    audioChunks = [];
                    mediaRecorder.start();
                    recordBtn.innerText = '結束錄音';
                } else {
                    mediaRecorder.stop();
                    recordBtn.innerText = '開始錄音';
                }
            });

            swal.appendChild(recordBtn);
        },
        didClose : () => {
            console.log("Swal didClose triggered");
            resolve();
        }
    });
  });
}

function sendToWhisper(audioBlob) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        resolve(data.transcribed_text);
      } else {
        reject(new Error('Failed to transcribe'));
      }
    })
    .catch(error => {
      reject(error);
    });
  });
}


// 檢查影片時間以確定是否需要暫停
let currentMessageIndex = 0;
let allowToCheck = true;

const checkVideoTime = () => {
  const streetMusic = document.getElementById('blueSky');

  if ((allowToCheck && Math.abs(video.currentTime - nextPauseTime) <= closeEnough)) {
      updateNextPauseTime(video.currentTime);
      allowToCheck = false;
      streetMusic.pause();
      video.pause();
      pauseBtn.classList.add('off');

      //檢查次數回歸平穩
      clearInterval(intervalID);
      intervalID = setInterval(checkVideoTime, checkInterval);

      // 更新訊息索引
      currentMessageIndex++;
      console.log("currentMessageIndex", currentMessageIndex);

      const messageIndex = pauseTimes.indexOf(nextPauseTime);      
      showMessage(messageIndex)
      .then(startVoiceInput) // 這裡調用 startVoiceInput
      .then(() => {
          if (currentMessageIndex % 5 === 0) {
              window.location.reload();
          }
      });
  }
};


// 當使用者進入影片時
setVideoStartTime();

const loop = (time, render, camera, player, oppArr, road,
  bg, director, menu, tachometer, width, height) => {

  const directorParam = director;
  const cameraParam = camera;
  const playerParam = player;
  
  if (menu.state === '城市') {

    // 當前場景
    currentScene = '城市'; // 例如，您可以在某個按鈕的事件處理器中更改這個值
    
    const timeNow = window.performance.now();
    const elapsed = (timeNow - directorParam.realTime) / 1000;
    directorParam.realTime = timeNow;
    directorParam.timeSinceLastFrameSwap += elapsed;

    var streetMusic = document.getElementById('blueSky');

    const pauseBtn = document.getElementById('pauseBtn');
    pauseBtn.classList.remove('hidden');

    var video = document.getElementById("streetview");
    menuMusic.muted = true;
    video.classList.remove('hidden');

    const mute = document.getElementById('mute');
    mute.classList.remove('hidden');
    
    clearInterval(intervalID);
    updateNextPauseTime(video.currentTime);
    intervalID = setInterval(checkVideoTime, checkInterval);

    if (Math.abs(video.currentTime - nextPauseTime) <= 1) {
      setInterval(checkVideoTime, 1);
      console.log("change interval");
    }
    else{
      allowToCheck = true;
    }

    if (pauseBtn.classList.contains('off')) {
      video.pause();
    } else {
      video.play();
      streetMusic.play();
    }
    
    // console.log('current time, intervalID', video.currentTime, intervalID );

  }


  if (menu.state === '太空') {
    // 當前場景
    currentScene = '太空'; // 例如，您可以在某個按鈕的事件處理器中更改這個值
    
    const timeNow = window.performance.now();
    const elapsed = (timeNow - directorParam.realTime) / 1000;
    directorParam.realTime = timeNow;
    directorParam.timeSinceLastFrameSwap += elapsed;

    const pauseBtn = document.getElementById('pauseBtn');
    pauseBtn.classList.remove('hidden'); 

    var video = document.getElementById("space");
    menuMusic.muted = true;
    video.classList.remove('hidden');   

    const mute = document.getElementById('mute');
    mute.classList.remove('hidden'); 
    
    if(pauseBtn.classList.contains('off')) {
      video.pause();
    }
    else{
      video.play();
    }
  }

  if (menu.state === 'title') {
    const { selectedOptions, showMenu } = menu;

    const timeNow = window.performance.now();
    const elapsed = (timeNow - directorParam.realTime) / 1000;
    directorParam.realTime = timeNow;
    directorParam.timeSinceLastFrameSwap += elapsed;

    if (menu.updateAnimationsTime) menu.animations.forEach((item) => item.update());

    if (directorParam.timeSinceLastFrameSwap > menu.updateTime) {
      if (showMenu === 1){
        toggleMusic('event', 'musicOn', selectedOptions[0]);
      }
      menu.update(playerParam, road, oppArr, directorParam);
      directorParam.timeSinceLastFrameSwap = 0;

    }
    menu.render(render);
  }
  
  requestAnimationFrame(() => loop(
    time, render, cameraParam, playerParam, oppArr, road,
    bg, directorParam, menu, tachometer, width, height,
  ));
};

const init = (time) => {
  const { width, height } = canvas;
  const opponents = [];

  const render = new Render(canvas.getContext('2d'));
  const camera = new Camera();
  const director = new Director();
  const player = new Player();
  const road = new Road();
  const background = new Background();
  const menu = new Menu(width, height, particles);
  const tachometer = new Tachometer();

  background.create();
  loop(time, render, camera, player, opponents, road,
    background, director, menu, tachometer, width, height);
};

resource
  .add('arrowKeys', arrowKeysURL)
  .add('enterKey', enterKeyURL)
  .load(() => requestAnimationFrame((time) => init(time)));

