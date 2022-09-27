// const { response } = require("express"); FIXME: why is this here?

// const { response } = require("express"); FIXME: why does this keep happening?

// connected and working
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/readAll')
    .then(res => res.json())
    .then(data => loadTableData(data['data']));
});

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "deleteRowBtn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "editRowBtn") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#updateRowBtn');
const searchBtn = document.querySelector('#searchButton');

searchBtn.onclick = function() {
    const searchValue = document.querySelector('#searchInput').value;
    fetch('http://localhost:3000/read/' + searchValue)
    .then(res => res.json())
    .then(data => loadTableData(data['data']));
}

function deleteRowById(id) {
    fetch('http://localhost:3000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload(); // FIXME: find a more asyncronous way to do this (the way below is asyncronous, but leaves weird lines and "such empty...")
            // fetch('http://localhost:3000/readAll')
            // .then(res => res.json())
            // .then(data => loadTableData(data['data']));
        }
    });
};

function handleEditRow(id) {
    const updateSection = document.querySelector('#updateRow');
    updateSection.hidden = false;
    document.querySelector('#updateTaskInput').dataset.id = id;
};

updateBtn.onclick = function() {
    const updatedTask = document.querySelector('#updateTaskInput');

    fetch('http://localhost:3000/update', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: updatedTask.dataset.id,
            task: updatedTask.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload(); // FIXME: find a more asyncronous way to do this (the way below is asyncronous, but leaves weird lines and "such empty...")
            // fetch('http://localhost:3000/readAll')
            // .then(res => res.json())
            // .then(data => loadTableData(data['data']));
        }
    })
}

const addTaskBtn = document.querySelector('#addTaskButton');

addTaskBtn.onclick = function() {
    const taskInput = document.querySelector('#taskInput');
    const task = taskInput.value;
    taskInput.value = "";
    fetch('http://localhost:3000/create', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({task : task})
    })
    .then(response => response.json())
    .then(data => insertTableRow(data['data']));
}

// helper functions
function insertTableRow(data) {
    const table = document.querySelector('table tbody');
    const tableContainsData = table.querySelector('.noData')

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key == 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="deleteRowBtn" data-id=${data.id}>Delete</button></td>`;
    tableHtml += `<td><button class="editRowBtn" data-id=${data.id}>Edit</button></td>`;

    tableHtml += "</tr>";

    if (tableContainsData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}


function loadTableData(data) {
    const table = document.querySelector('table tbody');
    
    if (data.length === 0) {
        table.innerHTML = "<tr><td id='noData' colspan='5'>such empty...</td></tr>";
        return;
    }

    let tableHtml = "";
    data.forEach(function({id, task, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${task}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="deleteRowBtn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class="editRowBtn" data-id=${id}>Edit</button></td>`;
        tableHtml += "<tr>";
    });

    table.innerHTML = tableHtml;
};