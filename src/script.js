const STATUSES = {
  todo: "todo",
  inProgress: "inProgress",
  done: "done"
};

LOCAL_STORAGE_KEY = "tasks";

class Application {

  constructor() {
    this.tasks = [];
    this.createTaskBtn = document.getElementById("create-task-button");
    this.todoTasksList = document.getElementById("todo-tasks-list");
    this.inProgressTasksList = document.getElementById("in-progress-tasks-list");
    this.doneTasksList = document.getElementById("done-tasks-list");
    this.toggleThemeBtn = document.getElementById("toggle-theme");
  }

  run() {
    this.createTaskBtn.addEventListener("click", () => this.addTask());
    this.toggleThemeBtn.addEventListener("click", () => {
      if (document.body.classList.contains("night")) {
        document.body.classList.remove("night");
        window.localStorage.setItem("theme", "");
      } else {
        document.body.classList.add("night");
        window.localStorage.setItem("theme", "night");
      }
    });

    document.body.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn") || e.target.parentElement.classList.contains("delete-btn")) {
        const id = e.target.dataset.id || e.target.parentElement.dataset.id;
        this.destroyTask(id);
      }

      if (e.target.classList.contains("edit-btn") || e.target.parentElement.classList.contains("edit-btn")) {
        const id = e.target.dataset.id || e.target.parentElement.dataset.id;
        this.editTask(id);
      }

      if (e.target.classList.contains("to-in-progress") || e.target.parentElement.classList.contains("to-in-progress")) {
        const id = e.target.dataset.id || e.target.parentElement.dataset.id;
        this.moveInProgress(id);
      }

      if (e.target.classList.contains("to-to-do") || e.target.parentElement.classList.contains("to-to-do")) {
        const id = e.target.dataset.id || e.target.parentElement.dataset.id;
        this.moveInTodo(id);
      }

      if (e.target.classList.contains("to-done") || e.target.parentElement.classList.contains("to-done")) {
        const id = e.target.dataset.id || e.target.parentElement.dataset.id;
        this.moveInDone(id);
      }
    });

    let tasksFromLocalStorage = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    this.tasks = tasksFromLocalStorage.map(task => new Task(task));
    this.update();

    let theme = window.localStorage.getItem("theme") || "";
    if (!!theme) {
      document.body.classList.add(theme);
    }
   }

  update() {
    let todoTasksHTML = this.tasks.filter(task => task.status === STATUSES.todo).map((task) => task.render()).join("");
    let inProgressTasksHTML = this.tasks.filter(task => task.status === STATUSES.inProgress).map((task) => task.render()).join("");
    let doneTasksHTML = this.tasks.filter(task => task.status === STATUSES.done).map((task) => task.render()).join("");

    this.todoTasksList.innerHTML = todoTasksHTML;
    this.inProgressTasksList.innerHTML = inProgressTasksHTML;
    this.doneTasksList.innerHTML = doneTasksHTML;

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.tasks));
  }

  addTask() {
    let taskName = prompt("Введите название задачи");
    if (!taskName) {
      return;
    }

    let task = new Task({ name: taskName });
    this.tasks.push(task);

    this.update();
  }

  destroyTask(taskId) {
    const idsArray = this.tasks.map(task => task.id);
    const taskToDestroy = idsArray.indexOf(+taskId);
    if (taskToDestroy === -1) {
      return;
    }

    this.tasks.splice(taskToDestroy, 1);
    this.update();
  }

  editTask(taskId) {
    let task = this.tasks.find(task => task.id === +taskId);
    let taskEdit = prompt("Введите изменения", task.name);
    if(!taskEdit) {
      return;
    }
    task.name = taskEdit;

    this.update();
  }

  moveInProgress(taskId) {
    let task = this.tasks.find(task => task.id === +taskId);
    task.status = STATUSES.inProgress;

    this.update();
  }

  moveInTodo(taskId) {
    let task = this.tasks.find(task => task.id === +taskId);
    task.status = STATUSES.todo;

    this.update();
  }

  moveInDone(taskId) {
    let task = this.tasks.find(task => task.id === +taskId);
    task.status = STATUSES.done;

    this.update();
  }

}

class Task {

  constructor(options) {
    this.name = options.name;
    this.id = options.id || Date.now();
    this.status = options.status || STATUSES.todo;
  }

  render() {
    let buttonsForTaskInTodo = this.status === STATUSES.todo ? `<button class="to-in-progress" data-id="${this.id}"><img src="./images/play.svg" /></button>` : "";
    let buttonsForTaskInInProgress = this.status === STATUSES.inProgress ? `<button class="to-to-do" data-id="${this.id}"><img src="./images/rewind.svg" /></button><button class="to-done" data-id="${this.id}"><img src="./images/finish.svg" /></button>` : "";
    let buttonsForTaskInDone = this.status === STATUSES.done ? `<button class="to-to-do" data-id="${this.id}"><img src="./images/rewind.svg" /></button>` : "";
    return `
      <div class="task">
        <div class="name">
          <p>${this.name}</p>
        </div>
        <div class="controls">
          <div class="move-controls">
            ${buttonsForTaskInTodo}
            ${buttonsForTaskInInProgress}
            ${buttonsForTaskInDone}
          </div>
          <div class="task-controls">
            <button class="edit-btn" data-id="${this.id}"><img src="./images/pencil-square.svg" /></button>
            <button class="delete-btn" data-id="${this.id}"><img src="./images/trashbin.svg" /></button>
          </div>
        </div>
      </div>
    `;
  }
}

let application = new Application();
application.run();
