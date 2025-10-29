

const display = document.getElementById("display");
const buttonsContainer = document.getElementById("buttons");
const BTN_CLASS_ACTIVE = "active";


function insertRaw(value){

  if(display.value === "0" && value !== "." ) {

    display.value = value.toString();
  } else {
    display.value += value;
  }
}

function insert(value){
  insertRaw(value);
}

function ac() {
  display.value = "";
}

function del() {
  display.value = display.value.slice(0, -1);
}

function calculate(){
  if(!display.value) return;
  try {

    const expression = display.value.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");

    let result = Function(`"use strict";return (${expression})`)();

    if (Number.isFinite(result)) {
      display.value = String(result);
    } else {
      display.value = "Error";
    }
  } catch (e) {
    display.value = "Error";
  }
}

buttonsContainer.addEventListener("click", (ev) => {
  const btn = ev.target.closest("button");
  if(!btn) return;

  flash(btn);

  const action = btn.dataset.action;
  if(action === "ac") return ac();
  if(action === "del") return del();
  if(action === "equals") return calculate();

  const raw = btn.dataset.raw;
  if(raw !== undefined){
    insertRaw(raw);
    return;
  }

  const key = btn.dataset.key ?? btn.textContent;

  insert(key);
});

document.addEventListener("keydown", (ev) => {
  const key = ev.key;

  if (/\d/.test(key) || ["+", "-", "*", "/", "%", "."].includes(key)) {
  
    const btn = findButtonByKey(key);
    if(btn) flash(btn);
    insert(key);
    ev.preventDefault();
    return;
  }

  if(key === "Enter" || key === "="){
    const eqBtn = findButtonByKey("Enter");
    if(eqBtn) flash(eqBtn);
    calculate();
    ev.preventDefault();
    return;
  }

  if(key === "Backspace"){
    const delBtn = findButtonByKey("Backspace");
    if(delBtn) flash(delBtn);
    del();
    ev.preventDefault();
    return;
  }

  if(key === "Escape"){
    const acBtn = findButtonByKey("Escape");
    if(acBtn) flash(acBtn);
    ac();
    ev.preventDefault();
    return;
  }

});


function findButtonByKey(k){

  let btn = buttonsContainer.querySelector(`button[data-key="${k}"]`);
  if(btn) return btn;


  if(k === "*") btn = buttonsContainer.querySelector(`button.operator[data-key="*"]`);
  if(k === "/") btn = buttonsContainer.querySelector(`button.operator[data-key="/"]`);
  return btn;
}


function flash(btn){
  btn.classList.add(BTN_CLASS_ACTIVE);
  setTimeout(()=> btn.classList.remove(BTN_CLASS_ACTIVE), 160);
}
