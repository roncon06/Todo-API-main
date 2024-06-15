const apiUrl = 'http://localhost:3000/tasks';

document.addEventListener('DOMContentLoaded', fetchTasks);

async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        const list = document.getElementById('todo-list');
        list.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div>
                    <strong>Title:</strong> <input type="text" value="${task.title}" disabled />
                </div>
                <div>
                    <strong>Description:</strong> <input type="text" value="${task.description}" disabled />
                </div>
                <button onclick="editTask('${task.id}', this)">Edit</button>
                <button onclick="deleteTask('${task.id}')">Delete</button>
            `;
            list.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function addTask() {
    const titleInput = document.getElementById('todo-input-title');
    const descriptionInput = document.getElementById('todo-input-description');
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title && description) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            });

            if (response.ok) {
                console.log('Task added successfully');
                titleInput.value = '';
                descriptionInput.value = '';
                fetchTasks();
            } else {
                console.error('Error adding task:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    } else {
        console.error('Title and description are required');
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${apiUrl}/id/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Task deleted successfully');
            fetchTasks();
        } else {
            console.error('Error deleting task:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function editTask(id, button) {
    const listItem = button.parentNode;
    const titleInput = listItem.querySelector('div input[type="text"]');
    const descriptionInput = listItem.querySelectorAll('div input[type="text"]')[1];

    if (titleInput.disabled && descriptionInput.disabled) {
        titleInput.disabled = false;
        descriptionInput.disabled = false;
        button.textContent = 'Save';
    } else {
        titleInput.disabled = true;
        descriptionInput.disabled = true;
        button.textContent = 'Edit';
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();

        if (title && description) {
            try {
                const response = await fetch(`${apiUrl}/id/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, description })
                });

                if (response.ok) {
                    console.log('Task updated successfully');
                    fetchTasks();
                } else {
                    console.error('Error updating task:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            console.error('Title and description are required for updating');
        }
    }
}

function filterTasks() {
    const filterInput = document.getElementById('filter-input').value.toLowerCase();
    const tasks = document.querySelectorAll('#todo-list li');
    tasks.forEach(task => {
        const title = task.querySelector('div input[type="text"]').value.toLowerCase();
        if (title.includes(filterInput)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}