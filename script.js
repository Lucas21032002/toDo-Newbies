const input = document.getElementById('task_input');
const bannerEmpty = document.getElementById('empty_tasks')
const addButton = document.getElementsByTagName('button')[0];
const tasksList = document.getElementById('tasks_list');
const todoCounterText = document.getElementById("counter_tasks");
const doneCounterText = document.getElementById("counter_tasks_done");
const localStorageKey = 'to-do-list-key'


//Se puder corrigir a implementação na função de contar as tarefas ja feitas, 
//ja fiz de tudo aqui e o contador de tarefas feitas simplesmente não funciona,
//não consegui achar meu erro.



let taskData = [
   //{
   //    id: randomId(),
   //    name: 'Estudar um pouco',
   //    toDo: true,
   //},
   //{
   //    id: randomId(),
   //    name: 'Estudar mais',
   //    toDo: true,
   //}
]


function verifyEmptyTasks() {
    const emptyTasks = bannerEmpty
    const values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')

    if(values.length == 0) {
        emptyTasks.classList.remove('hidden')
    }

    if(values.length > 0) {
        emptyTasks.classList.add('hidden')
    }
}



//counter tasks
function counter() {
    let toDoCounter = 0;
    let doneCounter = 0;
    const values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
  
    toDoCounter = values.length;
    todoCounterText.innerText = `${toDoCounter}`;
  
    for(const value of values) {
        if(value.toDo === false){
            doneCounter++
        }
}
    doneCounterText.innerText = `${doneCounter}`;
  
  }

counter();

//utilitários
function randomId() {
    return Date.now().toString(16) + Math.random().toString(16).substring(2)
}


function createElement(taskName, taskId) {
    // ---- criação da li ------ //
    let task = document.createElement('li');
    task.classList.add('task');
    task.classList.add('todo');

    task.setAttribute("id", taskId);

    // ---- criação da div left_content ------ //
    let leftContent = document.createElement('div');
    leftContent.classList.add('left_content')
    
    // ---- criação do ícone de tarefa incompleta ------ //
    let todoIcon = document.createElement('i');
    todoIcon.classList.add('ph-duotone');
    todoIcon.classList.add('ph-circle-dashed');
    todoIcon.classList.add('check-btn');
    todoIcon.addEventListener("click", completeTask)

    // ---- criação do ícone de tarefa completa ------ //
    let doneIcon = document.createElement('i');
    doneIcon.classList.add('ph-duotone');
    doneIcon.classList.add('ph-check-circle');
    doneIcon.classList.add('hidden');
    doneIcon.classList.add('check-btn');
    doneIcon.addEventListener("click", incompleteTask);

    // ---- criação do ícone de tarefa completa ------ //
    let name = document.createElement("p");
    name.innerHTML = taskName;

    // ---- criação do ícone de excluir ------ //
    let deleteIcon = document.createElement('i');
    deleteIcon.classList.add('ph-duotone');
    deleteIcon.classList.add('ph-trash');
    deleteIcon.classList.add('delete_btn');
    deleteIcon.addEventListener("click", deleteTask)

    // ---- Montagem do leftContent ------ //
    leftContent.appendChild(todoIcon);
    leftContent.appendChild(doneIcon);
    leftContent.appendChild(name);

    // ---- Montagem da task ------ //
    task.appendChild(leftContent);
    task.appendChild(deleteIcon);

    return task;
}

function addToLocalStorage(event) {
    const newTaskName = input.value;

    const newTask = {
        id: randomId(),
        name: newTaskName,
        toDo: true,
    }

    const values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
    values.push(newTask)

    localStorage.setItem(localStorageKey, JSON.stringify(values));

    const taskElement = createElement(newTask.name, newTask.id);

    verifyEmptyTasks();
    
    return taskElement
    
}


//addTask
function addNewTask(event) {
    event.preventDefault();
    const taskElement = addToLocalStorage()
    tasksList.appendChild(taskElement)
    input.value = '';
    counter();
    verifyEmptyTasks();
}


//complete task
function completeTask(event) {
    const todoIcon = event.target;
    todoIcon.classList.add('hidden');

    // ---- captura do id da task ------ //
    const taskCompleteId = todoIcon.parentNode.parentNode.id;
    const taskComplete = document.getElementById(taskCompleteId)
    
    // ---- adição e remoção das classes ------ //
    taskComplete.classList.add('done')
    taskComplete.classList.remove('todo')

    const doneIcon = todoIcon.parentNode.childNodes[1];
    doneIcon.classList.remove('hidden');

    const taskName = todoIcon.parentNode.childNodes[2];
    taskName.classList.add('risked')

    const values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')

    values.find((item) => {
        if(item.id === taskCompleteId) {
            item.toDo = false
        }
    })
    console.log(values);
    counter();
}

//incomplete task
function incompleteTask(event) {
    const doneIcon = event.target;
    doneIcon.classList.add('hidden');

    const taskToIncompleteId = doneIcon.parentNode.parentNode.id;
    const taskToIncomplete = document.getElementById(taskToIncompleteId);

    taskToIncomplete.classList.add('todo');
    taskToIncomplete.classList.remove('done');

    const todoIcon = doneIcon.parentNode.childNodes[0];
    todoIcon.classList.remove('hidden')

    let values = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
    
    values.find((item) => {
        if(item.id === taskToIncompleteId) {
            item.toDo = true;
        }
    })
    console.log(values);

    counter();
}

//delete task
function deleteTask(event) {
    const deleteIcon = event.target;
    const taskToDeleteId = deleteIcon.parentNode.id;
    const taskToDelete = document.getElementById(taskToDeleteId);

    //taskData.find((item) => {
    //    if(item.id === taskToIncompleteId) {
    //        tasksList.removeChild(taskToDelete)
    //    }
    //})

    let values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
    let position = values.findIndex(x => x.id == taskToDeleteId)
    values.splice(position, 1)
    localStorage.setItem(localStorageKey, JSON.stringify(values));
    tasksList.removeChild(taskToDelete)

    counter();
    verifyEmptyTasks();

}

//sync HTML with taskData 
function showTasks() {
    let values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
    for (const task of values) {
        let taskItem = createElement(task.name, task.id);
        tasksList.appendChild(taskItem)
    }
}

showTasks();