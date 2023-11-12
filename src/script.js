class Application {

  constructor() {
    this.tasks = [];

    this.createTaskBtn = document.getElementById("create-task-button");
    this.todoTasksList = document.getElementById("todo-tasks-list");
    this.inProgressTasksList = document.getElementById("in-progress-tasks-list");
    this.doneTasksList = document.getElementById("done-tasks-list");
  }

  run() {
    this.createTaskBtn.addEventListener('click', () => this.addTask());
  }

  update() {
    let tasksHTML = this.tasks.map((task) => task.render()).join("");
    this.todoTasksList.innerHTML = tasksHTML;
  }

  addTask() {
    let taskName = prompt("Введите название задачи");
    if (!taskName) {
      return;
    }

    let task = new Task(taskName);
    this.tasks.push(task);

    this.update();
  }

  destroyTask(taskId) {

  }

}

class Task {

  constructor(name) {
    this.name = name;
    this.id = Date.now();
    this.isCompleted = false;
  }

  render() {
    return `
      <div class="task">
        <p>${this.name}</p>
      </div>
    `;
  }

  edit() {

  }

  destroy() {

  }

  complete() {

  }

  uncomplete() {

  }

}

let application = new Application();
application.run();


