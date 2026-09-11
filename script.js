let skp = 500;
let connections = [];
let teachLogs = [];
let currentChat = null;

const users = [
{name:"Awa Bamba",teach:"Marketing",learn:"Graphics Design",city:"Abidjan",rating:4.9,swaps:12},
{name:"Koffi Jean",teach:"Graphics Design",learn:"Marketing",city:"Grand-Bassam",rating:4.8,swaps:8},
{name:"Moussa Traoré",teach:"Excel",learn:"Anglais",city:"Abidjan",rating:5.0,swaps:15},
{name:"Fatou Diallo",teach:"Comptabilité",learn:"Excel",city:"Bouaké",rating:4.7,swaps:6},
{name:"Yao Serge",teach:"Anglais",learn:"Comptabilité",city:"Yamoussoukro",rating:4.6,swaps:9},
];

const grid = document.getElementById('grid');
const connList = document.getElementById('connList');
const taughtTo = document.getElementById('taughtTo');

function init(){
  renderGrid(users);
  updateSKP();
  taughtTo.innerHTML = users.map(u=>`<option value="${u.name}">${u.name}</option>`).join('');
}
function renderGrid(list){
  grid.innerHTML='';
  list.forEach(u=>{
    const isConnected = connections.find(c=>c.name===u.name);
    grid.innerHTML+=`
    <div class="card">
      <b>${u.name}</b> <span class="badge">⭐ ${u.rating}</span><br>
      🎓 Enseigne: <b>${u.teach}</b><br>
      📚 Veut apprendre: ${u.learn}<br>
      📍 ${u.city} • ${u.swaps} swaps<br>
      <div class="btns">
        ${!isConnected?`<button class="btn-connect" onclick="connect('${u.name}')">Connecter (Gratuit)</button>`:`<button class="btn-connect" disabled>Connecté ✅</button><button class="btn-unlock" onclick="unlockChat('${u.name}')">💬 ${isConnected.unlocked?'Ouvrir Chat':'Débloquer Chat - 500 SKP'}</button>`}
      </div>
    </div>`;
  });
}
function connect(name){
  if(connections.find(c=>c.name===name)) return;
  connections.push({name,unlocked:false,chat:[]});
  renderGrid(users); renderConnections();
  alert(`Connecté à ${name}! Maintenant débloque le chat avec 500 SKP.`);
}
function renderConnections(){
  if(connections.length===0){connList.innerHTML='<p style="text-align:center;padding:20px">Pas encore de connexions. Va dans Découvrir.</p>';return;}
  connList.innerHTML = connections.map(c=>`
    <div class="conn-item">
      <div><b>${c.name}</b><br><small>${c.unlocked?'Chat débloqué ✅':'Chat verrouillé 🔒'}</small></div>
      <button class="btn-unlock" onclick="unlockChat('${c.name}')">${c.unlocked?'Ouvrir Chat 💬':'Débloquer (500 SKP)'}</button>
    </div>
  `).join('');
}
function unlockChat(name){
  let conn = connections.find(c=>c.name===name);
  if(!conn) return;
  if(conn.unlocked){openChat(name);return;}
  if(skp < 500){alert(`SKP insuffisant! Tu as ${skp} SKP, il faut 500. Enseigne pour gagner +250 SKP.`); showTab('teach'); return;}
  skp -= 500;
  conn.unlocked = true;
  updateSKP();
  openChat(name);
}
function openChat(name){
  currentChat = connections.find(c=>c.name===name);
  document.getElementById('chatName').innerText = `Chat avec ${name}`;
  document.getElementById('chatModal').classList.add('show');
  renderChat();
}
function renderChat(){
  const box = document.getElementById('chatBox');
  box.innerHTML = currentChat.chat.map(m=>`<div class="msg ${m.me?'me':'them'}">${m.text}</div>`).join('');
  if(currentChat.chat.length===0) box.innerHTML='<p style="text-align:center;color:#6b7280;font-size:13px">Chat débloqué! Dites bonjour 👋</p>';
  box.scrollTop = box.scrollHeight;
}
function sendMsg(){
  const input = document.getElementById('chatInput');
  if(!input.value.trim()) return;
  currentChat.chat.push({text:input.value,me:true});
  input.value='';
  renderChat();
  setTimeout(()=>{currentChat.chat.push({text:"Super! On se voit samedi pour la session?",me:false}); renderChat();},800);
}
function closeChat(){document.getElementById('chatModal').classList.remove('show'); renderConnections(); renderGrid(users);}
function confirmTeach(){
  const to = taughtTo.value;
  const skill = document.getElementById('skillTaught').value;
  skp += 250;
  teachLogs.unshift(`+250 SKP - Enseigné ${skill} à ${to} (GPS vérifié ✅)`);
  updateSKP();
  document.getElementById('teachHistory').innerHTML = teachLogs.map(l=>`<div>✅ ${l}</div>`).join('');
  alert(`Bien! +250 SKP gagné! Nouveau solde: ${skp} SKP`);
}
function updateSKP(){document.getElementById('skp').innerText = skp;}
function showTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('header nav button').forEach(b=>b.classList.remove('active'));
}
function doSearch(){
  const q = document.getElementById('q').value.toLowerCase();
  const filtered = users.filter(u=>u.teach.toLowerCase().includes(q) || u.learn.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
  renderGrid(filtered);
}
init();
