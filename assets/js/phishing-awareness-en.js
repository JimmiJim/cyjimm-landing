const QUESTION_BANK={
  easy:[
    {id:1,title:'Is this phishing?',prompt:'An email asks you to reset your password using an unidentified external link.',choices:[{label:'Yes, it is suspicious',correct:true},{label:'No, it is legitimate',correct:false},{label:'Forward it to a group chat to ask who else received it',correct:false}],explanation:'A reset request using an external domain is a classic warning sign.'},
    {id:2,title:'What should you do with a ZIP file?',prompt:'You receive a ZIP file from someone you were not expecting to hear from.',choices:[{label:'Do not open it; verify the sender and request',correct:true},{label:'Open it just to take a look',correct:false},{label:'Download it to the desktop and decide later',correct:false}],explanation:'An unexpected file, especially a ZIP file, requires you to stop and verify.'},
    {id:3,title:'Identify the domain',prompt:'The link is login-microsoft-secure.xyz',choices:[{label:'Suspicious',correct:true},{label:'Legitimate',correct:false},{label:'Probably legitimate because it contains the word microsoft',correct:false}],explanation:'This is not an official Microsoft domain.'},
    {id:6,title:'Debt SMS with a shortened link',prompt:'You receive an SMS claiming you have an outstanding debt. It includes a reference number, part of your national ID, and a TinyURL payment link.',choices:[{label:'Do not click; independently open the official website or app and verify there',correct:true},{label:'Click because the message knows your ID details',correct:false},{label:'Click because the sender uses a local phone number',correct:false}],explanation:'Personal details and a local number are not proof of legitimacy. A shortened link hides the destination, so verify through a separate official channel.'}
  ],
  medium:[
    {id:4,title:'MFA code',prompt:'An email asks you to send an MFA code to complete a sign-in.',choices:[{label:'Do not send it; report the request',correct:true},{label:'Send it if the sender sounds urgent',correct:false},{label:'Send only the last digits to be safe',correct:false}],explanation:'An MFA code is personal and must not be shared.'},
    {id:7,title:'The message knows personal details',prompt:'A suspicious SMS contains your name, phone number, and part of your national ID. What does that prove?',choices:[{label:'It does not prove the sender is genuine; the data may come from a leak',correct:true},{label:'Only an official organization could know those details',correct:false},{label:'If at least two details are correct, the link is safe',correct:false}],explanation:'Attackers use real data gathered or leaked from datasets to make personalized smishing more convincing.'}
  ],
  hard:[
    {id:5,title:'Different Reply-To address',prompt:'The sender appears legitimate, but the Reply-To address is completely different.',choices:[{label:'That is a warning sign',correct:true},{label:'It does not matter if the subject is familiar',correct:false},{label:'Reply-To matters only when there is an attachment',correct:false}],explanation:'An unusual Reply-To address is an important indicator.'},
    {id:8,title:'Verify a government message',prompt:'An SMS displays the name of a government authority, a case number, and a shortened link. What is the best verification method?',choices:[{label:'Independently open gov.il or the official app and check whether the request exists',correct:true},{label:'Click the link and see whether the website looks professional',correct:false},{label:'Reply to the SMS and ask the sender to confirm it is genuine',correct:false}],explanation:'Real verification uses a channel separate from the suspicious message. Professional design, a case number, or a sender name are not enough.'}
  ]
};
const LEVEL_CONFIG={easy:{label:'Easy',time:90},medium:{label:'Medium',time:75},hard:{label:'Hard',time:60}};
const state={score:0,answered:new Set(),lockedQuestions:new Set(),level:'easy',timeLeft:0,timer:null,currentQuestions:[]};
function shuffleArray(items){const arr=items.slice();for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function getQuestionsForLevel(level){let q=[];if(level==='easy')q=QUESTION_BANK.easy.slice();else if(level==='medium')q=QUESTION_BANK.easy.concat(QUESTION_BANK.medium);else q=QUESTION_BANK.easy.concat(QUESTION_BANK.medium,QUESTION_BANK.hard);return q.map(question=>({...question,choices:shuffleArray(question.choices.slice())}));}
function capitalize(text){return text.charAt(0).toUpperCase()+text.slice(1);}
function goToSection(id){document.querySelectorAll('.section').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.target===id));document.querySelectorAll('.mnav').forEach(b=>b.classList.toggle('active',b.dataset.target===id));if(window.innerWidth<=640){closeMobileMenu();window.scrollTo({top:0,behavior:'smooth'});}}
function toggleMobileMenu(){const drawer=document.getElementById('mobileDrawer');const backdrop=document.getElementById('mobileDrawerBackdrop');const fab=document.getElementById('mobileMenuFab');const isOpen=drawer.classList.contains('open');drawer.classList.toggle('open',!isOpen);backdrop.classList.toggle('open',!isOpen);fab.setAttribute('aria-expanded',String(!isOpen));}
function closeMobileMenu(){document.getElementById('mobileDrawer').classList.remove('open');document.getElementById('mobileDrawerBackdrop').classList.remove('open');document.getElementById('mobileMenuFab').setAttribute('aria-expanded','false');}
function setLevel(level){state.level=level;const levelLabel=LEVEL_CONFIG[level].label;document.getElementById('levelValue').textContent=levelLabel;document.getElementById('mobileLevelValue').textContent=levelLabel;['easy','medium','hard'].forEach(function(key){const btn=document.getElementById('level'+capitalize(key));if(btn)btn.classList.toggle('active-filter',key===level);});updateCountersPreview();}
function updateCountersPreview(){const total=getQuestionsForLevel(state.level).length;document.getElementById('totalQuestionsValue').textContent=String(total);}
function startTraining(){clearInterval(state.timer);state.score=0;state.answered.clear();state.lockedQuestions.clear();state.currentQuestions=getQuestionsForLevel(state.level);state.timeLeft=LEVEL_CONFIG[state.level].time;document.getElementById('scoreValue').textContent='0';document.getElementById('mobileScoreValue').textContent='0';document.getElementById('answeredValue').textContent='0';document.getElementById('totalQuestionsValue').textContent=String(state.currentQuestions.length);document.getElementById('statusValue').textContent='Starting';document.getElementById('timerValue').textContent=String(state.timeLeft);document.getElementById('timerBox').classList.remove('hidden');document.getElementById('resultBox').classList.add('hidden');renderQuestions();goToSection('quiz');state.timer=setInterval(function(){state.timeLeft-=1;document.getElementById('timerValue').textContent=String(Math.max(state.timeLeft,0));if(state.timeLeft<=0)finishTraining('Time expired.');},1000);}
function renderQuestions(){const c=document.getElementById('quizContainer');c.innerHTML=state.currentQuestions.map(function(q){return `<div class="box" id="question-${q.id}"><h3>${q.title}</h3><p>${q.prompt}</p><div class="question-choices">${q.choices.map((choice,index)=>`<button class="btn secondary" data-question-id="${q.id}" data-choice-index="${index}">${choice.label}</button>`).join('')}</div><div class="feedback" id="feedback-${q.id}"></div></div>`;}).join('');}
function answerQuestion(questionId,choiceIndex,buttonEl){if(state.lockedQuestions.has(questionId))return;const q=state.currentQuestions.find(x=>x.id===questionId);if(!q)return;const selected=q.choices[choiceIndex];const box=document.getElementById('question-'+questionId);const buttons=box.querySelectorAll('button');const feedback=document.getElementById('feedback-'+questionId);const correctIndex=q.choices.findIndex(c=>c.correct);buttons.forEach(btn=>btn.disabled=true);state.lockedQuestions.add(questionId);state.answered.add(questionId);if(selected.correct){state.score+=10;buttonEl.classList.add('answer-correct');feedback.innerHTML='✅ <strong>Correct.</strong> '+q.explanation;}else{buttonEl.classList.add('answer-incorrect');if(buttons[correctIndex]){buttons[correctIndex].classList.add('answer-correct');}feedback.innerHTML='❌ <strong>Incorrect.</strong> '+q.explanation;}feedback.classList.add('show');updateDashboard();if(state.answered.size>=state.currentQuestions.length)finishTraining('You answered every question.');}
function updateDashboard(){document.getElementById('scoreValue').textContent=String(state.score);document.getElementById('mobileScoreValue').textContent=String(state.score);document.getElementById('answeredValue').textContent=String(state.answered.size);let status='Beginner';if(state.score>=30)status='Advanced';if(state.score>=60)status='Sharp-eyed';if(state.score>=90)status='Security Aware';document.getElementById('statusValue').textContent=status;}
function finishTraining(reason){clearInterval(state.timer);state.timer=null;const total=state.currentQuestions.length||getQuestionsForLevel(state.level).length;const percentage=total?Math.round((state.score/(total*10))*100):0;const resultBox=document.getElementById('resultBox');resultBox.classList.remove('hidden');resultBox.innerHTML=`<h3>🏁 Training Complete</h3><p><strong>Status:</strong> ${reason}</p><p><strong>Score:</strong> ${state.score} out of ${total*10}</p><p><strong>Success rate:</strong> ${percentage}%</p><p><strong>Difficulty:</strong> ${LEVEL_CONFIG[state.level].label}</p>`;}
setLevel('easy');updateCountersPreview();
function bindPageControls() {
  document.querySelectorAll('[data-section-target]').forEach(function (button) {
    button.addEventListener('click', function () { goToSection(button.dataset.sectionTarget); });
  });
  document.querySelectorAll('[data-level]').forEach(function (button) {
    button.addEventListener('click', function () { setLevel(button.dataset.level); });
  });
  document.querySelectorAll('[data-start-training]').forEach(function (button) {
    button.addEventListener('click', startTraining);
  });
  document.querySelectorAll('[data-toggle-mobile-menu]').forEach(function (button) {
    button.addEventListener('click', toggleMobileMenu);
  });
  document.querySelectorAll('[data-close-mobile-menu]').forEach(function (button) {
    button.addEventListener('click', closeMobileMenu);
  });
  document.getElementById('quizContainer').addEventListener('click', function (event) {
    const button = event.target.closest('[data-question-id][data-choice-index]');
    if (!button) return;
    answerQuestion(Number(button.dataset.questionId), Number(button.dataset.choiceIndex), button);
  });
}

bindPageControls();
