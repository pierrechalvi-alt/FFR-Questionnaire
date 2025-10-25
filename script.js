document.addEventListener('DOMContentLoaded',()=>{
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const progressBar=$('#progress-bar'),progressText=$('#progress-text'),form=$('#questionnaireForm');
const updateProgress=()=>{const filled=$$('input:checked,input[type=text][value]').length;
const total=$$('input').length;const pct=Math.min(100,Math.round((filled/total)*100));
progressBar.style.width=pct+'%';progressText.textContent='Progression : '+pct+'%';};
document.addEventListener('change',updateProgress);

// champs autre visibles -> obligatoires si cochés
const toggleOther=(chkSel,inputSel)=>{
const c=$(`${chkSel}`),t=$(`${inputSel}`);
if(!c||!t)return;c.addEventListener('change',()=>{t.style.display=c.checked?'block':'none';t.required=c.checked;});};
toggleOther('#barrieres input[value="Autre"]','#barrieres-autre');
toggleOther('#raisons input[value="Autre"]','#raisons-autre');
toggleOther('input[name="role"][value="Autre"]','#role-autre');
toggleOther('input[name="equipe"][value="Autre"]','#equipe-autre');

// apparition du test combat si retour au jeu coché
document.addEventListener('change',()=>{
const anyReturn=$$('input[value="Retour au jeu"]:checked').length>0;
let combat=document.querySelector('#global-combat');
if(anyReturn&&!combat){combat=document.createElement('div');combat.id='global-combat';combat.className='subcard';
combat.innerHTML='<h3>Tests spécifiques de combat</h3><label><input type="radio" name="combat" value="Oui"> Oui</label><label><input type="radio" name="combat" value="Non"> Non</label>';
document.querySelector('#globalBlocks')?.appendChild(combat);}
if(!anyReturn&&combat)combat.remove();
});

// cheville/pied logique modifiée simplifiée : gastro/soleaire
const fixAnkleLogic=()=>{
$$('.subcard h6').forEach(h=>{
if(h.textContent.includes('Gastrocn')){
const block=h.closest('.subcard');
const tests=['Heel Raise – genou tendu (1RM)','Heel Raise – max reps','Isométrie 90°','Autre'];
block.innerHTML='<h6>Gastrocnémien</h6>'+
'<label>Outils utilisés</label><div class="checkbox-group"><label><input type="checkbox" value="Dynamomètre"> Dynamomètre</label></div>'+
'<label>Tests spécifiques</label><div class="checkbox-group">'+tests.map(t=>`<label><input type="checkbox" value="${t}"> ${t}</label>`).join('')+'</div>'+
'<label>Paramètres étudiés</label><div class="checkbox-group"><label><input type="checkbox" value="Force max (N)"> Force max (N)</label></div>'+
'<label>Critères d’évaluation</label><div class="checkbox-group"><label><input type="checkbox" value="Ratio droite/gauche"> Ratio droite/gauche</label></div>';
}
if(h.textContent.includes('Soléaire')){
const block=h.closest('.subcard');
const tests=['Isométrie 90°','Autre'];
block.innerHTML='<h6>Soléaire</h6>'+
'<label>Outils utilisés</label><div class="checkbox-group"><label><input type="checkbox" value="Dynamomètre"> Dynamomètre</label></div>'+
'<label>Tests spécifiques</label><div class="checkbox-group">'+tests.map(t=>`<label><input type="checkbox" value="${t}"> ${t}</label>`).join('')+'</div>'+
'<label>Paramètres étudiés</label><div class="checkbox-group"><label><input type="checkbox" value="Force max (N)"> Force max (N)</label></div>'+
'<label>Critères d’évaluation</label><div class="checkbox-group"><label><input type="checkbox" value="Ratio droite/gauche"> Ratio droite/gauche</label></div>';
}});
};
document.addEventListener('change',fixAnkleLogic);
updateProgress();
});