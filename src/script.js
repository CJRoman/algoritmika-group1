const STATUSES = {
  todo: "todo",
  inProgress: "inProgress",
  done: "done"
};

LOCAL_STORAGE_KEY = "tasks";
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class Application {

  constructor() {
    this.tasks = [];
    this.editMode = false;
    this.editedTask = null;

    this.todoTasksList = document.getElementById("todo-tasks-list");
    this.inProgressTasksList = document.getElementById("in-progress-tasks-list");
    this.doneTasksList = document.getElementById("done-tasks-list");
    this.toggleThemeBtn = document.getElementById("toggle-theme");

    this.createTaskBtn = document.getElementById("create-task-button");
    this.taskInput = document.getElementById("create-task-input");
    this.voiceInputBtn = document.getElementById("voice-input-button");

    if (window.SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = 'ru-RU';
      this.speechRecognition.addEventListener('result', this.handleSpeechRecognition.bind(this));
      this.speechRecognition.onerror = (e) => {
        console.log(e.error);

        if (e.error == 'no-speech') {
          this.voiceInputBtn.classList.remove('active');
          this.taskInput.placeholder = "Введите название задачи";
        }
      }
    }
  }

  run() {
    this.createTaskBtn.addEventListener("click", () => this.updateTask());
    this.taskInput.addEventListener("keypress", (e) => {
      if (e.key === 'Enter') {
        this.updateTask();
      }
    });
    this.toggleThemeBtn.addEventListener("click", () => {
      if (document.body.classList.contains("night")) {
        document.body.classList.remove("night");
        window.localStorage.setItem("theme", "");
      } else {
        document.body.classList.add("night");
        window.localStorage.setItem("theme", "night");
      }
    });
    this.voiceInputBtn.addEventListener("click", () => {
      this.taskInput.placeholder = "Говорите...";
      this.voiceInputBtn.classList.add('active');
      this.speechRecognition.start();
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

  handleSpeechRecognition(e) {
    this.taskInput.placeholder = "Распознавание...";
    this.voiceInputBtn.classList.remove('active');
    const result = e.results[0];
    if (result.isFinal) {
      this.taskInput.value = result[0].transcript;
      this.taskInput.placeholder = "Введите название задачи";
    }
  }

  saveState() {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.tasks));
  }

  update() {
    let todoTasksHTML = this.tasks.filter(task => task.status === STATUSES.todo).map((task) => task.render()).join("");
    let inProgressTasksHTML = this.tasks.filter(task => task.status === STATUSES.inProgress).map((task) => task.render()).join("");
    let doneTasksHTML = this.tasks.filter(task => task.status === STATUSES.done).map((task) => task.render()).join("");

    this.todoTasksList.innerHTML = todoTasksHTML;
    this.inProgressTasksList.innerHTML = inProgressTasksHTML;
    this.doneTasksList.innerHTML = doneTasksHTML;

    this.saveState()
  }

  updateTask() {
    let taskName = this.taskInput.value;
    if (!taskName) {
      return;
    }

    if (!this.editMode) {
      let task = new Task({ name: taskName, appearanceAnimation: true });
      this.tasks.push(task);
    } else {
      this.editedTask.name = taskName;
      this.editedTask.editing = false;
      this.editedTask = null;
      this.editMode = false;
    }

    this.update();
    this.tasks.forEach(task => task.appearanceAnimation = false);
    this.saveState();
    this.taskInput.value = "";
  }

  destroyTask(taskId) {
    const idsArray = this.tasks.map(task => task.id);
    const taskToDestroy = this.tasks.find(task => task.id);
    const taskToDestroyId = idsArray.indexOf(+taskId);
    if (taskToDestroyId === -1) {
      return;
    }
    taskToDestroy.disappearanceAnimation = true;
    this.update();

    this.tasks.splice(taskToDestroyId, 1);
    this.saveState();
  }

  editTask(taskId) {
    this.editMode = true;
    let task = this.tasks.find(task => task.id === +taskId);
    this.editedTask = task;
    task.editing = true;
    this.taskInput.value = task.name;
    this.taskInput.select();
    this.taskInput.focus();
    this.update();
  }

  moveInProgress(taskId) {
    let task = this.tasks.find(task => task.id === +taskId);
    new Promise((resolve) => {
      task.disappearanceAnimation = true;
      this.update();
      setTimeout(() => resolve(), 150);
    }).then(() => {
      task.status = STATUSES.inProgress;
      task.appearanceAnimation = true;
      task.disappearanceAnimation = false;
      this.update();

      this.tasks.forEach(task => task.appearanceAnimation = false);
      this.saveState();
    })
  }

  moveInTodo(taskId) {
    let task = this.tasks.find(task => task.id === +taskId);
    new Promise((resolve) => {
      task.disappearanceAnimation = true;
      this.update();
      setTimeout(() => resolve(), 150);
    }).then(() => {
      task.status = STATUSES.todo;
      task.appearanceAnimation = true;
      task.disappearanceAnimation = false;
      this.update();

      this.tasks.forEach(task => task.appearanceAnimation = false);
      this.saveState();
    })
  }

  moveInDone(taskId) {
    let task = this.tasks.find(task => task.id === +taskId);
    new Promise((resolve) => {
      task.disappearanceAnimation = true;
      this.update();
      setTimeout(() => resolve(), 150);
    }).then(() => {
      task.status = STATUSES.done;
      task.appearanceAnimation = true;
      task.disappearanceAnimation = false;
      this.update();

      this.tasks.forEach(task => task.appearanceAnimation = false);
      this.saveState();
    })
  }

}

class Task {

  constructor(options) {
    this.name = options.name;
    this.id = options.id || Date.now();
    this.status = options.status || STATUSES.todo;
    this.appearanceAnimation = options.appearanceAnimation || false;
    this.disappearanceAnimation = options.disappearanceAnimation || false;
    this.editing = false;
  }

  render() {
    let buttonsForTaskInTodo = this.status === STATUSES.todo ? `<button class="to-in-progress" data-id="${this.id}"><img src="./images/play.svg" /></button>` : "";
    let buttonsForTaskInInProgress = this.status === STATUSES.inProgress ? `<button class="to-to-do" data-id="${this.id}"><img src="./images/rewind.svg" /></button><button class="to-done" data-id="${this.id}"><img src="./images/finish.svg" /></button>` : "";
    let buttonsForTaskInDone = this.status === STATUSES.done ? `<button class="to-to-do" data-id="${this.id}"><img src="./images/rewind.svg" /></button>` : "";
    return `
      <div class="task
        ${this.appearanceAnimation ? 'animation-in' : null}
        ${this.disappearanceAnimation ? 'animation-out' : null}
        ${this.editing ? 'editing' : null}">
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
