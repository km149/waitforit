'use strict';

/** Birthday Surprise — fully offline, no libraries or external accounts needed. */
const $ = (id) => document.getElementById(id);
const main = $('main');
const stickers = $('stickers');
const app = $('app');
const confetti = $('confetti');
const icon = (name) => `assets/${name}.svg`;
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const normalized = (value) => value.toLowerCase().replace(/\s+/g, '');
const entryNames = new Set(['gulbano', 'guluna', 'halimo']);
const favoriteNames = new Set(['mamun', 'mamoon', 'mamunkhan', 'mamoonkhan']);
const questions = [
  {
    title: 'First of all... why are you being so cute and suspicious? 👀',
    choices: [
      ["I don't wanna talk 🙄", "Ohhh, someone's giving us attitude already? 😭 Fineee, we'll keep this between us... for now. 🤭"],
      ['Hehe, am I really that cute? 🥺💕', "Awww, look who's getting shy! 🤭 Yes, you are. But don't let it go to your head. 💗"],
      ["Because I'm just that cute 🥹", 'Awww, confidence detected! 💗 We might have to agree with you on this one.']
    ]
  },
  {
    title: 'Okay, serious question... are you secretly a little drama queen? 🎀',
    choices: [
      ['Cause I want huggies 🥺🫂', 'Awww, so all this drama was just for some huggies? 😭💕 Come here, you little cutie! 🫂'],
      ["Hehe, maybeee... don't expose me 🥺🎀", 'Awww, your little secret is safe with us. Probably. 🤭💕'],
      ['Maybe a tiny bit 🤏', "A tiny bit? Awww, at least you're honest. 🤭💕"]
    ]
  },
  {
    title: 'Be honest... do you secretly love being pampered? 🥺💕',
    choices: [
      ['Yesss, I want all the cuddles 🥹🫂', 'Awww, somebody wants to be spoiled with love! 😭💕'],
      ['Only by my favorite person 🤭💗', "Ohooo, there's a favorite person? 👀 Interesting... tell us more."],
      ["Nooo, I'm a strong independent baby 🙄", 'A strong independent BABY? 😭 Okay, cutie, whatever you say. 🎀']
    ]
  }
];
const secrets = [
  ['🔎', 'Wait a second... 👀', "Wait a second... 👀 Your answers have been reviewed. But there's something unusual about your investigation file."],
  ['🎀', 'Hmm... interesting 🤭', "Hmm... interesting. 🤭 Apparently, someone thinks you're a little dramatic, a little stubborn, and way too adorable."],
  ['💗', "But here's the thing... 🥺", 'But here\'s the thing... 🥺 That same someone also thinks your smile is pretty special. And they wanted to make you smile today.'],
  ['💌', 'One last secret... 💌', "One last secret... 💌 This whole investigation? It wasn't really about finding out who you are. Someone just wanted to make something special for you."]
];
const decorations = [
  ['bow',3,5,44],['flower',17,13,34],['heart',35,4,31],['cat',76,8,42],['cherry',92,14,35],
  ['star',5,36,30],['bunny',89,40,42],['lipgloss',14,61,33],['rainbow',82,65,41],['sparkle',3,79,28],
  ['envelope',26,88,39],['cake',55,91,38],['glove',73,87,31],['moon',93,87,32],['flower',61,3,29],
  ['eyeliner',96,59,32],['smile',7,93,34],['gift',94,29,32],['bow',44,86,25],['heart',70,53,25],
  ['star',30,35,21],['cherry',74,27,25],['sparkle',52,15,25],['flower',89,76,27]
];
let page = 0;
let questionNumber = 0;
let selected = -1;
let secretNumber = 0;
let visitorName = '';
let timers = [];
const later = (callback, ms) => {const id = window.setTimeout(callback, ms); timers.push(id); return id;};
function clearTimers(){timers.forEach(window.clearTimeout);timers=[];}
function decorate(){
  stickers.innerHTML = decorations.map(([which,x,y,s],i) =>
    `<span class="sticker" style="--x:${x}%;--y:${y}%;--s:${s}px;--opacity:${i%4===0?.73:1};--duration:${3.2+(i%7)*.62}s;--delay:-${(i%6)*.61}s"><img src="${icon(which)}" alt="" draggable="false"></span>`
  ).join('');
}
function footerIcons(){return `<div class="footer-stickers" aria-hidden="true">${['bow','star','flower','heart','cherry'].map(i=>`<img src="${icon(i)}" alt="">`).join('')}</div>`;}
function panel(inner, extra=''){
  main.innerHTML = `<section class="panel ${extra}">${inner}</section>`;
  window.scrollTo({top:0,behavior:'instant'});
}
function changePage(next){
  clearTimers();page=next;
  app.classList.toggle('punch-mode',false);
  document.title = page===4?'Happiest Birthday! 🎂':'A Little Secret 🎀';
  if(page===0)showEntry();
  if(page===1)showQuestion();
  if(page===2)showSecret();
  if(page===3)startCountdown();
  if(page===4)showBirthday();
}
function showEntry(message='',success=false){
  panel(`
    <img class="hero-icon" src="${icon('bow')}" alt="Pink pixel-art bow" />
    <span class="tag">TOP SECRET ✨</span>
    <h1 class="headline">Who's Dis? 👀</h1>
    <p class="lead">Hold uppp... before you go any further, we need to know who you are. 🤨</p>
    <form id="entry-form" novalidate>
      <label class="screen-reader-only" for="entry-name">Your name</label>
      <input class="field" id="entry-name" name="name" type="text" autocomplete="off" maxlength="65" placeholder="Enter your name..." required />
      <button class="btn block" type="submit">Let me innn! ✨</button>
    </form>
    <div id="entry-response" role="status">${message?`<div class="reply ${success?'':'bad'}">${escapeHTML(message)}</div>`:''}</div>
    ${success?'<button class="btn block" id="enter-next" style="margin-top:16px">Come on in 💗</button>':''}
    <p class="hint">Only special people are allowed in here. 🤫</p>
    ${footerIcons()}`);
  const input = $('entry-name');input.value=visitorName;
  $('entry-form').addEventListener('submit',(e)=>{
    e.preventDefault();visitorName=input.value;
    const good=entryNames.has(normalized(visitorName));
    const msg=good?`Ohhh, ${visitorName.trim()}! It's YOU! 👀 Okay okay, you're on the list. Come on in... 💗`:
      "Ummm, who invited you? 🤨🎀 You're not on our secret list. Try againnn! 🤭";
    showEntry(msg,good);
    if(!good){$('entry-name').focus();$('entry-name').select();}
  });
  if(success)$('enter-next').addEventListener('click',()=>changePage(1));
}
function showQuestion(){
  if(questionNumber===3){showFavorite();return;}
  const item=questions[questionNumber];
  panel(`
    <img class="hero-icon" src="${icon('cat')}" alt="Cute pixel-art cat" />
    <span class="tag">The Cute Investigation Dept. 🎀</span>
    <h1 class="headline" style="font-size:clamp(1.85rem,4.5vw,2.55rem)">Very important questions 👀</h1>
    <p class="lead">No suspicious answers, please. 🤭</p>
    <div class="progress-meta"><span>QUESTION ${questionNumber+1} OF 4</span><span>${questionNumber*25}% COMPLETE</span></div>
    <div class="track" aria-label="Investigation progress"><div class="bar" style="width:${questionNumber*25}%"></div></div>
    <h2 class="question">${escapeHTML(item.title)}</h2>
    <div class="options">${item.choices.map(([answer],i)=>`<button type="button" class="option" data-option="${i}" aria-pressed="${i===selected}">${escapeHTML(answer)}</button>`).join('')}</div>
    <div id="answer-result" role="status">${selected<0?'':`<div class="reply">${escapeHTML(item.choices[selected][1])}</div><button class="btn block" id="next-question" style="margin-top:16px">Next question 💗</button>`}</div>
    <button class="back-btn" type="button" id="question-back">← Previous question</button>
    ${footerIcons()}`);
  main.querySelectorAll('[data-option]').forEach(btn=>btn.addEventListener('click',()=>{
    selected=Number(btn.dataset.option);showQuestion();
  }));
  if(selected>=0)$('next-question').addEventListener('click',()=>{questionNumber++;selected=-1;showQuestion();});
  $('question-back').addEventListener('click',()=>{
    if(questionNumber===0){questionNumber=0;selected=-1;changePage(0)}
    else{questionNumber--;selected=-1;showQuestion();}
  });
}
function showFavorite(message='',good=false){
  panel(`
    <img class="hero-icon" src="${icon('envelope')}" alt="Pixel-art envelope" />
    <span class="tag">ONE LAST QUESTION 💌</span>
    <h1 class="headline" style="font-size:clamp(1.85rem,4.5vw,2.55rem)">Almost doneee! 🤭</h1>
    <div class="progress-meta"><span>QUESTION 4 OF 4</span><span>75% COMPLETE</span></div>
    <div class="track"><div class="bar" style="width:75%"></div></div>
    <h2 class="question">Okayyy, one last thing... who's your favorite person? 👀💗</h2>
    <form id="fav-form" novalidate>
      <label class="screen-reader-only" for="fav-name">Your favorite person's name</label>
      <input class="field" id="fav-name" type="text" placeholder="Type their name..." maxlength="65" autocomplete="off" required />
      <button type="submit" class="btn block">Submit answer 💌</button>
    </form>
    <div role="status" id="fav-response">${message?`<div class="reply ${good?'':'bad'}">${escapeHTML(message)}</div>`:''}</div>
    ${good?'<button class="btn block" id="secret-next" style="margin-top:16px">See what we found 👀</button>':''}
    <button class="back-btn" type="button" id="fav-back">← Previous question</button>
    ${footerIcons()}`);
  const input=$('fav-name');input.value=showFavorite.lastValue||'';
  $('fav-form').addEventListener('submit',(e)=>{
    e.preventDefault();showFavorite.lastValue=input.value;
    const valid=favoriteNames.has(normalized(input.value));
    const response=valid?`Ohoooo, ${input.value.trim()}? 👀💕 Hehe, we had a feeling! 🤭 But wait... we found something else in your file.`:
      'Hmm... are you sureee? 🥺 Our secret file says otherwise. Try again, cutie. 🤭';
    showFavorite(response,valid);
    if(!valid){$('fav-name').focus();$('fav-name').select();}
  });
  if(good)$('secret-next').addEventListener('click',()=>{secretNumber=0;changePage(2)});
  $('fav-back').addEventListener('click',()=>{questionNumber=2;selected=-1;showQuestion()});
}
function showSecret(){
  const [symbol,heading,body]=secrets[secretNumber];
  panel(`
    <img class="hero-icon" src="${icon('envelope')}" alt="Pixel-art secret letter" />
    <span class="tag">CLASSIFIED FILE 💌</span>
    <h1 class="headline">The Secret Discovery</h1>
    <p class="lead">Something interesting was found in your file... 🤭</p>
    <div class="secret-card fade-in" key="${secretNumber}">
      <div class="secret-emoji" aria-hidden="true">${symbol}</div>
      <h2 class="secret-title">${escapeHTML(heading)}</h2>
      <p class="secret-copy">${escapeHTML(body)}</p>
    </div>
    <div class="dots" aria-label="Secret ${secretNumber+1} of 4">${secrets.map((_,i)=>`<span class="dot ${i===secretNumber?'active':''}"></span>`).join('')}</div>
    <button class="btn block" id="more-secret">${secretNumber===3?'Reveal the secret 🎁':'Keep reading 👀'}</button>
    <div class="btn-row"><button class="btn secondary" id="previous-secret" ${secretNumber===0?'disabled':''}>← Previous</button><button class="btn secondary" id="restart-secret">Read again ↻</button></div>
    ${footerIcons()}`);
  $('more-secret').addEventListener('click',()=>{if(secretNumber<3){secretNumber++;showSecret()}else changePage(3)});
  $('previous-secret').addEventListener('click',()=>{secretNumber=Math.max(0,secretNumber-1);showSecret()});
  $('restart-secret').addEventListener('click',()=>{secretNumber=0;showSecret()});
}
function startCountdown(){
  main.innerHTML=`<section class="count-layout" aria-label="Surprise countdown"><div class="tag">THE FINAL SECRET 🎀</div><h1 class="count-label">Something is waiting for you... 👀</h1><div id="count-number" class="count-number" aria-live="off">3</div><p class="lead">Just one tiny moment, girlieee! 💗</p></section>`;
  window.scrollTo({top:0,behavior:'instant'});
  // Display each numeral for roughly one second. Entering this page starts automatically.
  later(()=>updateNumber(2),950);
  later(()=>updateNumber(1),1900);
  later(showPunch,2850);
}
function updateNumber(number){
  const el=$('count-number');if(!el)return;el.textContent=number;
  el.style.animation='none';void el.offsetWidth;el.style.animation='';
}
function showPunch(){
  app.classList.add('punch-mode');
  main.innerHTML=`<section class="punch-screen" aria-label="A cute cat boxing punch! DANG!">
    <span class="tag">SURPRISE ATTACK! 🥊</span>
    <div class="boxing-stage"><img class="boxing-cat" src="${icon('cat')}" alt="Cute pixel-art cat" /><img class="boxing-glove" src="${icon('glove')}" alt="Pink pixel-art boxing glove" /><div class="impact" aria-label="DANG!">DANG!</div></div>
    <p class="punch-caption">hehe, gotcha! 💗</p></section>`;
  later(()=>changePage(4),1750);
}
function showBirthday(){
  panel(`
    <img class="hero-icon" src="${icon('cake')}" alt="Pixel-art birthday cake" />
    <span class="tag">SURPRISEEEE! 🎀💗</span>
    <h1 class="headline">Happiest Birthday! 🎂</h1>
    <h2 class="subheading">Cutie Pretti :( Chashmish 💗</h2>
    <div class="small-divider" aria-hidden="true">✦ ♡ ✦ ♡ ✦</div>
    <div class="birthday-note">
      <p class="opening">Mmmm, Happyyy Birthday, girllll! 🥹🎀💗</p>
      <p>Another year of being a tiny menace with the prettiest smile! Wishing you pretty flowers, sweet little surprises, lots of cake, endless giggles, and a whole lot of happiness for the birthday girlieee! 🌷💗</p>
      <p>And of courseee, may your eyeliner wings never match, your favorite lip glosses mysteriously disappear, and your hair choose violence at every important event. 💅🎀</p>
      <p>Hehe, stay pretty and have the cutest birthday everrr! 🤭💕</p>
    </div>
    <div class="small-divider" aria-hidden="true">✦ ♡ ✦ ♡ ✦</div>
    <p class="ending">Yk what to send now 🤭💗</p>
    ${footerIcons()}
  `,'birthday-panel');
  fireConfetti();
}
function fireConfetti(){
  confetti.innerHTML='';
  const colors=['#f59ebe','#fad977','#a68ac8','#fff6f2','#82b88e'];
  for(let i=0;i<48;i++){
    const el=document.createElement('span');el.className='confetti-piece';
    el.style.setProperty('--left',`${Math.random()*100}%`);
    el.style.setProperty('--w',`${5+Math.random()*6}px`);
    el.style.setProperty('--h',`${7+Math.random()*8}px`);
    el.style.setProperty('--delay',`${Math.random()*.85}s`);
    el.style.setProperty('--time',`${2.3+Math.random()*2.2}s`);
    el.style.setProperty('--sway',`${-130+Math.random()*260}px`);
    el.style.setProperty('--rot',`${Math.random()*360}deg`);
    el.style.setProperty('--color',colors[i%colors.length]);confetti.append(el);
  }
  later(()=>confetti.innerHTML='',5700);
}
decorate();changePage(0);
