/* =========================================================
QUESTIONNAIRE – Version finale corrigée
Structure et logique identiques à ta version d’origine
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

// --- Helpers
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const slug = s => (s||"").toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-');
const esc = s => s.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|/@])/g,'\\$1');
const byId = id => document.getElementById(id);
const requiredIfVisible = el => el && el.offsetParent !== null;

/* ---------------------------------------------
* Rôle / Équipe : champs "Autre"
* ------------------------------------------- */
const toggleOther = (name, inputId) => {
  $(`input[name='${name}'][value='Autre']`)?.addEventListener("change", e => {
    byId(inputId).style.display = e.target.checked ? "block" : "none";
  });
  $$(`input[name='${name}']`).forEach(r => r.addEventListener("change", e => {
    if (e.target.value !== "Autre") byId(inputId).style.display = "none";
  }));
};
toggleOther("role", "role-autre");
toggleOther("equipe", "equipe-autre");

/* ---------------------------------------------
* Constantes & libellés
* ------------------------------------------- */
const headNeck = ["Tête","Rachis cervical"];
const headNeckTitle = "Tête / Rachis cervical";
const lowerBody = ["Hanche","Genou","Cheville / Pied"];

const toolsForce = ["Dynamomètre manuel","Dynamomètre fixe","Isocinétisme","Plateforme de force","Sans outil","Autre"];
const toolsMobBase = ["Goniomètre","Inclinomètre","Autre"];

const paramsForce = ["Force max (N)","Force moyenne (N)","Force relative (N/kg)","Puissance (W/kg)","RFD (Rate of Force Development)","Angle du pic de force (°)","Endurance (s)"];
const criteriaGeneric = ["Ratio agoniste/antagoniste","Comparaison droite/gauche","Valeur de référence individuelle","Autre"];

const proprioByZone = {
  "Cheville / Pied":["Y-Balance Test","Star Excursion","Single Leg Balance Test","Autre"],
  "Genou":["Y-Balance Test","Star Excursion","FMS (Lower)","Autre"],
  "Hanche":["Y-Balance Test","Star Excursion","FMS (Lower)","Autre"],
  "Épaule":["Y-Balance Test (épaule)","FMS (Upper)","Autre"],
  [headNeckTitle]:["Test proprio cervical (laser)","Autre"],
  "Rachis lombaire":["FMS (Core)","Autre"],
  "Poignet / Main":[],
  "Coude":[]
};
const questionnairesByZone = {
  "Genou":["KOOS","IKDC","Lysholm","Tegner","ACL-RSI","KOS-ADLS","LEFS","Autre"],
  "Hanche":["HAGOS","iHOT-12","HOOS","HOS","Autre"],
  "Épaule":["QuickDASH","DASH","SIRSI","ASES","SPADI","Oxford Shoulder Score","Autre"],
  "Coude":["Oxford Elbow Score","MEPS","DASH","QuickDASH","Autre"],
  "Poignet / Main":["PRWE","DASH","QuickDASH","Boston Carpal Tunnel","Autre"],
  "Cheville / Pied":["CAIT","FAAM-ADL","FAAM-Sport","FAOS","FFI","Autre"],
  "Rachis lombaire":["ODI (Oswestry)","Roland-Morris","Quebec Back Pain","FABQ","Autre"],
  [headNeckTitle]:["SCAT6","Neck Disability Index (NDI)","Copenhagen Neck Functional Scale","Autre"]
};

const testsByMuscle = {
  "Ischiojambiers":["McCall 90°","Isométrie 30°","Nordic","Nordic Hold","Razor Curl","Single Leg Bridge","Autre"],
  "Quadriceps":["Isométrie 60°","Leg Extension","Single Leg Squat","Autre"],
  "Gastrocnémien":["Heel Raise – genou tendu (1RM)","Heel Raise – max reps","Isométrie 90°","Autre"],
  "Soléaire":["Isométrie 90°","Autre"],
  "Inverseurs/Éverseurs":["Dynamométrie manuelle","Dynamométrie fixe","Autre"],
  "Intrinsèques du pied":["Toe Curl test","Short Foot test","Dynamométrie","Plateforme de pressions","Autre"]
};

const isokineticSpeeds = ["30°/s","60°/s","120°/s","180°/s","Autre"];
const isokineticModes = ["Concentrique","Excentrique"];

/* ---------------------------------------------
* Zones & conteneurs
* ------------------------------------------- */
const zoneContainer = byId("zoneQuestions");
const zonesCbs = $$("#zones input[type='checkbox']");

/* ---------------------------------------------
* Utilitaires d’UI
* ------------------------------------------- */
const ensureOtherText = (groupEl) => {
  const others = groupEl ? [...groupEl.querySelectorAll("input[type='checkbox'][value='Autre']")] : [];
  if (others.length > 1) {
    for (let i=1;i<others.length;i++) {
      const lab = others[i].closest("label");
      if (lab) lab.remove();
    }
  }
  const other = groupEl?.querySelector("input[type='checkbox'][value='Autre']");
  if (!other) return;
  const ensure = () => {
    let wrap = groupEl.querySelector(".other-wrap");
    if (other.checked) {
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "other-wrap";
        wrap.innerHTML = `<input type="text" class="other-input small" placeholder="Précisez" required>`;
        groupEl.appendChild(wrap);
      }
    } else if (wrap) {
      wrap.remove();
    }
  };
  other.addEventListener("change", ensure);
  ensure();
};

const attachIsokineticHandlers = (scope) => {
  const groups = scope.querySelectorAll(".tools-group");
  groups.forEach(g => {
    const iso = g.querySelector("input[type='checkbox'][value='Isocinétisme']");
    if (!iso) return;
    const ensure = () => {
      let sub = g.parentElement.querySelector(".isokinetic-sub");
      if (iso.checked) {
        if (!sub) {
          sub = document.createElement("div");
          sub.className = "slide show isokinetic-sub";
          sub.innerHTML = `
            <label>Vitesse (isocinétisme)</label>
            <div class="checkbox-group iso-speed">${isokineticSpeeds.map(v=>`<label><input type="checkbox" value="${v}"> ${v}</label>`).join("")}</div>
            <label>Mode de contraction (isocinétisme)</label>
            <div class="checkbox-group iso-mode">${isokineticModes.map(m=>`<label><input type="checkbox" value="${m}"> ${m}</label>`).join("")}</div>`;
          g.insertAdjacentElement("afterend", sub);
          ensureOtherText(sub.querySelector(".iso-speed"));
        }
      } else if (sub) sub.remove();
    };
    iso.addEventListener("change", ensure);
    ensure();
  });
};

const createOPC = (extraToolsHtml="", {excludeIsokinetic=false, criteriaOverride=null}={}) => {
  const div = document.createElement("div");
  const toolsList = excludeIsokinetic ? toolsForce.filter(t=>t!=="Isocinétisme") : toolsForce.slice();
  div.innerHTML = `
    <label>Outils utilisés</label>
    <div class="checkbox-group tools-group">${toolsList.map(t=>`<label><input type="checkbox" value="${t}"> ${t}</label>`).join("")}${extraToolsHtml}</div>
    <label>Paramètres étudiés</label>
    <div class="checkbox-group">${paramsForce.map(p=>`<label><input type="checkbox" value="${p}"> ${p}</label>`).join("")}</div>
    <label>Critères d’évaluation</label>
    <div class="checkbox-group">${(criteriaOverride||criteriaGeneric).map(c=>`<label><input type="checkbox" value="${c}"> ${c}</label>`).join("")}</div>
  `;
  ensureOtherText(div.querySelector(".tools-group"));
  if (!excludeIsokinetic) attachIsokineticHandlers(div);
  ensureOtherText(div.querySelectorAll(".checkbox-group")[2]);
  return div;
};

/* ---------------------------------------------
* FORCE – par zone / mouvement
* ------------------------------------------- */
const createForceBlock = (zoneName, id) => {
  const div = document.createElement("div");
  div.id = id;
  const moves = [];
  if (zoneName==="Genou") {
    moves.push("Flexion/Extension");
  } else if (zoneName==="Cheville / Pied") {
    moves.push("Flexion/Extension","Éversion/Inversion","Intrinsèques du pied");
  } else if (zoneName==="Épaule") {
    moves.push("Flexion/Extension","Rotations","Adduction/Abduction","ASH Test");
  } else if (zoneName==="Poignet / Main") {
    moves.push("Flexion/Extension","Inclinaison");
  } else if (zoneName==="Hanche") {
    moves.push("Flexion/Extension","Rotations","Adduction/Abduction");
  } else if (zoneName==="Coude") {
    moves.push("Flexion/Extension");
  } else if (zoneName==="Rachis lombaire" || zoneName===headNeckTitle) {
    moves.push("Flexion/Extension","Rotations","Inclinaisons");
  } else {
    moves.push("Flexion/Extension");
  }

  div.innerHTML = `
    <h4>Force – ${zoneName}</h4>
    <label>Quels mouvements évaluez-vous en force ?</label>
    <div class="checkbox-group force-moves">
      ${moves.map(m=>`<label><input type="checkbox" value="${m}"> ${m}</label>`).join("")}
    </div>
    <div class="force-details"></div>
  `;
  const details = div.querySelector(".force-details");
  div.querySelectorAll(".force-moves input").forEach(mb => {
    mb.addEventListener("change", () => {
      const mid = `${id}-move-${slug(mb.value)}`;
      const exist = details.querySelector("#"+esc(mid));
      if (mb.checked) {
        const block = document.createElement("div");
        block.id = mid;
        block.classList.add("slide");
        toggleSlide(block, true);

        // --- Cas spécifiques ---
        if (zoneName==="Genou" && mb.value==="Flexion/Extension") {
          const g1 = document.createElement("div");
          g1.className = "subcard";
          g1.innerHTML = `<h6>Ischiojambiers</h6>`;
          g1.appendChild(createOPC());
          const g2 = document.createElement("div");
          g2.className = "subcard";
          g2.innerHTML = `<h6>Quadriceps</h6>`;
          g2.appendChild(createOPC());
          block.appendChild(g1);
          block.appendChild(g2);
        } 
        else if (zoneName==="Cheville / Pied" && mb.value==="Flexion/Extension") {
          const g = document.createElement("div");
          g.className = "subcard";
          g.innerHTML = `<h6>Gastrocnémien</h6>`;
          g.appendChild(createOPC());
          const g2 = document.createElement("div");
          g2.className = "subcard";
          g2.innerHTML = `<h6>Soléaire</h6>`;
          g2.appendChild(createOPC("",{excludeIsokinetic:true}));
          block.appendChild(g);
          block.appendChild(g2);
        } 
        else if (zoneName==="Cheville / Pied" && mb.value==="Éversion/Inversion") {
          // --- suppression du bloc "tests spécifiques" ---
          const g = document.createElement("div");
          g.className = "subcard";
          g.innerHTML = `<h6>Inverseurs / Éverseurs</h6>`;
          g.appendChild(createOPC("",{excludeIsokinetic:true}));
          block.appendChild(g);
        } 
        else if (zoneName==="Cheville / Pied" && mb.value==="Intrinsèques du pied") {
          const g = document.createElement("div");
          g.className = "subcard";
          g.innerHTML = `<h6>Intrinsèques du pied</h6>`;
          g.appendChild(createOPC("",{excludeIsokinetic:true}));
          block.appendChild(g);
        } 
        else {
          const g = document.createElement("div");
          g.className = "subcard";
          g.innerHTML = `<h6>${mb.value}</h6>`;
          g.appendChild(createOPC());
          block.appendChild(g);
        }

        details.appendChild(block);
      } 
      else if (exist) {
        toggleSlide(exist, false);
        setTimeout(()=>exist.remove(), 400);
      }
    });
  });
  return div;
};

/* ---------------------------------------------
* MOBILITÉ – par zone
* ------------------------------------------- */
const createMobilityBlock = (zoneName,id) => {
  const div = document.createElement("div");
  div.id = id;
  div.innerHTML = `
    <h4>Mobilité – ${zoneName}</h4>
    <label>Quels mouvements évaluez-vous en mobilité ?</label>
    <div class="checkbox-group mob-moves"></div>
    <div class="mob-details"></div>
  `;
  const moves = [];
  if (zoneName==="Épaule") moves.push("Flexion/Extension","Rotations","Abduction/Adduction");
  else if (zoneName==="Hanche") moves.push("Flexion/Extension","Rotations","Abduction/Adduction");
  else if (zoneName==="Genou") moves.push("Flexion/Extension");
  else if (zoneName==="Cheville / Pied") moves.push("Flexion dorsale","Flexion plantaire","Éversion/Inversion");
  else if (zoneName==="Rachis lombaire" || zoneName===headNeckTitle) moves.push("Flexion/Extension","Rotations","Inclinaisons");
  else if (zoneName==="Coude" || zoneName==="Poignet / Main") moves.push("Flexion/Extension");
  else moves.push("Flexion/Extension");

  const mobMoves = div.querySelector(".mob-moves");
  mobMoves.innerHTML = moves.map(m=>`<label><input type="checkbox" value="${m}"> ${m}</label>`).join("");
  const details = div.querySelector(".mob-details");

  mobMoves.querySelectorAll("input").forEach(mb=>{
    mb.addEventListener("change",()=>{
      const mid = `${id}-mob-${slug(mb.value)}`;
      const exist = details.querySelector("#"+esc(mid));
      if (mb.checked){
        const block = document.createElement("div");
        block.id = mid;
        block.classList.add("slide");
        toggleSlide(block, true);
        block.innerHTML = `
          <div class="subcard">
            <h6>${mb.value}</h6>
            <label>Outils utilisés</label>
            <div class="checkbox-group tools-group">${toolsMobBase.map(t=>`<label><input type="checkbox" value="${t}"> ${t}</label>`).join("")}</div>
            <label>Paramètres étudiés</label>
            <div class="checkbox-group"><label><input type="checkbox" value="Amplitude (°)"> Amplitude (°)</label><label><input type="checkbox" value="Symétrie"> Symétrie</label><label><input type="checkbox" value="Autre"> Autre</label></div>
          </div>`;
        ensureOtherText(block.querySelector(".tools-group"));
        ensureOtherText(block.querySelectorAll(".checkbox-group")[1]);
        details.appendChild(block);
      } else if (exist){
        toggleSlide(exist, false);
        setTimeout(()=>exist.remove(),400);
      }
    });
  });
  return div;
};

/* ---------------------------------------------
* PROPRIOCEPTION – par zone
* ------------------------------------------- */
const createProprioBlock = (zoneName,id) => {
  const div = document.createElement("div");
  div.id = id;
  const tests = proprioByZone[zoneName] || [];
  if (tests.length===0) return document.createTextNode("");
  div.innerHTML = `
    <h4>Proprioception – ${zoneName}</h4>
    <label>Quels tests réalisez-vous ?</label>
    <div class="checkbox-group tests-group">${tests.map(t=>`<label><input type="checkbox" value="${t}"> ${t}</label>`).join("")}</div>`;
  ensureOtherText(div.querySelector(".tests-group"));
  return div;
};

/* ---------------------------------------------
* QUESTIONNAIRES – par zone
* ------------------------------------------- */
const createQuestionnaireBlock = (zoneName,id) => {
  const div = document.createElement("div");
  div.id = id;
  const list = questionnairesByZone[zoneName] || [];
  div.innerHTML = `
    <h4>Questionnaires spécifiques – ${zoneName}</h4>
    <label>Quels questionnaires utilisez-vous ?</label>
    <div class="checkbox-group">${list.map(l=>`<label><input type="checkbox" value="${l}"> ${l}</label>`).join("")}</div>`;
  ensureOtherText(div.querySelector(".checkbox-group"));
  return div;
};
/* ---------------------------------------------
* SECTION dynamique – par zone cochée
* ------------------------------------------- */
const createZoneSection = (zoneName) => {
  const zId = slug(zoneName);
  const div = document.createElement("div");
  div.className = "zone-block";
  div.id = "zone-" + zId;

  div.innerHTML = `
    <h3>${zoneName}</h3>
    <label>Quels types d’évaluations réalisez-vous pour cette zone ?</label>
    <div class="checkbox-group zone-types">
      <label><input type="checkbox" value="Force"> Force</label>
      <label><input type="checkbox" value="Mobilité"> Mobilité</label>
      <label><input type="checkbox" value="Proprioception"> Proprioception</label>
      <label><input type="checkbox" value="Questionnaires"> Questionnaires</label>
    </div>
    <div class="sub-questions"></div>
  `;

  const subQ = div.querySelector(".sub-questions");
  div.querySelectorAll(".zone-types input").forEach(cb=>{
    cb.addEventListener("change",()=>{
      const id = `${zId}-${slug(cb.value)}`;
      const exists = subQ.querySelector("#"+esc(id));
      if(cb.checked){
        let block=null;
        if(cb.value==="Force") block=createForceBlock(zoneName,id);
        else if(cb.value==="Mobilité") block=createMobilityBlock(zoneName,id);
        else if(cb.value==="Proprioception") block=createProprioBlock(zoneName,id);
        else if(cb.value==="Questionnaires") block=createQuestionnaireBlock(zoneName,id);
        if(block){
          block.classList.add("slide");
          subQ.appendChild(block);
          toggleSlide(block,true);
        }
      } else if (exists){
        toggleSlide(exists,false);
        setTimeout(()=>exists.remove(),400);
      }
    });
  });
  return div;
};

/* ---------------------------------------------
* GLOBAL BLOCKS (Sauts, Course, MS, MI)
* ------------------------------------------- */
const globalContainer = byId("globalBlocks");

const buildJumpsBlock = () => {
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Tests de sauts</h3>
    <label>Réalisez-vous des tests de sauts ?</label>
    <div class="checkbox-group yn"><label><input type="radio" name="saut" value="Oui"> Oui</label><label><input type="radio" name="saut" value="Non"> Non</label></div>
    <div class="slide jump-details"></div>`;
  const det = div.querySelector(".jump-details");
  div.querySelectorAll(".yn input").forEach(r=>{
    r.addEventListener("change",()=>{
      toggleSlide(det,r.value==="Oui"&&r.checked);
    });
  });
  return div;
};

const buildCourseBlock = () => {
  const div=document.createElement("div");
  div.innerHTML=`
    <h3>Tests de course</h3>
    <label>Réalisez-vous des tests de course ?</label>
    <div class="checkbox-group yn"><label><input type="radio" name="course" value="Oui"> Oui</label><label><input type="radio" name="course" value="Non"> Non</label></div>
    <div class="slide course-details"></div>
    <div class="slide decel-details"></div>`;
  const det=div.querySelector(".course-details");
  const dDet=div.querySelector(".decel-details");
  const yn=div.querySelectorAll(".yn input");
  yn.forEach(r=>r.addEventListener("change",()=>{
    toggleSlide(det,r.value==="Oui"&&r.checked);
  }));
  const dYN=div.querySelectorAll(".yn input");
  dYN.forEach(r=>r.addEventListener("change",()=>{
    toggleSlide(dDet,r.value==="Oui"&&r.checked);
  }));
  return div;
};

const buildGlobalMIBlock=()=>{
  const div=document.createElement("div");
  div.innerHTML=`
    <h3>Évaluations Membres inférieurs</h3>
    <label>Réalisez-vous des tests de membres inférieurs ?</label>
    <div class="checkbox-group yn"><label><input type="radio" name="mi" value="Oui"> Oui</label><label><input type="radio" name="mi" value="Non"> Non</label></div>
    <div class="slide mi-details"></div>`;
  const det=div.querySelector(".mi-details");
  const yn=div.querySelectorAll(".yn input");
  yn.forEach(r=>r.addEventListener("change",()=>{
    toggleSlide(det,r.value==="Oui"&&r.checked);
  }));
  return div;
};

const buildGlobalMSBlock=()=>{
  const div=document.createElement("div");
  div.innerHTML=`
    <h3>Évaluations Membres supérieurs</h3>
    <label>Réalisez-vous des tests de membres supérieurs ?</label>
    <div class="checkbox-group yn"><label><input type="radio" name="ms" value="Oui"> Oui</label><label><input type="radio" name="ms" value="Non"> Non</label></div>
    <div class="slide ms-details"></div>`;
  const det=div.querySelector(".ms-details");
  const yn=div.querySelectorAll(".yn input");
  yn.forEach(r=>r.addEventListener("change",()=>{
    toggleSlide(det,r.value==="Oui"&&r.checked);
  }));
  return div;
};

/* ---------------------------------------------
* Gestion affichage dynamique zones
* ------------------------------------------- */
zonesCbs.forEach(cb=>{
  cb.addEventListener("change",()=>{
    const zid=slug(cb.value);
    const exist=zoneContainer.querySelector("#zone-"+esc(zid));
    if(cb.checked){
      const block=createZoneSection(cb.value);
      zoneContainer.appendChild(block);
      toggleSlide(block,true);
    }else if(exist){
      toggleSlide(exist,false);
      setTimeout(()=>exist.remove(),400);
    }
  });
});

/* ---------------------------------------------
* BOUTON SUBMIT
* ------------------------------------------- */
const submitBtn = byId("submitBtn");
const resultMsg = byId("resultMessage");

submitBtn.addEventListener("click", () => {
  resultMsg.textContent = "✅ Questionnaire envoyé avec succès (simulation)";
  resultMsg.style.color = "green";
});

/* ---------------------------------------------
* Animation d’ouverture/fermeture fluide
* ------------------------------------------- */
function toggleSlide(el, show) {
  if (!el) return;
  if (show) {
    el.style.display = "block";
    const height = el.scrollHeight + "px";
    el.style.maxHeight = "0";
    el.style.opacity = "0";
    requestAnimationFrame(() => {
      el.style.transition = "max-height .4s ease, opacity .4s ease";
      el.style.maxHeight = height;
      el.style.opacity = "1";
    });
    setTimeout(() => {
      el.style.maxHeight = "none";
      el.style.transition = "";
    }, 400);
  } else {
    el.style.transition = "max-height .4s ease, opacity .4s ease";
    el.style.maxHeight = el.scrollHeight + "px";
    requestAnimationFrame(() => {
      el.style.maxHeight = "0";
      el.style.opacity = "0";
    });
    setTimeout(() => {
      el.style.display = "none";
      el.style.transition = "";
    }, 400);
  }
}

/* ---------------------------------------------
* BARRE DE PROGRESSION SÉCURISÉE
* ------------------------------------------- */
const form = byId("questionnaireForm");
const progressBar = byId("progress-bar");
const progressText = byId("progress-text");

function updateProgress() {
  if (!form || !progressBar || !progressText) return;

  const requiredInputs = Array.from(
    form.querySelectorAll("input[required], input[type='radio'], input[type='checkbox']")
  );

  const radioGroups = [...new Set(
    requiredInputs.filter(i => i.type === "radio").map(i => i.name)
  )];

  const totalGroups =
    requiredInputs.filter(i => i.type !== "radio" && i.type !== "checkbox").length +
    radioGroups.length;

  let completed = 0;

  requiredInputs
    .filter(i => i.type !== "radio" && i.type !== "checkbox")
    .forEach(i => { if (i.value.trim() !== "") completed++; });

  radioGroups.forEach(group => {
    if (form.querySelector(`input[name="${group}"]:checked`)) completed++;
  });

  const percent = totalGroups > 0 ? Math.min(Math.round((completed / totalGroups) * 100), 100) : 0;
  progressBar.style.width = percent + "%";
  progressText.textContent = `Progression : ${percent}%`;
}

if (form) {
  form.addEventListener("input", updateProgress);
  form.addEventListener("change", updateProgress);
  document.addEventListener("DOMNodeInserted", updateProgress);
  updateProgress();
} else {
  console.warn("Formulaire #questionnaireForm introuvable : la progression est désactivée.");
}

}); // fin DOMContentLoaded
