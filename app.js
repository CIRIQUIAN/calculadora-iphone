const calc = new Calc.Calculator();
const app = document.querySelector('.calculator'), keypad = document.querySelector('.keypad');
const output = document.querySelector('output'), numberWindow = document.querySelector('#number-window');
const defaults = {format:'eu',keysX:0,keysY:0,gapX:0,gapY:0,displayY:0,iconsX:0,iconsY:8,iconsGap:0};
let settings = {...defaults};
try {
 const saved=JSON.parse(localStorage.getItem('calculator-settings-v2')||'{}');
 for(const key of Object.keys(defaults)) {
  if(key==='format') settings[key]=saved[key]==='intl'?'intl':'eu';
  else if(Number.isFinite(saved[key])) settings[key]=Math.max(-120,Math.min(120,saved[key]));
 }
} catch {}
const signs={'+':'+','-':'−','*':'×','/':'÷'};
function localize(text){return settings.format==='intl'?text.replace(/[.,]/g,c=>c==='.'?',':'.'):text;}
function liveExpression(){
 if(calc.solved)return localize(Calc.format(calc.value));
 const tokens=calc.fresh&&calc.tokens.length?calc.tokens:[...calc.tokens,calc.value];
 return tokens.map(t=>signs[t]||localize(Calc.format(t))).join('');
}
function fitDisplay(){
 output.dataset.size='normal';
 if(output.getBoundingClientRect().width>numberWindow.clientWidth)output.dataset.size='10';
 if(output.getBoundingClientRect().width>numberWindow.clientWidth)output.dataset.size='11';
 numberWindow.classList.toggle('fade',output.getBoundingClientRect().width>numberWindow.clientWidth+.5);
}
function render(){
 output.textContent=liveExpression();
 document.querySelector('#expression').textContent=localize(calc.expression);
 document.querySelector('.clear').textContent=calc.solved||calc.value==='0'?'AC':'C';
 const decimal=keypad.querySelector('[data-key="."]');
 decimal.textContent=settings.format==='intl'?'.':',';
 decimal.setAttribute('aria-label',settings.format==='intl'?'Punto decimal':'Coma decimal');
 fitDisplay();
}
function press(key){calc.press(key);render();}
const panel=document.createElement('section');panel.className='settings-panel';panel.hidden=true;
panel.setAttribute('aria-label','Personalizar calculadora');
panel.innerHTML=`<div class="settings-title"><strong>Ajustes</strong><button type="button" data-close aria-label="Cerrar ajustes">✕</button></div><label class="settings-section">Personalizar <select aria-label="Elemento a personalizar"><option value="keys">Botonera</option><option value="display">Pantalla</option><option value="icons">Iconos superiores</option><option value="format">Formato numérico</option></select></label><div class="settings-controls"></div><div class="settings-footer"><span>Guardado automático · v2</span><button type="button" data-reset>Restablecer</button></div>`;
document.body.append(panel);
const groups={keys:[['keysX','Horizontal',-24,24],['keysY','Vertical',-80,50],['gapX','Espacio entre columnas',-4,6],['gapY','Espacio entre filas',-4,16]],display:[['displayY','Vertical',-100,24]],icons:[['iconsX','Horizontal',-40,40],['iconsY','Vertical',0,120],['iconsGap','Separación',-160,0]]};
function controls(){
 const group=panel.querySelector('select').value; panel.dataset.group=group;
 panel.querySelector('.settings-controls').innerHTML=group==='format'?`<label class="format-choice">Separadores <select id="number-format"><option value="eu">Europea: 1.234,56</option><option value="intl">Internacional: 1,234.56</option></select></label>`:groups[group].map(([key,label,min,max])=>`<label class="setting-row"><span>${label}</span><output>${settings[key]} px</output><input type="range" aria-label="${label}" data-setting="${key}" min="${min}" max="${max}" step="1" value="${settings[key]}"></label>`).join('');
 if(group==='format')panel.querySelector('#number-format').value=settings.format;
}
function clampOffset(element,x,y){
 element.style.transform='none';const r=element.getBoundingClientRect();
 const dx=Math.max(4-r.left,Math.min(x,document.documentElement.clientWidth-4-r.right));
 const dy=Math.max(4-r.top,Math.min(y,window.innerHeight-4-r.bottom));
 element.style.transform=`translate(${dx}px,${dy}px)`;
}
function applySettings(save=false){
 app.style.setProperty('--gap-x-extra',settings.gapX+'px');app.style.setProperty('--gap-y-extra',settings.gapY+'px');
 app.style.setProperty('--icons-y',settings.iconsY+'px');app.style.setProperty('--icons-gap',settings.iconsGap+'px');
 clampOffset(keypad,settings.keysX,settings.keysY);
 clampOffset(document.querySelector('.display'),0,settings.displayY);
 // Header uses a full-width layout; shift the icons inside it rather than its box.
 const header=document.querySelector('header'), icons=[...header.children];
 header.style.transform='none';
 const left=icons[0].getBoundingClientRect().left,right=icons[1].getBoundingClientRect().right;
 header.style.transform=`translateX(${Math.max(4-left,Math.min(settings.iconsX,innerWidth-4-right))}px)`;
 if(save){try{localStorage.setItem('calculator-settings-v2',JSON.stringify(settings));}catch{}}
 render();
}
function openSettings(){panel.hidden=false;controls();panel.querySelector('select').focus();}
panel.querySelector('[data-close]').addEventListener('click',()=>{panel.hidden=true;keypad.querySelector('[data-key="."]').focus();});
panel.querySelector('[data-reset]').addEventListener('click',()=>{settings={...defaults};applySettings(true);controls();});
panel.querySelector('.settings-section select').addEventListener('change',controls);
panel.addEventListener('input',e=>{
 const key=e.target.dataset.setting;
 if(key){settings[key]=Number(e.target.value);e.target.closest('label').querySelector('output').textContent=settings[key]+' px';}
 else if(e.target.id==='number-format')settings.format=e.target.value;else return;
 applySettings(true);
});
const pointers=new Map(),suppressClicks=new WeakSet(),keyboardButtons=new Map();
keypad.addEventListener('pointerdown',e=>{
 const button=e.target.closest('button');
 if(!button||e.button!==0||[...pointers.values()].some(p=>p.button===button))return;
 button.classList.add('pressed');button.setPointerCapture(e.pointerId);
 const state={button,timer:null,long:false,x:e.clientX,y:e.clientY};pointers.set(e.pointerId,state);
 if(button.dataset.key==='.')state.timer=setTimeout(()=>{state.long=true;suppressClicks.add(button);openSettings();},3000);
});
keypad.addEventListener('pointermove',e=>{const s=pointers.get(e.pointerId);if(s&&Math.hypot(e.clientX-s.x,e.clientY-s.y)>12)clearTimeout(s.timer);});
function release(e){
 const s=pointers.get(e.pointerId);if(!s)return;
 clearTimeout(s.timer);s.button.classList.remove('pressed');pointers.delete(e.pointerId);
 if(e.type==='pointercancel'||s.long)suppressClicks.add(s.button);
 setTimeout(()=>suppressClicks.delete(s.button),0);
}
for(const event of ['pointerup','pointercancel','lostpointercapture'])keypad.addEventListener(event,release);
keypad.addEventListener('contextmenu',e=>e.preventDefault());
keypad.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!suppressClicks.has(b))press(b.dataset.key);});
function keyboardKey(e){return ({Enter:'=',Escape:'clear',Backspace:'back',Delete:'clear',',':'.'})[e.key]||e.key;}
document.addEventListener('keydown',e=>{
 if(!panel.hidden){if(e.key==='Escape')panel.querySelector('[data-close]').click();return;}
 const key=keyboardKey(e),b=[...keypad.querySelectorAll('button')].find(b=>b.dataset.key===key);if(!b)return;
 e.preventDefault();b.classList.add('pressed');keyboardButtons.set(e.code,b);if(!e.repeat)press(key);
});
document.addEventListener('keyup',e=>{keyboardButtons.get(e.code)?.classList.remove('pressed');keyboardButtons.delete(e.code);});
function cancelPresses(){for(const s of pointers.values()){clearTimeout(s.timer);s.button.classList.remove('pressed');}pointers.clear();for(const b of keyboardButtons.values())b.classList.remove('pressed');keyboardButtons.clear();}
window.addEventListener('blur',cancelPresses);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelPresses();});
window.addEventListener('resize',()=>applySettings());
if('serviceWorker'in navigator){let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloading){reloading=true;location.reload();}});navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});}
applySettings();

