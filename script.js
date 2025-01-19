const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const saveBtn = document.getElementById('save-btn');
const storedTasks = document.getElementById('stored-tasks');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let editIndex = null;

function displayTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {

        let checked;
        if (todo.checked) {
            checked = 'checked';
        } else {
            checked = '';
        }
        const moveUpClass = index === 0 ? 'disabled' : ''; 
        const moveDownClass = index === todos.length - 1 ? 'disabled' : ''; 

        const todoItemHTML = `
             <div id="todo-item-${index}" class="todo-item">
                <input type="checkbox" ${checked} onclick="toggleCheck(${index})" />
                <span style="text-decoration: ${todo.checked ? 'line-through' : 'none'};">${todo.text}</span>
                <i class="fas fa-edit" onclick="openEdit(${index})"></i>
                <i class="fas fa-clone" onclick="duplicateTodoItem(${index})"></i>
                <i class="fas fa-trash" onclick="confirmDelete(${index})"></i>
                <i class="fas fa-arrow-up ${moveUpClass}" onclick="moveTodoItem(${index}, 'up')"></i>
                <i class="fas fa-arrow-down ${moveDownClass}" onclick="moveTodoItem(${index}, 'down')"></i>
            </div>
        `;
        todoList.innerHTML += todoItemHTML;
    });
}
function addOrEditTodoItem() {
    const newTodo = todoInput.value;
    if (newTodo) {
        if (editIndex !== null) {
            todos[editIndex].text = newTodo;
            editIndex = null;
        } else {
            if (!todos.some(todo => todo.text === newTodo)) {
                todos.push({ text: newTodo, checked: false });
            }
        }
        updateLocalStorage();
        displayTodos();
        todoInput.value = '';
    }
}
function openEdit(index) {
    todoInput.value = todos[index].text;
    editIndex = index;
}
function toggleCheck(index) {
    todos[index].checked = !todos[index].checked;
    const todoItem = document.querySelector(`#todo-item-${index} span`);
    if (todos[index].checked) {
        todoItem.style.textDecoration = 'line-through';
    } else {
        todoItem.style.textDecoration = 'none';
    }
    updateLocalStorage();
}
function duplicateTodoItem(index) {
    const newTodo = todos[index].text + ' (Duplicate)';
    todos.push({ text: newTodo, checked: false });
    updateLocalStorage();
    displayTodos();
}
let deleteIndex = null;
function confirmDelete(index) {
    deleteIndex = index;
    $('#confirmModal').modal('show');
}
document.getElementById('confirm-yes').onclick = function () {
    if (deleteIndex !== null) {
        todos.splice(deleteIndex, 1);
        updateLocalStorage();
        displayTodos();
    }
    $('#confirmModal').modal('hide');
};
function moveTodoItem(index, direction) {
    if (direction === 'up' && index > 0) {
        [todos[index - 1], todos[index]] = [todos[index], todos[index - 1]];
    }
    else if (direction === 'down' && index < todos.length - 1) {
        [todos[index + 1], todos[index]] = [todos[index], todos[index + 1]];
    }
    updateLocalStorage();
    displayTodos();
}

function updateLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
addBtn.addEventListener('click', addOrEditTodoItem);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addOrEditTodoItem();
    }
});
displayTodos();

