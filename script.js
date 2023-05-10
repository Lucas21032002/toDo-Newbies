const input = document.getElementById('task_input');
const bannerEmpty = document.getElementById('empty_tasks')
const addButton = document.getElementsByTagName('button')[0];
const tasksList = document.getElementById('tasks_list');
const todoCounterText = document.getElementById("counter_tasks");
const doneCounterText = document.getElementById("counter_tasks_done");
const localStorageKey = 'to-do-list-key'


let taskData = JSON.parse(localStorage.getItem(localStorageKey) || '[]')


function verifyEmptyTasks() {
    const emptyTasks = bannerEmpty;
    let values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')

    if(values.length == 0) {
        emptyTasks.classList.remove('hidden')
    }

    if(values.length > 0) {
        emptyTasks.classList.add('hidden')
        emptyTasks.classList.add('animate__bounceIn')
    }
}
verifyEmptyTasks();


//counter tasks
function counter() {
    let toDoCounter = 0;
    let doneCounter = 0;
  
    toDoCounter = taskData.length;
    todoCounterText.innerText = `${toDoCounter}`;
  
    for(const task of taskData) {
        if(task.toDo === false){
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


function createElement(taskName, taskId, taskToDo) {
    // ---- criação da li ------ //
    let task = document.createElement('li');

    task.classList.add('task');
    task.classList.add('animate__bounceIn');


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
    //doneIcon.classList.add('hidden');
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

    if (taskToDo === false) {
        task.classList.add('done')
        todoIcon.classList.add('hidden')
        name.classList.add('risked')
    } 
    else {
        task.classList.add('todo')
        doneIcon.classList.add('hidden')
    }

    return task;
}

//function addToLocalStorage(event) {
//    const newTaskName = input.value;
//
//    const newTask = {
//        id: randomId(),
//        name: newTaskName,
//        toDo: true,
//    }
//
//    const values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
//    values.push(newTask)
//
//    localStorage.setItem(localStorageKey, JSON.stringify(values));
//
//    const taskElement = createElement(newTask.name, newTask.id);
//
//    verifyEmptyTasks();
//    
//    return taskElement
//    
//}


//addTask

function addNewTask(event) {
    event.preventDefault();

    const newTaskName = input.value;

    if(!newTaskName){
        alert('Insira uma tarefa!!')
    }
    else {
        const newTask = {
            id: randomId(),
            name: newTaskName,
            toDo: true
        }
    
        taskData.push(newTask);
    
        localStorage.setItem(localStorageKey, JSON.stringify(taskData));
        //console.log(taskData)
    
        const taskElement = createElement(newTask.name, newTask.id);
        tasksList.appendChild(taskElement);
    
        input.value = '';
    }

    verifyEmptyTasks();
    counter();
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

    
    taskData.find((item) => {
        if(item.id === taskCompleteId) {
            item.toDo = false;
            localStorage.setItem(localStorageKey, JSON.stringify(taskData));
        }
    })
    counter();
}
//console.log(taskData)
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
    
    taskData.find((item) => {
        if(item.id === taskToIncompleteId) {
            item.toDo = true;
            localStorage.setItem(localStorageKey, JSON.stringify(taskData));
        }
    })
    counter();
}

//delete task
function deleteTask(event) {
    const deleteIcon = event.target;
    const taskToDeleteId = deleteIcon.parentNode.id;
    const taskToDelete = document.getElementById(taskToDeleteId);
   
    //removendo do localstorage
    let values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
    let position = values.findIndex(x => x.id == taskToDeleteId)
    values.splice(position, 1)
    localStorage.setItem(localStorageKey, JSON.stringify(values));

    //atualizando taskData 
    const attTaskData = taskData.filter((item) => {
       return item.id !== taskToDeleteId
    });

    taskData = attTaskData;
    tasksList.removeChild(taskToDelete)

    verifyEmptyTasks();
    counter();
}


//sync HTML with taskData 
//for(const task of taskData){
//    const taskItem = createElement(task.name, task.id);
//    tasksList.appendChild(taskItem)
//}


function showTasks() {    
    let values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
    //console.log(values)
    for (const task of values) {
        console.log(task)
            let taskItem = createElement(task.name, task.id, task.toDo);
            tasksList.appendChild(taskItem)
        }
    }
    
showTasks();