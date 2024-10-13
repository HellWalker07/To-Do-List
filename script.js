// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', loadTasks);

// Get references to the form and input elements from the DOM
const taskForm = document.getElementById('todo-form');
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const descriptionInput = document.getElementById('description-input');
const dueDateInput = document.getElementById('due-date');
const priorityInput = document.getElementById('priority');

// Event listener to handle task submission (when the form is submitted)
taskForm.addEventListener('submit', addTask);

// Function to handle the addition of a new task
function addTask(event) {
    event.preventDefault(); 

    // Create a task object with task details such as text, due date, and priority
    const task = {
        text: taskInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        completed: false 
    };

    // Save the task to local storage and display it in the task list
    saveTask(task);
    renderTask(task);

    // Reset the form fields after submission
    taskForm.reset();
}

// Function to render (display) a task in the task list
function renderTask(task) {
    const li = document.createElement('li'); 
    li.className = task.priority; 

    const taskText = document.createElement('span'); 
    taskText.textContent = `${task.text} - Due: ${task.dueDate}`; 
    // Add event listener to mark task as complete/incomplete when clicked
    taskText.addEventListener('click', () => toggleComplete(task, li));

    const deleteButton = document.createElement('button'); 
    deleteButton.textContent = 'Delete'; 
    // Add event listener to handle task deletion when the button is clicked
    deleteButton.addEventListener('click', () => deleteTask(task, li));

    // Append the task text and delete button to the list item
    li.appendChild(taskText);
    li.appendChild(deleteButton);

    // Append the list item to the task list in the DOM
    taskList.appendChild(li);
}

// Function to toggle the completion status of a task
function toggleComplete(task, li) {
    task.completed = !task.completed; 
    li.classList.toggle('completed');
    saveTasks(); 
}

// Function to delete a task from the list
function deleteTask(task, li) {
    taskList.removeChild(li);
    removeTask(task);
}

// Function to save a single task to local storage
function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task); 
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
}

// Function to save all tasks to local storage (used after tasks are modified)
function saveTasks() {
    const tasks = Array.from(taskList.children).map(li => ({
        text: li.firstChild.textContent.split(' - ')[0], 
        completed: li.classList.contains('completed') 
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
}

// Function to retrieve tasks from local storage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || []; 
}

// Function to load and display tasks when the page is loaded
function loadTasks() {
    const tasks = getTasks(); 
    tasks.forEach(renderTask); 
}

// Function to remove a task from local storage
function removeTask(task) {
    const tasks = getTasks().filter(t => t.text !== task.text); 
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
}

// Function to filter tasks based on their completion status (active or completed)
function filterTasks(type) {
    const tasks = document.querySelectorAll('li'); 
    tasks.forEach(task => {
        task.style.display = 'block'; 
        if (type === 'active' && task.classList.contains('completed')) {
            task.style.display = 'none'; 
        } else if (type === 'completed' && !task.classList.contains('completed')) {
            task.style.display = 'none'; 
        }
    });
}
