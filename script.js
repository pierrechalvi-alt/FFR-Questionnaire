// script.js – V21.p (ajustements finaux)

document.addEventListener("DOMContentLoaded", () => {
  const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeNok3wNrafUFIM2VnAo4NKQpdZDaDyFDeVS8dZbXFyt_ySyA/formResponse";
  const GOOGLE_ENTRY_KEY  = "entry.1237244370";

  const form = document.getElementById("questionnaireForm");
  const zonesList = Array.from(document.querySelectorAll("#zones input[type='checkbox']"));
  const zoneQuestionsContainer = document.getElementById("zoneQuestions");
  const submitBtn = document.getElementById("submitBtn");
  const resultMessage = document.getElementById("resultMessage");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  const roleGroup = document.getElementById("role");
  const roleOtherWrap = document.getElementById("role-other-wrap");
  const roleOtherInput = document.getElementById("role-other");

  const barrierGroup = document.getElementById("barrieres");
  const barrierOtherWrap = document.getElementById("common-other-wrap");
  const barrierOtherInput = document.getElementById("common-other");

  const guidesGroup = document.getElementById("guides");
  const guidesOtherWrap = document.getElementById("guides-other-wrap");
  const guidesOtherInput = document.getElementById("guides-other");

  const zoneSections = {};
  const slug = s => s.replace(/\s+/g,"-").replace(/[^a-zA-Z0-9-_]/g,"").toLowerCase();

  roleGroup.addEventListener("change", () => {
    const otherChecked = !!roleGroup.querySelector("input[value='Autre']:checked");
    roleOtherWrap.style.display = otherChecked ? "" : "none";
    updateProgress();
  });
  barrierGroup.addEventListener("change", () => {
    const otherChecked = !!barrierGroup.querySelector("input[value='Autre']:checked");
    barrierOtherWrap.style.display = otherChecked ? "" : "none";
    updateProgress();
  });
  guidesGroup.addEventListener("change", () => {
    const otherChecked = !!guidesGroup.querySelector("input[value='Autre']:checked");
    guidesOtherWrap.style.display = otherChecked ? "" : "none";
    updateProgress();
  });

  zonesList.forEach(cb => cb.addEventListener("change", () => {
    if (cb.checked) createZoneSection(cb.value);
    else removeZoneSection(cb.value);
    updateGlobalBlocksVisibility();
    updateProgress();
  }));

  function createZoneSection(zoneName) {
    if (zoneSections[zoneName]) return;
    const sec = document.createElement("div");
    sec.className = "card subcard";
    sec.id = "zone-" + slug(zoneName);
    sec.innerHTML = `
      <h3>${zoneName}</h3>

      <div class="req-block" data-type="moment">
        <label>À quel moment testez-vous cette zone ? <span class="req">*</span></label>
        <div class="checkbox-group moment">
          <label><input type="checkbox" value="Pré-saison"> Pré-saison</label>
          <label><input type="checkbox" value="Retour au jeu"> Retour au jeu</label>
          <label><input type="checkbox" value="Autre fréquence"> Autre fréquence</label>
        </div>
        <div class="other-frequency-wrap" style="display:none">
          <input type="text" class="other-frequency-input" placeholder="Précisez la fréquence (obligatoire si Autre coché)">
        </div>
      </div>

      <div class="req-block" data-type="types">
        <label>Quels types de tests sont réalisés ? <span class="req">*</span></label>
        <div class="checkbox-group types">
          <label><input type="checkbox" value="Force"> Force</label>
          <label><input type="checkbox" value="Mobilité"> Mobilité</label>
          <label><input type="checkbox" value="Proprioception / Équilibre"> Proprioception / Équilibre</label>
          <label><input type="checkbox" value="Questionnaires"> Questionnaires</label>
          <label><input type="checkbox" value="Autres données"> Autres données</label>
        </div>
      </div>

      <div class="subquestions"></div>
    `;
    zoneQuestionsContainer.appendChild(sec);
    zoneSections[zoneName] = sec;

    const momentGroup = sec.querySelector(".moment");
    momentGroup.addEventListener("change", () => {
      const other = momentGroup.querySelector("input[value='Autre fréquence']");
      const wrap = sec.querySelector(".other-frequency-wrap");
      wrap.style.display = other && other.checked ? "" : "none";
      updateGlobalBlocksVisibility();
      updateProgress();
    });

    const typeChecks = sec.querySelectorAll(".types input[type='checkbox']");
    typeChecks.forEach(t => {
      t.addEventListener("change", () => {
        handleTypeToggle(zoneName, sec, t);
        updateProgress();
      });
    });
  }

  function removeZoneSection(zoneName) {
    const sec = zoneSections[zoneName];
    if (sec) sec.remove();
    delete zoneSections[zoneName];
    updateGlobalBlocksVisibility();
    updateProgress();
  }

  function handleTypeToggle(zoneName, sectionEl, typeCb) {
    const container = sectionEl.querySelector(".subquestions");
    const id = `${slug(zoneName)}-${slug(typeCb.value)}`;
    const ex = container.querySelector("#"+id);
    if (typeCb.checked) {
      if (ex) return;
      let node = null;
      if (typeCb.value === "Force") node = createForceBlock(zoneName, id);
      else if (typeCb.value === "Mobilité") node = createMobilityBlock(zoneName, id);
      else if (typeCb.value === "Proprioception / Équilibre") node = createProprioBlock(zoneName, id);
      else if (typeCb.value === "Questionnaires") node = createQuestionnaireBlock(zoneName, id);
      else if (typeCb.value === "Autres données") node = createOtherDataBlock(zoneName, id);
      if (node) container.appendChild(node);
    } else if (ex) {
      ex.remove();
    }
  }

  function createForceBlock(zoneName, id) {
    const div = document.createElement("div");
    div.id = id; div.className = "slide show req-block"; div.dataset.type="force";
    const moves = ["Flexion/Extension"];
    if (["Épaule","Hanche"].includes(zoneName)) moves.push("Adduction/Abduction");
    if (zoneName === "Cheville / Pied") moves.push("Éversion/Inversion","Soleaire / Gastrocnemien");
    if (zoneName.includes("Rachis")) moves.push("Inclinaisons","Rotations");

    div.innerHTML = `
      <h4>Force – ${zoneName}</h4>
      <label>Quels mouvements évaluez-vous ? <span class="req">*</span></label>
      <div class="checkbox-group force-moves">
        ${moves.map(m=>`<label><input type="checkbox" value="${m}"> ${m}</label>`).join("")}
        <label><input type="checkbox" value="Autre"> Autre</label>
      </div>
      <div class="force-moves-details"></div>
    `;

    div.querySelectorAll(".force-moves input[type='checkbox']").forEach(cb => {
      cb.addEventListener("change", () => {
        const details = div.querySelector(".force-moves-details");
        const mid = "force-" + slug(cb.value);
        const ex = details.querySelector("#"+mid);
        if (cb.checked && !ex) {
          const block = document.createElement("div"); block.id = mid; block.className="slide show req-block"; block.dataset.type="force-move";
          block.innerHTML = `
            <label>Outils utilisés <span class="req">*</span></label>
            <div class="checkbox-group tools-group">
              <label><input type="checkbox" value="Dynamomètre manuel"> Dynamomètre manuel</label>
              <label><input type="checkbox" value="Dynamomètre fixe"> Dynamomètre fixe</label>
              <label><input type="checkbox" value="Isocinétisme"> Isocinétisme</label>
              <label><input type="checkbox" value="Plateforme de force"> Plateforme de force</label>
              <label><input type="checkbox" value="Encodeur linéaire"> Encodeur linéaire</label>
              <label><input type="checkbox" value="Sans outil"> Sans outil particulier</label>
              <label><input type="checkbox" value="Autre"> Autre</label>
            </div>
            <div class="isokinetic-wrap" style="display:none">
              <label>Vitesse (isocinétisme)</label>
              <div class="checkbox-group iso-speed">
                <label><input type="checkbox" value="30°/s"> 30°/s</label>
                <label><input type="checkbox" value="60°/s"> 60°/s</label>
                <label><input type="checkbox" value="120°/s"> 120°/s</label>
                <label><input type="checkbox" value="180°/s"> 180°/s</label>
                <label><input type="checkbox" value="Autre"> Autre</label>
              </div>
              <label>Mode de contraction</label>
              <div class="checkbox-group iso-mode">
                <label><input type="checkbox" value="Concentrique"> Concentrique</label>
                <label><input type="checkbox" value="Excentrique"> Excentrique</label>
                <label><input type="checkbox" value="Isométrique"> Isométrique</label>
                <label><input type="checkbox" value="Combiné"> Combiné</label>
              </div>
            </div>

            <label>Paramètres étudiés</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="Force max (N)"> Force max (N)</label>
              <label><input type="checkbox" value="Force moyenne (N)"> Force moyenne (N)</label>
              <label><input type="checkbox" value="Force relative (N/kg)"> Force relative (N/kg)</label>
              <label><input type="checkbox" value="RFD (N/s)"> RFD (rate of force development)</label>
              <label><input type="checkbox" value="Angle du pic de force (deg)"> Angle du pic de force (°)</label>
              <label><input type="checkbox" value="Endurance (reps/time)"> Endurance</label>
              <label><input type="checkbox" value="Autre"> Autre</label>
            </div>

            <label>Critères d'évaluation</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="Ratio agoniste/antagoniste"> Ratio agoniste/antagoniste</label>
              <label><input type="checkbox" value="Ratio droite/gauche"> Ratio droite/gauche</label>
              <label><input type="checkbox" value="Valeur de référence individuel"> Valeur de référence individuel</label>
              <label><input type="checkbox" value="Autre"> Autre</label>
            </div>
          `;
          details.appendChild(block);

          attachInlineOther(block);

          const tools = block.querySelector(".tools-group");
          const isoWrap = block.querySelector(".isokinetic-wrap");
          const toggleIso = () => {
            const isoChecked = !!tools.querySelector("input[value='Isocinétisme']:checked");
            isoWrap.style.display = isoChecked ? "" : "none";
          };
          tools.addEventListener("change", toggleIso);
          toggleIso();
        } else if (!cb.checked && ex) {
          ex.remove();
        }
        updateProgress();
      });
    });

    return div;
  }

  function createMobilityBlock(zoneName, id) {
    const div = document.createElement("div");
    div.id = id; div.className = "slide show req-block"; div.dataset.type="mobility";
    const moves = ["Flexion/Extension"];
    if (["Épaule","Hanche"].includes(zoneName)) moves.push("Adduction/Abduction");
    if (zoneName === "Cheville / Pied") moves.push("Dorsiflexion (Knee-to-wall)");
    if (zoneName.includes("Rachis")) moves.push("Inclinaisons","Rotations");

    div.innerHTML = `
      <h4>Mobilité – ${zoneName}</h4>
      <label>Quels mouvements évaluez-vous ? <span class="req">*</span></label>
      <div class="checkbox-group mob-moves">
        ${moves.map(m=>`<label><input type="checkbox" value="${m}"> ${m}</label>`).join("")}
        <label><input type="checkbox" value="Autre"> Autre</label>
      </div>
      <div class="mob-moves-details"></div>
    `;

    div.querySelectorAll(".mob-moves input[type='checkbox']").forEach(cb => {
      cb.addEventListener("change", () => {
        const details = div.querySelector(".mob-moves-details");
        const mid = "mob-" + slug(cb.value);
        const ex = details.querySelector("#"+mid);
        if (cb.checked && !ex) {
          const block = document.createElement("div"); block.id = mid; block.className="slide show req-block"; block.dataset.type="mobility-move";
          let toolsHTML = `
            <label>Outils utilisés <span class="req">*</span></label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="Goniomètre"> Goniomètre</label>
              <label><input type="checkbox" value="Inclinomètre"> Inclinomètre</label>
              <label><input type="checkbox" value="Sit and reach"> Sit and reach</label>
              <label><input type="checkbox" value="Autre"> Autre</label>
            </div>
          `;
          if (zoneName === "Rachis lombaire" && cb.value.includes("Inclinaisons")) {
            toolsHTML = `
              <label>Outils utilisés <span class="req">*</span></label>
              <div class="checkbox-group">
                <label><input type="checkbox" value="Distance doigt-sol"> Distance doigt-sol</label>
                <label><input type="checkbox" value="Sit and reach"> Sit and reach</label>
                <label><input type="checkbox" value="Autre"> Autre</label>
              </div>
            `;
          }
          block.innerHTML = `
            ${toolsHTML}
            <label>Critères d'évaluation</label>
            <div class="checkbox-group">
              <label><input type="checkbox" value="Moyenne du groupe"> Moyenne du groupe</label>
              <label><input type="checkbox" value="Valeur de référence individuel"> Valeur de référence individuel</label>
              <label><input type="checkbox" value="Autre"> Autre</label>
            </div>
          `;
          details.appendChild(block);
          attachInlineOther(block);
        } else if (!cb.checked && ex) {
          ex.remove();
        }
        updateProgress();
      });
    });

    return div;
  }

  function createProprioBlock(zoneName, id) {
    const div = document.createElement("div");
    div.id = id; div.className="slide show";
    const list = {
      "Cheville / Pied": ["Y-Balance Test","Star Excursion","Single Leg Balance Test"],
      "Genou": ["Y-Balance Test","Star Excursion","FMS (Lower)"],
      "Hanche": ["Y-Balance Test","Star Excursion"],
      "Épaule": ["Y-Balance Test (épaule)","FMS (Upper)"],
      "Tête / Rachis cervical": ["Test proprio cervical (laser)"],
      "Rachis lombaire": ["FMS (Core)"]
    }[zoneName] || ["Autre"];
    div.innerHTML = `
      <h4>Proprioception / Équilibre – ${zoneName}</h4>
      <label>Quels tests utilisez-vous ?</label>
      <div class="checkbox-group">
        ${list.map(t=>`<label><input type="checkbox" value="${t}"> ${t}</label>`).join("")}
        <label><input type="checkbox" value="Autre"> Autre</label>
      </div>
      <label>Critères d'évaluation</label>
      <div class="checkbox-group">
        <label><input type="checkbox" value="Moyenne du groupe"> Moyenne du groupe</label>
        <label><input type="checkbox" value="Valeur de référence individuel"> Valeur de référence individuel</label>
        <label><input type="checkbox" value="Autre"> Autre</label>
      </div>
    `;
    attachInlineOther(div);
    return div;
  }

  function createQuestionnaireBlock(zoneName, id) {
    const div = document.createElement("div");
    div.id = id; div.className="slide show";
    const qmap = {
      "Genou":["KOOS","IKDC","Lysholm","Tegner","ACL-RSI","Autre"],
      "Hanche":["HAGOS","iHOT-12","HOOS","Autre"],
      "Épaule":["QuickDASH","DASH","SIRSI","ASES","Autre"],
      "Cheville / Pied":["CAIT","FAAM-ADL","FAAM-Sport","Autre"],
      "Rachis lombaire":["ODI","Roland-Morris","Autre"],
      "Tête / Rachis cervical":["SCAT6","NDI","Autre"]
    };
    const list = qmap[zoneName] || ["Autre"];
    div.innerHTML = `
      <h4>Questionnaires – ${zoneName}</h4>
      <div class="checkbox-group q-list">
        ${list.map(q=>`<label><input type="checkbox" value="${q}"> ${q}</label>`).join("")}
        <label><input type="checkbox" value="Autre"> Autre</label>
      </div>
    `;
    attachInlineOther(div);
    return div;
  }

  function createOtherDataBlock(zoneName, id) {
    const div = document.createElement("div");
    div.id = id; div.className="slide show";
    div.innerHTML = `
      <h4>Autres données – ${zoneName}</h4>
      <input type="text" class="other-datas" placeholder="Précisez la donnée (obligatoire)">
    `;
    return div;
  }

  function attachInlineOther(scope) {
    scope.querySelectorAll(".checkbox-group").forEach(group => {
      group.addEventListener("change", () => {
        const other = group.querySelector("input[value='Autre']:checked");
        let wrap = group.querySelector(".other-wrap-inline");
        if (other && !wrap) {
          wrap = document.createElement("div");
          wrap.className = "other-wrap-inline";
          wrap.innerHTML = `<input type="text" class="other-input-inline" placeholder="Précisez (obligatoire)">`;
          group.appendChild(wrap);
        } else if (!other && wrap) {
          wrap.remove();
        }
        updateProgress();
      });
    });
  }

  function updateGlobalBlocksVisibility() {
    const anyReturn = Object.values(zoneSections).some(sec => {
      const ret = sec.querySelector('.moment input[value="Retour au jeu"]');
      return ret && ret.checked;
    });
    let combat = document.getElementById("combat-tests-block");
    const dynamic = document.getElementById("dynamicSection");
    if (anyReturn && !combat) {
      combat = document.createElement("div"); combat.id="combat-tests-block"; combat.className="card subcard";
      combat.innerHTML = `
        <h3>Tests spécifiques de combat</h3>
        <label>Effectuez-vous des tests spécifiques de combat ?</label>
        <div class="checkbox-group">
          <label><input type="radio" name="combat-tests" value="Oui"> Oui</label>
          <label><input type="radio" name="combat-tests" value="Non"> Non</label>
        </div>`;
      dynamic.appendChild(combat);
    } else if (!anyReturn && combat) {
      combat.remove();
    }
  }

  function visibleRequiredGroups() {
    const groups = [];
    groups.push({type:"text", el:document.getElementById("field-lastname")});
    groups.push({type:"text", el:document.getElementById("field-firstname")});
    groups.push({type:"radio", el:document.getElementById("role")});
    groups.push({type:"radio", el:document.getElementById("structure")});
    if (roleGroup.querySelector("input[value='Autre']:checked")) {
      groups.push({type:"text", el:roleOtherInput});
    }
    zonesList.filter(z=>z.checked).forEach(z => {
      const sec = zoneSections[z.value];
      if (!sec) return;
      groups.push({type:"checkbox-any", el:sec.querySelector(".moment")});
      if (sec.querySelector('.moment input[value="Autre fréquence"]:checked')) {
        groups.push({type:"text", el:sec.querySelector(".other-frequency-input")});
      }
      groups.push({type:"checkbox-any", el:sec.querySelector(".types")});
      const forceSc = sec.querySelector(`#${slug(z.value)}-force`);
      if (sec.querySelector('.types input[value="Force"]:checked') && forceSc) {
        groups.push({type:"checkbox-any", el:forceSc.querySelector(".force-moves")});
        forceSc.querySelectorAll(".force-moves-details .tools-group").forEach(tg => {
          groups.push({type:"checkbox-any", el:tg});
        });
        forceSc.querySelectorAll(".other-input-inline").forEach(inp => {
          groups.push({type:"text", el:inp});
        });
      }
      const mobSc = sec.querySelector(`#${slug(z.value)}-mobilite`);
      if (sec.querySelector('.types input[value="Mobilité"]:checked') && mobSc) {
        groups.push({type:"checkbox-any", el:mobSc.querySelector(".mob-moves")});
        mobSc.querySelectorAll(".mob-moves-details .checkbox-group").forEach(g => {
          groups.push({type:"checkbox-any", el:g});
        });
        mobSc.querySelectorAll(".other-input-inline").forEach(inp => {
          groups.push({type:"text", el:inp});
        });
      }
      if (sec.querySelector('.types input[value="Autres données"]:checked')) {
        const txt = sec.querySelector(".other-datas");
        if (txt) groups.push({type:"text", el:txt});
      }
    });
    groups.push({type:"checkbox-any", el:barrierGroup});
    if (barrierGroup.querySelector('input[value="Autre"]:checked')) {
      groups.push({type:"text", el:barrierOtherInput});
    }
    groups.push({type:"checkbox-any", el:guidesGroup});
    if (guidesGroup.querySelector('input[value="Autre"]:checked')) {
      groups.push({type:"text", el:guidesOtherInput});
    }
    return groups;
  }

  function updateProgress() {
    const groups = visibleRequiredGroups();
    let required = 0, ok = 0;
    groups.forEach(g => {
      required++;
      if (g.type === "text") {
        if (g.el && g.el.value && g.el.value.trim().length>0) ok++;
      } else if (g.type === "radio") {
        if (g.el && g.el.querySelector("input[type='radio']:checked")) ok++;
      } else if (g.type === "checkbox-any") {
        if (g.el && g.el.querySelector("input[type='checkbox']:checked")) ok++;
      }
    });
    const pct = Math.max(0, Math.min(100, Math.round((ok / (required||1))*100)));
    progressBar.style.width = pct + "%";
    progressText.textContent = `Progression : ${pct}%`;
    return pct;
  }

  function validateAll() {
    resultMessage.textContent=""; resultMessage.style.color="red";
    updateProgress();
    if (!document.getElementById("field-lastname").value.trim()) { resultMessage.textContent="Complétez votre nom."; return false; }
    if (!document.getElementById("field-firstname").value.trim()) { resultMessage.textContent="Complétez votre prénom."; return false; }
    if (!roleGroup.querySelector("input:checked")) { resultMessage.textContent="Sélectionnez votre rôle."; return false; }
    if (roleGroup.querySelector('input[value="Autre"]:checked') && !roleOtherInput.value.trim()) { resultMessage.textContent="Précisez votre rôle (Autre)."; return false; }
    if (!document.querySelector("#structure input:checked")) { resultMessage.textContent="Sélectionnez votre structure."; return false; }

    const selectedZones = zonesList.filter(z=>z.checked);
    if (selectedZones.length===0) { resultMessage.textContent="Sélectionnez au moins une zone."; return false; }

    for (const z of selectedZones) {
      const sec = zoneSections[z.value];
      if (!sec) { resultMessage.textContent=`Section manquante pour ${z.value}.`; return false; }
      if (!sec.querySelector(".moment input:checked")) { resultMessage.textContent=`Indiquez le moment pour ${z.value}.`; return false; }
      if (sec.querySelector('.moment input[value="Autre fréquence"]:checked')) {
        const txt = sec.querySelector(".other-frequency-input");
        if (!txt || !txt.value.trim()) { resultMessage.textContent=`Précisez la fréquence (Autre) pour ${z.value}.`; return false; }
      }
      if (!sec.querySelector(".types input:checked")) { resultMessage.textContent=`Indiquez le type de test pour ${z.value}.`; return false; }
      if (sec.querySelector('.types input[value="Force"]:checked')) {
        const mv = sec.querySelector(".force-moves input:checked");
        if (!mv) { resultMessage.textContent=`Choisissez un mouvement en force pour ${z.value}.`; return false; }
        const tools = sec.querySelector(".force-moves-details .tools-group input:checked");
        if (!tools) { resultMessage.textContent=`Choisissez les outils en force pour ${z.value}.`; return false; }
        const others = sec.querySelectorAll(".force-moves-details .other-input-inline");
        for (const o of others) if (!o.value.trim()) { resultMessage.textContent=`Précisez les champs 'Autre' (force) pour ${z.value}.`; return false; }
      }
      if (sec.querySelector('.types input[value="Mobilité"]:checked')) {
        const mv = sec.querySelector(".mob-moves input:checked");
        if (!mv) { resultMessage.textContent=`Choisissez un mouvement en mobilité pour ${z.value}.`; return false; }
        const tools = sec.querySelector(".mob-moves-details .checkbox-group input:checked");
        if (!tools) { resultMessage.textContent=`Choisissez les outils/critères en mobilité pour ${z.value}.`; return false; }
        const others = sec.querySelectorAll(".mob-moves-details .other-input-inline");
        for (const o of others) if (!o.value.trim()) { resultMessage.textContent=`Précisez les champs 'Autre' (mobilité) pour ${z.value}.`; return false; }
      }
      if (sec.querySelector('.types input[value="Autres données"]:checked')) {
        const txt = sec.querySelector(".other-datas");
        if (!txt || !txt.value.trim()) { resultMessage.textContent=`Précisez les autres données pour ${z.value}.`; return false; }
      }
    }
    if (!barrierGroup.querySelector("input:checked")) { resultMessage.textContent="Cochez au moins une barrière."; return false; }
    if (barrierGroup.querySelector('input[value="Autre"]:checked') && !barrierOtherInput.value.trim()) {
      resultMessage.textContent="Précisez la barrière (Autre)."; return false;
    }
    if (!guidesGroup.querySelector("input:checked")) { resultMessage.textContent="Cochez au moins un élément guidant vos choix."; return false; }
    if (guidesGroup.querySelector('input[value="Autre"]:checked') && !guidesOtherInput.value.trim()) {
      resultMessage.textContent="Précisez l'élément (Autre) dans 'guides'."; return false;
    }
    if (updateProgress() < 100) { resultMessage.textContent = "Veuillez compléter toutes les sections (100%)."; return false; }
    return true;
  }

  function collectPayload() {
    const payload = {};
    payload.timestamp = new Date().toISOString();
    payload.participant = {
      nom: (document.getElementById("field-lastname").value || "").trim(),
      prenom: (document.getElementById("field-firstname").value || "").trim(),
      role: (document.querySelector("#role input:checked") || {}).value || "",
      role_autre: roleGroup.querySelector('input[value="Autre"]:checked') ? (roleOtherInput.value || "").trim() : "",
      structure: (document.querySelector("#structure input:checked") || {}).value || ""
    };

    payload.zones = [];
    zonesList.filter(z=>z.checked).forEach(z => {
      const sec = zoneSections[z.value];
      const zObj = {zone:z.value, moments:[], types:[]};
      sec.querySelectorAll(".moment input:checked").forEach(m => zObj.moments.push(m.value));
      if (sec.querySelector('.moment input[value="Autre fréquence"]:checked')) {
        zObj.autreFrequence = (sec.querySelector(".other-frequency-input").value || "").trim();
      }

      sec.querySelectorAll(".types input:checked").forEach(t => {
        const tObj = {type:t.value};
        if (t.value === "Force") {
          tObj.moves = [];
          sec.querySelectorAll(".force-moves input:checked").forEach(mv => {
            const mvObj = {move: mv.value, tools:[], params:[], criteria:[]};
            const block = sec.querySelector("#force-"+slug(mv.value));
            if (block) {
              block.querySelectorAll(".tools-group input:checked").forEach(x => mvObj.tools.push(x.value));
              block.querySelectorAll(".checkbox-group").forEach(g => {
                g.querySelectorAll("input:checked").forEach(ch => {
                  const val = ch.value;
                  if (["Dynamomètre manuel","Dynamomètre fixe","Isocinétisme","Plateforme de force","Encodeur linéaire","Sans outil particulier","Autre"].includes(val)) return;
                  if (val.match(/Force|RFD|Angle|Endurance|N\/kg|N\)|deg|s\)/i)) mvObj.params.push(val);
                  else mvObj.criteria.push(val);
                });
                const otherTxt = g.querySelector(".other-input-inline");
                if (g.querySelector('input[value="Autre"]:checked') && otherTxt && otherTxt.value.trim()) {
                  if (g.previousElementSibling && /Paramètres|Critères/i.test(g.previousElementSibling.textContent)) {
                    (mvObj.params_other ||= []).push(otherTxt.value.trim());
                  } else {
                    (mvObj.tools_other ||= []).push(otherTxt.value.trim());
                  }
                }
              });
            }
            tObj.moves.push(mvObj);
          });
        } else if (t.value === "Mobilité") {
          tObj.moves = [];
          sec.querySelectorAll(".mob-moves input:checked").forEach(mv => {
            const mvObj = {move: mv.value, tools:[], criteria:[]};
            const block = sec.querySelector("#mob-"+slug(mv.value));
            if (block) {
              block.querySelectorAll(".checkbox-group").forEach(g => {
                g.querySelectorAll("input:checked").forEach(ch => {
                  const val = ch.value;
                  if (["Moyenne du groupe","Valeur de référence individuel","Autre"].includes(val)) mvObj.criteria.push(val);
                  else mvObj.tools.push(val);
                });
                const otherTxt = g.querySelector(".other-input-inline");
                if (g.querySelector('input[value="Autre"]:checked') && otherTxt && otherTxt.value.trim()) {
                  if (g.previousElementSibling && /Critères/i.test(g.previousElementSibling.textContent)) {
                    (mvObj.criteria_other ||= []).push(otherTxt.value.trim());
                  } else {
                    (mvObj.tools_other ||= []).push(otherTxt.value.trim());
                  }
                }
              });
            }
            tObj.moves.push(mvObj);
          });
        } else if (t.value === "Proprioception / Équilibre") {
          tObj.tests = [];
          sec.querySelectorAll(`#${idFromZoneType(zoneName,"proprioception-equilibre")} .checkbox-group input:checked`);
        } else if (t.value === "Questionnaires") {
          tObj.questionnaires = [];
          sec.querySelectorAll(".q-list input:checked").forEach(q => tObj.questionnaires.push(q.value));
        } else if (t.value === "Autres données") {
          const txt = sec.querySelector(".other-datas");
          tObj.otherData = txt ? txt.value.trim() : "";
        }
        zObj.types.push(tObj);
      });

      payload.zones.push(zObj);
    });

    const combat = document.querySelector('input[name="combat-tests"]:checked');
    payload.tests_combat = combat ? combat.value : "Non renseigné";

    payload.barrieres = [...barrierGroup.querySelectorAll("input:checked")].map(i=>i.value);
    payload.barrieres_autre = barrierGroup.querySelector('input[value="Autre"]:checked') ? (barrierOtherInput.value||"").trim() : "";
    payload.guides = [...guidesGroup.querySelectorAll("input:checked")].map(i=>i.value);
    payload.guides_autre = guidesGroup.querySelector('input[value="Autre"]:checked') ? (guidesOtherInput.value||"").trim() : "";

    return payload;
  }

  function idFromZoneType(zone, type) {
    return `${slug(zone)}-${slug(type)}`;
  }

  function postToGoogleForms(jsonPayload) {
    const iframe = document.getElementById("hidden_iframe");
    const tempForm = document.createElement("form");
    tempForm.action = GOOGLE_FORM_ACTION;
    tempForm.method = "POST";
    tempForm.target = "hidden_iframe";
    tempForm.style.display = "none";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = GOOGLE_ENTRY_KEY;
    input.value = JSON.stringify(jsonPayload);

    tempForm.appendChild(input);
    document.body.appendChild(tempForm);

    iframe.onload = () => {
      resultMessage.style.color = "#0a7c2f";
      resultMessage.textContent = "✅ Merci ! Vos réponses ont été enregistrées.";
      setTimeout(()=> location.reload(), 1200);
    };

    tempForm.submit();
    setTimeout(()=> tempForm.remove(), 500);
  }

  submitBtn.addEventListener("click", () => {
    if (!validateAll()) return;
    const payload = collectPayload();
    postToGoogleForms(payload);
  });

  document.addEventListener("input", updateProgress);
  document.addEventListener("change", () => { updateProgress(); updateGlobalBlocksVisibility(); });

  updateProgress();
});
