var CurrentVersus = [];
var CorrectAnswer = 0;
var Score = 0;
var HighScore = 0;
var isReady = false;

window.onload = async function ()
{
    if (getCookie("highscore") == "")
        HighScore = 0;
    else
        HighScore = parseInt(getCookie("highscore"));
    UpdateScoreDisplay();
    await GetNewVersus();
    document.getElementById("anime-card-1").onclick = () => { Answer(0); };
    document.getElementById("anime-card-2").onclick = () => { Answer(1); };
    document.getElementById('crying-anime-girl-sadge').src = await GetCryGif();
    document.getElementById("try-again").onclick = async () => { document.getElementById("result-screen").style = "opacity: 0; pointer-events: none;"; setTimeout(async ()=> { document.getElementById('crying-anime-girl-sadge').src = await GetCryGif(); }, 1000); };
}

async function GetCryGif()
{
    _x = await fetch("https://api.waifu.pics/sfw/cry");
    return (await _x.json())['url'];
}

async function GetNewVersus()
{
    _x = await fetch('/api/get_versus');
    CurrentVersus = await _x.json();
    CorrectAnswer = CurrentVersus[0]['rank'] < CurrentVersus[1]['rank'] ? 0 : 1;
    SetupCards(CurrentVersus);
    return CurrentVersus;
}

function SetupCards(data)
{
    document.getElementById("anime-card-1").getElementsByClassName("anime-name")[0].innerText = data[0]['title'];
    document.getElementById("anime-card-1").getElementsByClassName("answer")[0].style.background = CorrectAnswer == 0 ? "rgb(124, 223, 146)" : "rgb(255, 146, 146)";
    document.getElementById("anime-card-2").getElementsByClassName("answer")[0].style.background = CorrectAnswer == 1 ? "rgb(124, 223, 146)" : "rgb(255, 146, 146)";
    document.getElementById("anime-card-1").getElementsByClassName("answer")[0].getElementsByTagName("i")[0].className = CorrectAnswer == 0 ? "fa-solid fa-check" : "fas fa-times";
    document.getElementById("anime-card-2").getElementsByClassName("answer")[0].getElementsByTagName("i")[0].className = CorrectAnswer == 1 ? "fa-solid fa-check" : "fas fa-times";
    document.getElementById("anime-card-1").getElementsByClassName("answer")[0].getElementsByClassName("answer-rank")[0].innerText = `#${data[0].rank}`;
    document.getElementById("anime-card-2").getElementsByClassName("answer")[0].getElementsByClassName("answer-rank")[0].innerText = `#${data[1].rank}`;
    document.getElementById("anime-card-2").getElementsByClassName("anime-name")[0].innerText = data[1]['title'];
    document.getElementById("anime-card-1").style = `background: url("${data[0]['images']['jpg']['image_url']}") no-repeat; background-size: cover;`;
    document.getElementById("anime-card-2").style = `background: url("${data[1]['images']['jpg']['image_url']}") no-repeat; background-size: cover;`;
    isReady = true;
}

function Answer(answer)
{
    if (!isReady) return;
    isReady = false;
    if (answer == CorrectAnswer)
        Score++;
    else
    {
        RevealAnswers();
        setTimeout(() => {
            document.getElementById("anime-card-1").style.opacity = 0;
            document.getElementById("anime-card-2").style.opacity = 0;
            HideAnswers();
        }, 1000);
        setTimeout(() =>
        {
            GameOver();
        }, 1500);
        return;
    }
        
    RevealAnswers();
    UpdateScoreDisplay();
    setTimeout(() => {
        document.getElementById("anime-card-1").style.opacity = 0;
        document.getElementById("anime-card-2").style.opacity = 0;
        HideAnswers();
    }, 1000);
    setTimeout(async ()=> {
        await GetNewVersus();
    }, 2222);
}

function GameOver()
{
    document.getElementById("results-score").innerText = Score;
    Score = 0;
    document.getElementById("result-screen").style = "opacity: 1; pointer-events: inherit;";
    GetNewVersus();
    UpdateScoreDisplay();
}

function UpdateScoreDisplay()
{
    document.getElementById("score").innerText = Score;
    if (Score > HighScore)
    {
        HighScore = Score;
        setCookie("highscore", HighScore, 365);
    }
    document.getElementById("highscore").innerText = HighScore;
}

function RevealAnswers()
{
    document.getElementById("anime-card-1").getElementsByClassName("answer")[0].style.opacity = 1;
    document.getElementById("anime-card-2").getElementsByClassName("answer")[0].style.opacity = 1;
}
function HideAnswers()
{
    document.getElementById("anime-card-1").getElementsByClassName("answer")[0].style.opacity = 0;
    document.getElementById("anime-card-2").getElementsByClassName("answer")[0].style.opacity = 0;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}