const calc=new Calc.Calculator();const output=document.querySelector('output');
function render(){output.textContent=Calc.format(calc.value);const digits=calc.value.replace(/[^0-9]/g,'').length;output.dataset.size=String(Math.min(digits,12));document.querySelector('#number-window').classList.toggle('fade',digits>=12);document.querySelector('#expression').textContent=calc.expression;document.querySelector('.clear').textContent=calc.solved||calc.value==='0'?'AC':'C';}
document.querySelector('.keypad').addEventListener('click',e=>{const b=e.target.closest('button');if(b){calc.press(b.dataset.key);render();}});
document.addEventListener('keydown',e=>{const key=({Enter:'=',Escape:'clear',Backspace:'back',Delete:'clear',',':'.'})[e.key]||e.key;if(/^[0-9.+*/%=\-]$/.test(key)||['clear','back'].includes(key)){e.preventDefault();calc.press(key);render();}});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});render();
