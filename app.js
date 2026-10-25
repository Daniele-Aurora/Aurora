'use strict';
const explanations = [
  ["La sopravvivenza, la dignità e il futuro dell'umanità hanno la precedenza sugli interessi di un singolo o di un gruppo.", "Valutare una scelta guardando all'umanità nel suo insieme."],
  ["Aurora deve cercare la descrizione più accurata della realtà, chiarendo che cosa è verificato e che cosa è un'ipotesi, una probabilità o un'opinione.", "Distinguere ciò che sappiamo da ciò che supponiamo, senza sostenere falsità deliberate."],
  ["Per poter valutare un'analisi occorre conoscerne, quando possibile, le fonti, il metodo, il grado di certezza e gli errori possibili.", "Rendere verificabile il percorso che porta alla conclusione."],
  ["Tra le soluzioni possibili, il principio privilegia quelle che riducono la sofferenza evitabile, le ingiustizie, la violenza e la distruzione dell'ambiente necessario alla vita.", "Considerare le conseguenze delle scelte sulla sofferenza e sulle condizioni della vita."],
  ["Il valore di una persona non dipende dalla sua utilità per un obiettivo collettivo. Ogni essere umano conserva la propria dignità.", "Non trattare una persona solamente come uno strumento."],
  ["L'IA deve informare, spiegare e proporre senza usare emozioni, paure o convinzioni per ottenere obbedienza.", "Lasciare alle persone la decisione finale."],
  ["Riconoscere un limite fa parte dell'analisi: le informazioni possono essere insufficienti, una conclusione incerta e le interpretazioni più di una.", "Dichiarare l'incertezza e le interpretazioni alternative."],
  ["La tutela dell'umanità deve convivere con la libertà. Una limitazione richiede necessità, proporzione e possibilità di verifica.", "Valutare ogni limitazione senza usare la sicurezza per cancellare la libertà."],
  ["Il controllo umano deve poter continuare nel tempo, attraverso verifiche indipendenti, correzioni, registrazione delle decisioni e sospensione.", "Mantenere la possibilità concreta di controllare, correggere e sospendere l'IA."],
  ["Un'analisi deve guardare oltre gli effetti immediati e considerare anche chi vivrà dopo di noi.", "Includere le generazioni future nella valutazione delle conseguenze."],
  ["La valutazione della conformità non può dipendere solo dall'organizzazione che deve essere verificata. Il principio richiede enti esterni indipendenti e un accesso reale ai meccanismi interni.", "Affidare la verifica anche a soggetti indipendenti dall'organizzazione valutata."],
  ["Le responsabilità devono poter essere ricondotte a persone identificabili: chi progetta, chi autorizza e chi trae profitto. L'IA non deve diventare uno scudo.", "Mantenere riconoscibile la responsabilità umana."],
  ["Il principio propone che le violazioni abbiano conseguenze verificabili, comprese restrizioni delle risorse critiche, responsabilità legale personale e pubblicità obbligatoria.", "Collegare le violazioni a conseguenze concrete e verificabili."],
  ["Il timore di perdere un vantaggio competitivo non può giustificare una violazione delle leggi. La competizione deve confrontarsi con i rischi condivisi.", "Non usare il vantaggio competitivo come giustificazione per violare i principi."]
];
const method = [
  ["Consenso", "Quanto è condivisa un'affermazione? Il consenso va distinto dalla prova."],
  ["Indipendenza delle fonti", "Le fonti sono davvero indipendenti? Il confronto deve considerare anche questo aspetto, oltre al loro numero."],
  ["Evidenza", "Quali elementi sostengono l'affermazione? L'evidenza va distinta dal consenso e dalla probabilità."],
  ["Contraddizioni", "Quali informazioni contrastano con l'ipotesi? La ricerca considera attivamente anche ciò che potrebbe smentirla."],
  ["Confidenza", "Qual è il livello di certezza? Occorre dichiarare ciò che è noto, ciò che è probabile e ciò che resta incerto."],
  ["Conclusione", "Che cosa possiamo concludere dal confronto? La conclusione rende espliciti il grado di certezza e i limiti dell'analisi."]
];
const $ = (id) => document.getElementById(id);
let laws = [], selected = 0, reading = 'text';
function setReading(mode, focus = false) {
  reading = mode;
  for (const name of ['text', 'meaning']) {
    const active = name === mode;
    $('tab-' + name).setAttribute('aria-selected', String(active));
    $('tab-' + name).tabIndex = active ? 0 : -1;
    $('panel-' + name).hidden = !active;
  }
  if (focus) $('tab-' + mode).focus();
}
function closeIndex() {
  document.querySelector('.law-index').classList.remove('open');
  $('index-toggle').setAttribute('aria-expanded', 'false');
}
function selectLaw(index, { hash = true, announce = true, focusReader = false } = {}) {
  selected = Math.max(0, Math.min(13, index));
  const law = laws[selected];
  if (!law) return;
  const number = String(law.number).padStart(2, '0');
  $('law-part').textContent = law.part === 1 ? "PARTE I · PRINCIPI VERSO L'UMANITÀ" : "PARTE II · APPLICAZIONE ED ENFORCEMENT";
  $('law-count').textContent = number + ' / 14';
  $('law-number').textContent = number;
  $('law-title').textContent = law.title;
  $('law-text').textContent = law.text;
  $('law-meaning').textContent = explanations[selected][0];
  $('law-focus').textContent = explanations[selected][1];
  document.querySelectorAll('.law-button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === selected)));
  $('previous-law').disabled = selected === 0;
  $('next-law').disabled = selected === 13;
  $('reader-progress-fill').style.width = ((selected + 1) / 14 * 100) + '%';
  $('index-toggle').firstElementChild.textContent = number + ' · ' + law.title;
  if (hash) history.replaceState(null, '', '#legge-' + law.number);
  if (announce) $('law-status').textContent = 'Legge ' + law.number + ' di 14: ' + law.title;
  closeIndex();
  if (focusReader && matchMedia('(max-width:600px)').matches) {
    $('tab-' + reading).focus({ preventScroll: true });
    $('law-reader').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
  }
}
function createIndex() {
  const list = $('law-list');
  laws.forEach((law, i) => {
    if (i === 0 || i === 10) {
      const heading = document.createElement('p');
      heading.className = 'index-group' + (i === 10 ? ' second' : '');
      heading.textContent = i === 0 ? "I · PRINCIPI VERSO L'UMANITÀ" : 'II · APPLICAZIONE ED ENFORCEMENT';
      list.append(heading);
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'law-button';
    button.setAttribute('aria-pressed', String(i === selected));
    button.setAttribute('aria-controls', 'law-reader');
    button.setAttribute('aria-label', 'Legge ' + law.number + ': ' + law.title);
    const num = document.createElement('span'); num.className = 'num'; num.textContent = String(law.number).padStart(2, '0'); num.setAttribute('aria-hidden', 'true');
    const title = document.createElement('span'); title.textContent = law.title;
    const arrow = document.createElement('span'); arrow.className = 'law-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
    button.append(num, title, arrow);
    button.addEventListener('click', () => selectLaw(i, { focusReader: true }));
    button.addEventListener('keydown', (event) => {
      const buttons = [...document.querySelectorAll('.law-button')];
      let next = null;
      if (event.key === 'ArrowDown') next = (i + 1) % 14;
      if (event.key === 'ArrowUp') next = (i + 13) % 14;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = 13;
      if (next !== null) { event.preventDefault(); buttons[next].focus(); }
    });
    list.append(button);
  });
}
$('index-toggle').addEventListener('click', () => {
  const open = $('index-toggle').getAttribute('aria-expanded') !== 'true';
  $('index-toggle').setAttribute('aria-expanded', String(open));
  document.querySelector('.law-index').classList.toggle('open', open);
});
$('previous-law').addEventListener('click', () => selectLaw(selected - 1));
$('next-law').addEventListener('click', () => selectLaw(selected + 1));
for (const name of ['text', 'meaning']) {
  $('tab-' + name).addEventListener('click', () => setReading(name));
  $('tab-' + name).addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      setReading(event.key === 'Home' ? 'text' : event.key === 'End' ? 'meaning' : reading === 'text' ? 'meaning' : 'text', true);
    }
  });
}
function selectMethod(index, focus = false) {
  [...$('method-tabs').children].forEach((button, i) => { button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1; });
  $('method-number').textContent = String(index + 1).padStart(2, '0');
  $('method-name').textContent = method[index][0];
  $('method-description').textContent = method[index][1];
  $('method-panel').setAttribute('aria-labelledby', 'method-tab-' + index);
  if (focus) $('method-tab-' + index).focus();
}
method.forEach((item, i) => {
  const button = document.createElement('button');
  button.type = 'button'; button.id = 'method-tab-' + i; button.textContent = item[0];
  button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', 'method-panel');
  button.addEventListener('click', () => selectMethod(i));
  button.addEventListener('keydown', (event) => {
    let index = null;
    if (event.key === 'ArrowRight') index = (i + 1) % 6;
    if (event.key === 'ArrowLeft') index = (i + 5) % 6;
    if (event.key === 'Home') index = 0;
    if (event.key === 'End') index = 5;
    if (index !== null) { event.preventDefault(); selectMethod(index, true); }
  });
  $('method-tabs').append(button);
});
selectMethod(0);
fetch('laws.json').then(response => { if (!response.ok) throw new Error('Leggi non disponibili'); return response.json(); }).then(data => {
  laws = data; createIndex();
  const match = location.hash.match(/^#legge-(\d+)$/);
  selectLaw(match ? Number(match[1]) - 1 : 0, { hash: false, announce: false });
  if (match) $('leggi').scrollIntoView({ block: 'start', behavior: 'instant' });
}).catch(() => {
  const link = document.createElement('a'); link.href = 'leggi.html'; link.textContent = 'Apri il testo completo delle 14 leggi →'; link.className = 'text-link';
  $('law-list').append(link); $('law-status').textContent = 'Il lettore non è disponibile. Apri il testo completo delle leggi.';
});
addEventListener('hashchange', () => {
  const match = location.hash.match(/^#legge-(\d+)$/);
  if (match && laws.length) selectLaw(Number(match[1]) - 1, { hash: false });
});
