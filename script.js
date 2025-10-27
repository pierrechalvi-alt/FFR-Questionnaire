/* -----------------------------------------------------------
 🧩 BLOC 1 — STRUCTURE DE BASE, HELPERS, CONSTANTES & ZONES
----------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     🧠 Helpers utilitaires
  ------------------------------ */
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const slug = s => (s||"").toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-');
  const esc = s => s.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|/@])/g,'\\$1');
  const byId = id => document.getElementById(id);
  const requiredIfVisible = el => el && el.offsetParent !== null;

  /* ------------------------------
     📈 Barre de progression
  ------------------------------ */
  const progressBar = byId("progress-bar");
  const progressText = byId("progress-text");
  const form = byId("questionnaireForm");
  const formCards = $$(".card");

  const updateProgress = () => {
    const filled = formCards.filter(sec => sec.querySelector("input:checked") || sec.querySelector("input[type='text'][value]")).length;
    const total = formCards.length;
    const pct = Math.min(100, Math.round((filled / total) * 100));
    progressBar.style.width = pct + "%";
    progressText.textContent = `Progression : ${pct}%`;
  };
  document.addEventListener("change", updateProgress);

  /* ------------------------------
     🎭 Champs "Autre" dynamiques
  ------------------------------ */
  const toggleOther = (name, inputId) => {
    $(`input[name='${name}'][value='Autre']`)?.addEventListener("change", e => {
      byId(inputId).style.display = e.target.checked ? "block" : "none";
    });
    $$(`input[name='${name}']`).forEach(r =>
      r.addEventListener("change", e => {
        if (e.target.value !== "Autre") byId(inputId).style.display = "none";
      })
    );
  };
  toggleOther("role", "role-autre");
  toggleOther("equipe", "equipe-autre");

  /* ------------------------------
     🧩 Constantes de base
  ------------------------------ */
  const headNeck = ["Tête", "Rachis cervical"];
  const headNeckTitle = "Tête / Rachis cervical";
  const lowerBody = ["Hanche", "Genou", "Cheville / Pied"];
  const upperBody = ["Épaule", "Coude", "Poignet / Main"];

  /* ------------------------------
     ⚙️ Outils & paramètres
  ------------------------------ */
  const toolsForce = [
    "Dynamomètre manuel",
    "Dynamomètre fixe",
    "Isocinétisme",
    "Plateforme de force",
    "Sans outil",
    "Autre"
  ];

  const paramsForce = [
    "Force max (N)",
    "Force moyenne (N)",
    "Force relative (N/kg)",
    "Puissance (W/kg)",
    "RFD (Rate of Force Development)",
    "Angle du pic de force (°)",
    "Endurance (s)"
  ];

  const criteriaGeneric = [
    "Ratio agoniste/antagoniste",
    "Comparaison droite/gauche",
    "Valeur de référence individuelle",
    "Autre"
  ];

  /* ------------------------------
     🌀 Isocinétisme : réglages universels
  ------------------------------ */
  const isokineticSpeeds = [
    "30°/s",
    "60°/s",
    "120°/s",
    "180°/s",
    "Autre"
  ];

  const isokineticModes = [
    "Concentrique",
    "Excentrique"
  ];

  /* ------------------------------
     📏 Outils de mobilité par zone
  ------------------------------ */
  const mobilityToolsByZone = {
    "Cheville / Pied": ["Goniomètre", "Inclinomètre", "Knee-to-wall (KTW)", "Autre"],
    "Genou": ["Goniomètre", "Inclinomètre", "Distance talon-fesses", "Autre"],
    "Hanche": ["Goniomètre", "Inclinomètre", "Autre"],
    "Épaule": ["Goniomètre", "Inclinomètre", "Autre"],
    "Coude": ["Goniomètre", "Inclinomètre", "Autre"],
    "Poignet / Main": ["Goniomètre", "Inclinomètre", "Autre"],
    "Rachis lombaire": ["Goniomètre", "Inclinomètre", "Sit-and-reach", "Distance doigt-sol", "Autre"],
    [headNeckTitle]: ["Goniomètre", "Inclinomètre", "Autre"]
  };

  /* ------------------------------
     🧭 Proprioception par zone
  ------------------------------ */
  const proprioByZone = {
    "Cheville / Pied": ["Y-Balance Test", "Star Excursion", "Single Leg Balance Test", "Autre"],
    "Genou": ["Y-Balance Test", "Star Excursion", "FMS (Lower)", "Autre"],
    "Hanche": ["Y-Balance Test", "Star Excursion", "FMS (Lower)", "Autre"],
    "Épaule": ["Y-Balance Test (épaule)", "FMS (Upper)", "Autre"],
    [headNeckTitle]: ["Test proprio cervical (laser)", "Autre"],
    "Rachis lombaire": ["FMS (Core)", "Autre"],
    "Poignet / Main": [] // pas de tests pour cette zone
  };

  /* ------------------------------
     📋 Questionnaires par zone
  ------------------------------ */
  const questionnairesByZone = {
    "Genou": ["KOOS", "IKDC", "Lysholm", "Tegner", "ACL-RSI", "KOS-ADLS", "LEFS", "Autre"],
    "Hanche": ["HAGOS", "iHOT-12", "HOOS", "HOS", "Autre"],
    "Épaule": ["QuickDASH", "DASH", "SIRSI", "ASES", "SPADI", "Oxford Shoulder Score", "Autre"],
    "Coude": ["Oxford Elbow Score", "MEPS", "DASH", "QuickDASH", "Autre"],
    "Poignet / Main": ["PRWE", "DASH", "QuickDASH", "Boston Carpal Tunnel", "Autre"],
    "Cheville / Pied": ["CAIT", "FAAM-ADL", "FAAM-Sport", "FAOS", "FFI", "Autre"],
    "Rachis lombaire": ["ODI (Oswestry)", "Roland-Morris", "Quebec Back Pain", "FABQ", "Autre"],
    [headNeckTitle]: ["SCAT6", "Neck Disability Index (NDI)", "Copenhagen Neck Functional Scale", "Autre"]
  };

  /* ------------------------------
     💪 Tests musculaires spécifiques
  ------------------------------ */
  const testsByMuscle = {
    "Ischiojambiers": ["McCall 90°", "Isométrie 30°", "Nordic", "Nordic Hold", "Razor Curl", "Single Leg Bridge", "Autre"],
    "Quadriceps": ["Isométrie 60°", "Leg Extension", "Single Leg Squat", "Autre"],
    "Gastrocnémien": ["Heel Raise – genou tendu (1RM)", "Heel Raise – max reps", "Isométrie 90°", "Autre"],
    "Soléaire": ["Isométrie 90°", "Autre"],
    "Inverseurs/Éverseurs": ["Dynamométrie manuelle", "Dynamométrie fixe", "Autre"],
    "Intrinsèques du pied": ["Toe Curl test", "Short Foot test", "Dynamométrie", "Plateforme de pressions", "Autre"]
  };

  /* ------------------------------
     ⚙️ Containers de zones
  ------------------------------ */
  const zoneContainer = byId("zoneQuestions");
  const zonesCbs = $$("#zones input[type='checkbox']");

  /* ------------------------------
     🧱 Fonctions communes aux sous-blocs
  ------------------------------ */

  // Affiche champ "Autre" (input texte) lorsqu'une case "Autre" est cochée
  const ensureOtherText = (groupEl) => {
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
      } else if (wrap) wrap.remove();
    };
    other.addEventListener("change", ensure);
    ensure();
  };

  // Gestion de l'affichage conditionnel des sous-questions isocinétiques
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
              <div class="checkbox-group iso-speed">
                ${isokineticSpeeds.map(v => `<label><input type="checkbox" value="${v}"> ${v}</label>`).join("")}
              </div>
              <label>Mode de contraction (isocinétisme)</label>
              <div class="checkbox-group iso-mode">
                ${isokineticModes.map(m => `<label><input type="checkbox" value="${m}"> ${m}</label>`).join("")}
              </div>
            `;
            g.insertAdjacentElement("afterend", sub);
            ensureOtherText(sub.querySelector(".iso-speed"));
          }
        } else if (sub) sub.remove();
      };
      iso.addEventListener("change", ensure);
      ensure();
    });
  };
/* -----------------------------------------------------------
 💪 BLOC 2 — SECTIONS DÉTAILLÉES PAR ZONE
   (Force, Mobilité, Proprioception, Cognition, Questionnaires)
----------------------------------------------------------- */

/* ------------------------------
   🧩 Construction dynamique par zone
------------------------------ */
const createZoneCard = (zoneName) => {
  const card = document.createElement("div");
  card.className = "card zone-card";
  const slugZone = slug(zoneName);

  /* --- Titre principal --- */
  card.innerHTML = `
    <h3>${zoneName}</h3>
    <div class="question-group">
      <label>À quel moment testez-vous cette zone ?</label>
      <div class="checkbox-group moment-group">
        <label><input type="checkbox" value="Pré-saison"> Pré-saison</label>
        <label><input type="checkbox" value="Retour au jeu"> Retour au jeu</label>
        <label><input type="checkbox" value="Autre fréquence"> Autre fréquence</label>
      </div>
    </div>

    <div class="question-group">
      <label>Quels types de tests sont réalisés ?</label>
      <div class="checkbox-group test-type-group">
        <label><input type="checkbox" value="Force"> Force</label>
        <label><input type="checkbox" value="Mobilité"> Mobilité</label>
        ${proprioByZone[zoneName]?.length ? `<label><input type="checkbox" value="Proprioception / Équilibre"> Proprioception / Équilibre</label>` : ""}
        ${zoneName === headNeckTitle ? `<label><input type="checkbox" value="Test de cognition"> Test de cognition</label>` : ""}
        ${questionnairesByZone[zoneName]?.length ? `<label><input type="checkbox" value="Questionnaires"> Questionnaires</label>` : ""}
        <label><input type="checkbox" value="Autres données"> Autres données</label>
      </div>
    </div>

    <div class="subsections"></div>
  `;

  // Ajout dans le container
  zoneContainer.appendChild(card);

  const testTypeGroup = card.querySelector(".test-type-group");
  const subSectionContainer = card.querySelector(".subsections");

  /* --- Force --- */
  testTypeGroup.querySelector("input[value='Force']")?.addEventListener("change", e => {
    const existing = subSectionContainer.querySelector(".force-block");
    if (e.target.checked) {
      if (!existing) subSectionContainer.appendChild(buildForceBlock(zoneName));
    } else if (existing) existing.remove();
  });

  /* --- Mobilité --- */
  testTypeGroup.querySelector("input[value='Mobilité']")?.addEventListener("change", e => {
    const existing = subSectionContainer.querySelector(".mobility-block");
    if (e.target.checked) {
      if (!existing) subSectionContainer.appendChild(buildMobilityBlock(zoneName));
    } else if (existing) existing.remove();
  });

  /* --- Proprioception / Équilibre --- */
  if (proprioByZone[zoneName]?.length) {
    testTypeGroup.querySelector("input[value='Proprioception / Équilibre']")?.addEventListener("change", e => {
      const existing = subSectionContainer.querySelector(".proprio-block");
      if (e.target.checked) {
        if (!existing) subSectionContainer.appendChild(buildProprioBlock(zoneName));
      } else if (existing) existing.remove();
    });
  }

  /* --- Cognition (Tête / Rachis cervical) --- */
  if (zoneName === headNeckTitle) {
    testTypeGroup.querySelector("input[value='Test de cognition']")?.addEventListener("change", e => {
      const existing = subSectionContainer.querySelector(".cognition-block");
      if (e.target.checked) {
        if (!existing) subSectionContainer.appendChild(buildCognitionBlock());
      } else if (existing) existing.remove();
    });
  }

  /* --- Questionnaires --- */
  if (questionnairesByZone[zoneName]?.length) {
    testTypeGroup.querySelector("input[value='Questionnaires']")?.addEventListener("change", e => {
      const existing = subSectionContainer.querySelector(".questionnaire-block");
      if (e.target.checked) {
        if (!existing) subSectionContainer.appendChild(buildQuestionnaireBlock(zoneName));
      } else if (existing) existing.remove();
    });
  }

  /* --- Autres données --- */
  testTypeGroup.querySelector("input[value='Autres données']")?.addEventListener("change", e => {
    const existing = subSectionContainer.querySelector(".otherdata-block");
    if (e.target.checked) {
      if (!existing) subSectionContainer.appendChild(buildOtherDataBlock(zoneName));
    } else if (existing) existing.remove();
  });
};


/* ------------------------------
   💪 Bloc FORCE
------------------------------ */
const buildForceBlock = (zoneName) => {
  const div = document.createElement("div");
  div.className = "slide show force-block";
  div.innerHTML = `<h4>Force – ${zoneName}</h4>`;

  const movements = {
    [headNeckTitle]: ["Flexion/Extension", "Rotations", "Inclinaisons"],
    "Épaule": ["Flexion/Extension", "Rotations", "Adduction/Abduction", "ASH Test"],
    "Coude": ["Flexion/Extension"],
    "Poignet / Main": ["Flexion/Extension", "Inclinaison"],
    "Rachis lombaire": ["Flexion/Extension", "Rotations", "Inclinaisons"],
    "Hanche": ["Flexion/Extension", "Rotations", "Adduction/Abduction"],
    "Genou": ["Ischiojambiers", "Quadriceps"],
    "Cheville / Pied": ["Gastrocnémien", "Soléaire", "Éversion/Inversion", "Intrinsèques du pied"]
  }[zoneName];

  movements.forEach(mov => {
    const group = document.createElement("div");
    group.className = "question-group";
    group.innerHTML = `<label>Quels mouvements évaluez-vous en force ?</label><p class="sub">${mov}</p>`;

    /* Outils */
    const toolsGroup = document.createElement("div");
    toolsGroup.className = "checkbox-group tools-group";
    toolsForce.forEach(t => {
      toolsGroup.innerHTML += `<label><input type="checkbox" value="${t}"> ${t}</label>`;
    });
    group.appendChild(toolsGroup);

    /* Tests spécifiques (si existants) */
    if (testsByMuscle[mov]) {
      const tests = document.createElement("div");
      tests.className = "slide show";
      tests.innerHTML = `
        <label>Tests spécifiques</label>
        <div class="checkbox-group">
          ${testsByMuscle[mov].map(t => `<label><input type="checkbox" value="${t}"> ${t}</label>`).join("")}
        </div>
      `;
      group.appendChild(tests);
    }

    /* Paramètres étudiés */
    const params = document.createElement("div");
    params.className = "slide show";
    params.innerHTML = `
      <label>Paramètres étudiés</label>
      <div class="checkbox-group">
        ${paramsForce.map(p => `<label><input type="checkbox" value="${p}"> ${p}</label>`).join("")}
      </div>
    `;
    group.appendChild(params);

    /* Critères d’évaluation */
    const criteria = document.createElement("div");
    criteria.className = "slide show";
    criteria.innerHTML = `
      <label>Critères d’évaluation</label>
      <div class="checkbox-group">
        ${criteriaGeneric.map(c => `<label><input type="checkbox" value="${c}"> ${c}</label>`).join("")}
      </div>
    `;
    group.appendChild(criteria);

    div.appendChild(group);

    ensureOtherText(group);
    attachIsokineticHandlers(group);
  });

  return div;
};


/* ------------------------------
   🤸 Bloc MOBILITÉ
------------------------------ */
const buildMobilityBlock = (zoneName) => {
  const div = document.createElement("div");
  div.className = "slide show mobility-block";
  div.innerHTML = `<h4>Mobilité – ${zoneName}</h4>`;

  const movements = {
    [headNeckTitle]: ["Flexion/Extension", "Rotations", "Inclinaisons"],
    "Épaule": ["Flexion/Extension", "Rotations", "Adduction/Abduction"],
    "Coude": ["Flexion/Extension"],
    "Poignet / Main": ["Flexion/Extension", "Inclinaison"],
    "Rachis lombaire": ["Flexion/Extension", "Rotations", "Inclinaisons"],
    "Hanche": ["Flexion/Extension", "Rotations", "Adduction/Abduction"],
    "Genou": ["Flexion/Extension"],
    "Cheville / Pied": ["Flexion/Extension", "Éversion/Inversion"]
  }[zoneName];

  const tools = mobilityToolsByZone[zoneName] || ["Goniomètre", "Inclinomètre", "Autre"];

  movements.forEach(mov => {
    const group = document.createElement("div");
    group.className = "question-group";
    group.innerHTML = `<label>Quels mouvements évaluez-vous en mobilité ?</label><p class="sub">${mov}</p>`;

    const toolsGroup = document.createElement("div");
    toolsGroup.className = "checkbox-group";
    tools.forEach(t => toolsGroup.innerHTML += `<label><input type="checkbox" value="${t}"> ${t}</label>`);
    group.appendChild(toolsGroup);

    const critGroup = document.createElement("div");
    critGroup.className = "slide show";
    critGroup.innerHTML = `
      <label>Critères d’évaluation</label>
      <div class="checkbox-group">
        <label><input type="checkbox" value="Valeur de référence individuelle"> Valeur de référence individuelle</label>
        ${mov !== "Flexion/Extension" || zoneName === "Rachis lombaire" || zoneName === "Cheville / Pied" ? `<label><input type="checkbox" value="Comparaison droite/gauche"> Comparaison droite/gauche</label>` : ""}
        <label><input type="checkbox" value="Autre"> Autre</label>
      </div>
    `;
    group.appendChild(critGroup);

    div.appendChild(group);
    ensureOtherText(group);
  });

  return div;
};


/* ------------------------------
   ⚖️ Bloc PROPRIOCEPTION / ÉQUILIBRE
------------------------------ */
const buildProprioBlock = (zoneName) => {
  const div = document.createElement("div");
  div.className = "slide show proprio-block";
  div.innerHTML = `<h4>Proprioception / Équilibre – ${zoneName}</h4>`;

  const tests = proprioByZone[zoneName];
  if (!tests?.length) return div;

  const testGroup = document.createElement("div");
  testGroup.className = "checkbox-group";
  tests.forEach(t => testGroup.innerHTML += `<label><input type="checkbox" value="${t}"> ${t}</label>`);

  const crit = document.createElement("div");
  crit.className = "slide show";
  crit.innerHTML = `
    <label>Critères d’évaluation</label>
    <div class="checkbox-group">
      <label><input type="checkbox" value="Moyenne du groupe"> Moyenne du groupe</label>
      <label><input type="checkbox" value="Valeur de référence individuelle"> Valeur de référence individuelle</label>
      <label><input type="checkbox" value="Autre"> Autre</label>
    </div>
  `;

  div.appendChild(testGroup);
  div.appendChild(crit);
  ensureOtherText(div);
  return div;
};


/* ------------------------------
   🧠 Bloc COGNITION (Tête / Rachis cervical)
------------------------------ */
const buildCognitionBlock = () => {
  const div = document.createElement("div");
  div.className = "slide show cognition-block";
  div.innerHTML = `
    <h4>Test de cognition</h4>
    <div class="checkbox-group">
      <label><input type="checkbox" value="Test oculaire"> Test oculaire</label>
      <label><input type="checkbox" value="Test vestibulaire"> Test vestibulaire</label>
      <label><input type="checkbox" value="Autre"> Autre</label>
    </div>
  `;
  ensureOtherText(div);
  return div;
};


/* ------------------------------
   📋 Bloc QUESTIONNAIRES
------------------------------ */
const buildQuestionnaireBlock = (zoneName) => {
  const div = document.createElement("div");
  div.className = "slide show questionnaire-block";
  div.innerHTML = `<h4>Questionnaires – ${zoneName}</h4>`;
  const list = questionnairesByZone[zoneName];
  const group = document.createElement("div");
  group.className = "checkbox-group";
  list.forEach(q => group.innerHTML += `<label><input type="checkbox" value="${q}"> ${q}</label>`);
  div.appendChild(group);
  ensureOtherText(div);
  return div;
};


/* ------------------------------
   🧾 Bloc AUTRES DONNÉES
------------------------------ */
const buildOtherDataBlock = (zoneName) => {
  const div = document.createElement("div");
  div.className = "slide show otherdata-block";
  div.innerHTML = `<h4>Autres données – ${zoneName}</h4><textarea placeholder="Précisez ici les autres informations recueillies..."></textarea>`;
  return div;
};
/* -----------------------------------------------------------
 🚀 BLOC 3 — TESTS GLOBAUX, VALIDATION, ENVOI GOOGLE FORM, INIT
----------------------------------------------------------- */

/* ------------------------------
   🧮 Tests transversaux (sauts, course, fonctionnels…)
------------------------------ */
const globalTestsContainer = byId("globalTests");

const buildGlobalTests = () => {
  globalTestsContainer.innerHTML = "";

  const checkedZones = $$("#zones input[type='checkbox']:checked").map(cb => cb.value);

  const hasLower = checkedZones.some(z => lowerBody.includes(z));
  const hasUpper = checkedZones.some(z => upperBody.includes(z));
  const hasHeadNeck = checkedZones.includes(headNeckTitle);

  // --- Tests de course ---
  if (hasLower || hasHeadNeck) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>Tests de course</h3>
      <label>Effectuez-vous des tests de course ?</label>
      <div class="checkbox-group">
        <label><input type="radio" name="testsCourse" value="Oui"> Oui</label>
        <label><input type="radio" name="testsCourse" value="Non"> Non</label>
      </div>
      <div class="slide show course-details" style="display:none;">
        <label>Quels tests de course utilisez-vous ?</label>

        <p><b>Énergétiques</b></p>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Yoyo IR test 1"> Yoyo IR test 1</label>
          <label><input type="checkbox" value="Bronco"> Bronco</label>
          <label><input type="checkbox" value="Broken Bronco"> Broken Bronco</label>
          <label><input type="checkbox" value="Luc Léger"> Luc Léger</label>
          <label><input type="checkbox" value="VAMEVAL"> VAMEVAL</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>

        <p><b>Vitesse</b></p>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Sprint 10m"> Sprint 10m</label>
          <label><input type="checkbox" value="Sprint 20m"> Sprint 20m</label>
          <label><input type="checkbox" value="Sprint 30m"> Sprint 30m</label>
          <label><input type="checkbox" value="Vmax"> Vmax</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>

        <p><b>Changement de direction (COD)</b></p>
        <div class="checkbox-group">
          <label><input type="checkbox" value="505"> 505</label>
          <label><input type="checkbox" value="T-Test"> T-Test</label>
          <label><input type="checkbox" value="Illinois"> Illinois</label>
          <label><input type="checkbox" value="ZigZag test"> ZigZag test</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>

        <p><b>Décélération</b></p>
        <div class="checkbox-group">
          <label><input type="radio" name="decel" value="Oui"> Oui (si coché précisez)</label>
          <label><input type="radio" name="decel" value="Non"> Non</label>
        </div>

        <label>Outils</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Chronomètre"> Chronomètre</label>
          <label><input type="checkbox" value="Cellules"> Cellules</label>
          <label><input type="checkbox" value="GPS"> GPS</label>
          <label><input type="checkbox" value="1080 Sprint"> 1080 Sprint</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>

        <label>Critères d’évaluation</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Moyenne par poste"> Moyenne par poste</label>
          <label><input type="checkbox" value="Valeur de référence individuelle"> Valeur de référence individuelle</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>
      </div>
    `;
    const radios = div.querySelectorAll("input[name='testsCourse']");
    radios.forEach(r => r.addEventListener("change", () => {
      div.querySelector(".course-details").style.display = r.value === "Oui" ? "block" : "none";
    }));
    globalTestsContainer.appendChild(div);
  }

  // --- Tests de sauts ---
  if (hasLower) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>Tests de sauts</h3>
      <label>Effectuez-vous des tests de sauts ?</label>
      <div class="checkbox-group">
        <label><input type="radio" name="testsSauts" value="Oui"> Oui</label>
        <label><input type="radio" name="testsSauts" value="Non"> Non</label>
      </div>
      <div class="slide show saut-details" style="display:none;">
        <label>Quels tests de sauts utilisez-vous ?</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="CMJ (Countermovement Jump)"> CMJ</label>
          <label><input type="checkbox" value="Squat Jump"> Squat Jump</label>
          <label><input type="checkbox" value="Drop Jump"> Drop Jump</label>
          <label><input type="checkbox" value="Broad Jump"> Broad Jump</label>
          <label><input type="checkbox" value="Single Hop"> Single Hop</label>
          <label><input type="checkbox" value="Triple Hop"> Triple Hop</label>
          <label><input type="checkbox" value="Side Hop"> Side Hop</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>
        <label>Paramètres étudiés</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Force max (N)"> Force max (N)</label>
          <label><input type="checkbox" value="Hauteur (cm)"> Hauteur (cm)</label>
          <label><input type="checkbox" value="Temps de vol (ms)"> Temps de vol (ms)</label>
          <label><input type="checkbox" value="Temps de contact (ms)"> Temps de contact (ms)</label>
          <label><input type="checkbox" value="Pic de puissance (W)"> Pic de puissance (W)</label>
          <label><input type="checkbox" value="Puissance relative (W/kg)"> Puissance relative (W/kg)</label>
          <label><input type="checkbox" value="RFD (Rate of Force Development)"> RFD</label>
          <label><input type="checkbox" value="RSI (Reactive Strength Index)"> RSI</label>
          <label><input type="checkbox" value="Distance (cm)"> Distance (cm)</label>
        </div>
        <label>Outils</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Plateforme de force"> Plateforme de force</label>
          <label><input type="checkbox" value="Centimétrie"> Centimétrie</label>
          <label><input type="checkbox" value="Sans outil"> Sans outil</label>
          <label><input type="checkbox" value="Encodeur linéaire"> Encodeur linéaire</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>
        <label>Critères d’évaluation</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Comparaison droite/gauche"> Comparaison droite/gauche</label>
          <label><input type="checkbox" value="Valeur de référence individuelle"> Valeur de référence individuelle</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>
      </div>
    `;
    div.querySelectorAll("input[name='testsSauts']").forEach(r =>
      r.addEventListener("change", () => {
        div.querySelector(".saut-details").style.display = r.value === "Oui" ? "block" : "none";
      })
    );
    globalTestsContainer.appendChild(div);
  }

  // --- Tests fonctionnels globaux ---
  const addFunctionalBlock = (type, hasZone) => {
    if (!hasZone) return;
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>Tests fonctionnels globaux – Membre ${type}</h3>
      <label>Effectuez-vous des tests fonctionnels globaux du membre ${type} ?</label>
      <div class="checkbox-group">
        <label><input type="radio" name="testFunc${type}" value="Oui"> Oui</label>
        <label><input type="radio" name="testFunc${type}" value="Non"> Non</label>
      </div>
      <div class="slide show func-details" style="display:none;">
        <label>Quels tests ?</label>
        <div class="checkbox-group">
          ${type === "inférieur"
            ? `<label><input type="checkbox" value="Squat"> Squat</label>
               <label><input type="checkbox" value="Montée de banc"> Montée de banc</label>
               <label><input type="checkbox" value="Soulevé de terre"> Soulevé de terre</label>`
            : `<label><input type="checkbox" value="Développé couché"> Développé couché</label>
               <label><input type="checkbox" value="Traction"> Traction</label>
               <label><input type="checkbox" value="Tirage"> Tirage</label>
               <label><input type="checkbox" value="Force grip"> Force grip</label>`}
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>
        <label>Outils</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Sans outil"> Sans outil</label>
          <label><input type="checkbox" value="Encodeur linéaire"> Encodeur linéaire</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>
        <label>Paramètres étudiés</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Isométrie"> Isométrie</label>
          <label><input type="checkbox" value="Répétition maximale (RM)"> Répétition maximale (RM)</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>
        <label>Critères d’évaluation</label>
        <div class="checkbox-group">
          <label><input type="checkbox" value="Moyenne du groupe"> Moyenne du groupe</label>
          <label><input type="checkbox" value="Ratio / poids du corps"> Ratio / poids du corps</label>
          <label><input type="checkbox" value="Ratio droite/gauche"> Ratio droite/gauche</label>
          <label><input type="checkbox" value="Valeur de référence individuelle"> Valeur de référence individuelle</label>
          <label><input type="checkbox" value="Autre"> Autre</label>
        </div>
      </div>
    `;
    div.querySelectorAll(`input[name='testFunc${type}']`).forEach(r =>
      r.addEventListener("change", () => {
        div.querySelector(".func-details").style.display = r.value === "Oui" ? "block" : "none";
      })
    );
    globalTestsContainer.appendChild(div);
  };

  addFunctionalBlock("inférieur", hasLower);
  addFunctionalBlock("supérieur", hasUpper);
};


/* ------------------------------
   ✅ Validation et envoi Google Form
------------------------------ */
const GOOGLE_FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeNok3wNrafUFIM2VnAo4NKQpdZDaDyFDeVS8dZbXFyt_ySyA/formResponse";
const GOOGLE_ENTRY_KEY = "entry.1237244370";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  updateProgress();

  // Vérifie que toutes les infos de base sont remplies
  const requiredFields = ["nom", "prenom", "role"];
  for (const id of requiredFields) {
    const input = byId(id);
    if (!input?.value.trim()) {
      alert("Veuillez remplir tous les champs obligatoires avant de continuer.");
      input.focus();
      return;
    }
  }

  const data = new FormData(form);
  const jsonData = {};
  for (const [k, v] of data.entries()) {
    jsonData[k] = v;
  }

  // Envoi JSON vers Google Form
  try {
    await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams({ [GOOGLE_ENTRY_KEY]: JSON.stringify(jsonData) })
    });
    alert("✅ Questionnaire envoyé avec succès !");
    form.reset();
    zoneContainer.innerHTML = "";
    globalTestsContainer.innerHTML = "";
    progressBar.style.width = "0%";
    progressText.textContent = "Progression : 0%";
    window.scrollTo(0, 0);
  } catch (err) {
    console.error(err);
    alert("❌ Une erreur est survenue lors de l’envoi. Veuillez réessayer.");
  }
});


/* ------------------------------
   🧱 Initialisation dynamique
------------------------------ */
zonesCbs.forEach(cb => cb.addEventListener("change", () => {
  const zoneName = cb.value;
  const existing = zoneContainer.querySelector(`.zone-card h3:contains("${zoneName}")`);
  if (cb.checked) createZoneCard(zoneName);
  else {
    $$(`.zone-card h3`).forEach(h3 => {
      if (h3.textContent === zoneName) h3.closest(".zone-card").remove();
    });
  }
  buildGlobalTests();
}));

}); // ← Fin du DOMContentLoaded
