// Identifier mes éléments dans le DOM
const clear = document.getElementById("clear");
const hourHeader = document.getElementById("hour");
const list = document.getElementById("list");
const item = document.querySelectorAll(".item");
const erase = document.querySelectorAll(".erase");
const plusCircle = document.querySelector(".fa-circle-plus");
const input = document.getElementById("input");

// Focus sur l'input dès l'ouverture de l'app
input.focus();

// Constantes pour mes icones Font Awesome
const CHECK = 'fa-circle-check';
const UNCHECK = 'fa-circle';
const LINE_THROUGH = 'lineThrough';

// Fonction addToDo() qui permet de créer un élément ToDo et qui l'ajoute dans la liste
function addToDo (toDo, id, done, trash) {
  if(trash) {
    return
  }
  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : "";

  const text = `<li class="item">
  <i class="fa-regular ${DONE} complete" job="complete" id="${id}"></i>
  <p class="text ${LINE}">${toDo}</p>
  <i class="fa-regular fa-trash-can delete" job="delete" id="${id}"></i>
  </li>`
  
  const position = "beforeend";
  
  list.insertAdjacentHTML(position, text)
}

// Stocker dans le storage
let storageList;
let id;

// récupere toDo (date) from localstorages
let data = localStorage.getItem("TODO");

// Controle si data (la LIST) n'est pas vide 
if (data) {
    storageList = JSON.parse(data);
    // Charger la liste
    loadToDo(storageList)
    id = storageList.length; // set the id to the last one in the list, 
                     //Si le dernier id était 3 LIST.length return 4, 4 sera l'id du prochain toDo
} else {
    // if data is empty
    storageList = [];
    id = 0;
}

// Fonction qui envoie le ToDo écrit dans l'input avec la touche Enter, et qui lance addToDo() pour qu'il crée un élément ToDo et qui l'ajoute dans la liste
document.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    const toDo = input.value;

    if (toDo) {
      addToDo(toDo, id, false, false)

      // Ajoute la tâche à la liste storageList
      storageList.push(
        {
          name: toDo,
          id: id,
          done: false,
          trash: false
        }
      )
      // Ajoute le TODO à la mémoire locale du LOCAL STORAGE
      localStorage.setItem("TODO", JSON.stringify(storageList));
      id++;
    }
    input.value = ""
  }
})

// Fonction qui envoie le ToDo écrit dans l'input au clic sur le PLUS, et qui lance addToDo() pour qu'il crée un élément ToDo et qui l'ajoute dans la liste
plusCircle.addEventListener("click", () => {
  const toDo = input.value;

    if (toDo) {
      addToDo(toDo)
    }
    input.value = ""
})

// Fonction qui remove un élément
function removeToDo (element) {
  element.parentNode.parentNode.removeChild(element.parentNode)
}

// Fonction qui raye une tâche effectuée
function completeToDo (element) {
  element.classList.toggle(CHECK)
  element.classList.toggle(UNCHECK)
  element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);
  storageList[element.id].done ? element.parentNode.classList.remove('is-completed') : element.parentNode.classList.add('is-completed')
  storageList[element.id].done = storageList[element.id].done ? false : true;
  console.log(storageList[element.id].done)
}

// Cibler un élément dans la list, et définir le comportement dynamique à lui donner
list.addEventListener("click", function(event) {
  let element = event.target; // J'obtiens l'élément sur lequel j'ai cliqué
  let elementJob = element.attributes.job.value;
  // Action pour TODO Complete
  if (elementJob === "complete") {
    completeToDo(element);
  } else if (elementJob === "delete") {
    removeToDo(element);
  }
  localStorage.setItem("TODO", JSON.stringify(storageList));
})

// Charger le localStorage
function loadToDo (array) {
  array.forEach(function(item) {
    addToDo(item.name, item.id, item.done, item.trash)
  })
}

// Reseter le localStorage
clear.addEventListener("click", consoleLog)

function consoleLog() {
  localStorage.clear();
  location.reload();
}


// Ajouter le jour sur le header
function displayDate () {
  let date = new Date()
  dateLocale = date.toLocaleDateString().split(" ")
  
  document.querySelector("#date").innerHTML = dateLocale
}
displayDate()

// Ajouter l'heure sur le header
const showDate= () => {
  let date = new Date()
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  if( h < 10 ){ h = '0' + h; }
  if( m < 10 ){ m = '0' + m; }
  if( s < 10 ){ s = '0' + s; }
  let time = h + ':' + m + ':' + s
  hourHeader.innerHTML = time;
}

setInterval(showDate, 1000)

// Filter
document.querySelectorAll('.btn-group button').forEach(button => {
  button.addEventListener('click', e => this.toggleFilter(e)) 
})

function toggleFilter (e) {

  const filter = e.currentTarget.getAttribute('data-filter')
  e.currentTarget.parentElement.querySelector('.active').classList.remove('active');
  e.currentTarget.classList.add('active');
  
  if (filter === 'done') {
   list.classList.add('hide-todo')
   list.classList.remove('hide-completed')
  } else if (filter === 'todo') {
    list.classList.remove('hide-todo')
    list.classList.add('hide-completed')
  } else {
   list.classList.remove('hide-completed')
   list.classList.remove('hide-todo')
  }
};
