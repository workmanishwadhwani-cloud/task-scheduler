let tasks = [];

// Add task
document.getElementById('add-task').addEventListener('click', addTask);

document.getElementById('task').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('task');
    const priorityInput = document.getElementById('priority');
    const deadlineInput = document.getElementById('deadline');

    const taskName = taskInput.value.trim();
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (!taskName) {
        alert('Please enter a task name!');
        return;
    }

    if (!deadline) {
        alert('Please select a deadline!');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        priority: priority,
        deadline: deadline,
        priorityValue: priority === 'top' ? 1 : priority === 'middle' ? 2 : 3
    };

    tasks.push(task);
    displayTasks();

    // Clear inputs
    taskInput.value = '';
    deadlineInput.value = '';
    priorityInput.value = 'top';
    
    // Hide schedule when new task is added
    document.getElementById('scheduled-order').style.display = 'none';
}

function displayTasks() {
    const taskList = document.getElementById('task-list');

    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks added yet. Add your first task!</div>';
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.priority}">
            <div class="task-info">
                <div class="task-name">${task.name}</div>
                <div class="task-details">
                    <span class="priority-badge ${task.priority}">
                        ${task.priority === 'top' ? 'Top Priority' : task.priority === 'middle' ? 'Middle Priority' : 'Less Priority'}
                    </span>
                    <span>📅 Deadline: ${formatDate(task.deadline)}</span>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    displayTasks();
    if (tasks.length === 0) {
        document.getElementById('scheduled-order').style.display = 'none';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Greedy Algorithm 1: Priority Based Scheduling
function schedulePriority() {
    if (tasks.length === 0) {
        alert('Please add tasks first!');
        return;
    }

    // Sort by priority (lower value = higher priority)
    const scheduled = [...tasks].sort((a, b) => a.priorityValue - b.priorityValue);
    displaySchedule(scheduled, 'Priority Based Scheduling');
}

// Greedy Algorithm 2: Earliest Deadline First (EDF)
function scheduleDeadline() {
    if (tasks.length === 0) {
        alert('Please add tasks first!');
        return;
    }

    // Sort by deadline (earliest first)
    const scheduled = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    displaySchedule(scheduled, 'Earliest Deadline First (EDF)');
}

// Greedy Algorithm 3: Priority + Deadline Combined
function scheduleProfit() {
    if (tasks.length === 0) {
        alert('Please add tasks first!');
        return;
    }

    // Sort by priority first, then by deadline
    const scheduled = [...tasks].sort((a, b) => {
        if (a.priorityValue !== b.priorityValue) {
            return a.priorityValue - b.priorityValue;
        }
        return new Date(a.deadline) - new Date(b.deadline);
    });
    displaySchedule(scheduled, 'Priority + Deadline Combined');
}

function displaySchedule(scheduledTasks, algorithmName) {
    const orderDiv = document.getElementById('scheduled-order');
    const orderList = document.getElementById('order-list');

    orderDiv.style.display = 'block';
    
    let html = `<p style="color: #666; margin-bottom: 15px; font-style: italic;">Using: ${algorithmName}</p>`;
    
    html += scheduledTasks.map((task, index) => `
        <div class="order-item">
            <div class="order-number">${index + 1}</div>
            <div class="task-info">
                <div class="task-name">${task.name}</div>
                <div class="task-details">
                    <span class="priority-badge ${task.priority}">
                        ${task.priority === 'top' ? 'Top Priority' : task.priority === 'middle' ? 'Middle Priority' : 'Less Priority'}
                    </span>
                    <span>📅 ${formatDate(task.deadline)}</span>
                </div>
            </div>
        </div>
    `).join('');

    orderList.innerHTML = html;

    // Scroll to schedule
    orderDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearSchedule() {
    document.getElementById('scheduled-order').style.display = 'none';
}

// Set minimum date to today
document.getElementById('deadline').min = new Date().toISOString().split('T')[0];