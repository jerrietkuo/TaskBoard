// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

function generateTaskId() {
    nextId++
    localStorage.setItem("nextId", JSON.stringify(nextId));
  return nextId;

}

function createTaskCard(task) {
  const deadline = dayjs(task.deadline);
  const now = dayjs();
  let bgColor = 'bg-white';

  if (task.status === 'done') {
    bgColor = 'bg-white';
  } else if (now.isSame(deadline, 'day')) {
    bgColor = 'bg-warning text-white';
  } else if (now.isAfter(deadline)) {
    bgColor = 'bg-danger';
  }

  return `
    <div class="task-card card mb-3 ${bgColor}" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">Due: ${deadline.format('MMM DD, YYYY')}</small></p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>
    </div>`;
}

function renderTaskList() {
  $("#todo-cards, #in-progress-cards, #done-cards").empty();

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-cards`).append(taskCard);
  });

  $(".delete-task").on("click", handleDeleteTask);
  $(".task-card").draggable({
   opacity:0.7, zIndex:100
  });
}

function handleAddTask(event) {
  event.preventDefault();

  const title = $("#task-title").val();
  const description = $("#task-desc").val();
  const deadline = $("#task-deadline").val();

  if (title && description && deadline) {
    const newTask = {
      id: generateTaskId(),
      title,
      description,
      deadline,
      status: 'todo'
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
  

    renderTaskList();
    $("#formModal").modal('hide');
  }
}

function handleDeleteTask(event) {
  const taskId = $(event.target).closest(".card").data("id");
  taskList = taskList.filter(task => task.id !== taskId);

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

function handleDrop(event, ui) {
  const taskId = ui.draggable[0].dataset.id;
  console.log(taskId)
  const newStatus = event.target.id
    console.log(newStatus)
  const task = taskList.find(task => task.id === Number(taskId));
  if (task) {
    console.log(task)
    task.status = newStatus;

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }
}

$(document).ready(function () {
  renderTaskList();

  $("#formModal").on('show.bs.modal', function () {
    $("#task-title").val('');
    $("#task-desc").val('');
    $("#task-deadline").val('');
  });

  $("#task-form").on("submit", handleAddTask);

  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop
  });
});
