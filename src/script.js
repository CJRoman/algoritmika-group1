class Application {

  constructor() {
    this.tasks = [];
    let body = document.querySelector("body");
    this.createTaskBtn = document.getElementById("create-task-button");
    this.todoTasksList = document.getElementById("todo-tasks-list");
    this.inProgressTasksList = document.getElementById("in-progress-tasks-list");
    this.doneTasksList = document.getElementById("done-tasks-list");
  }

  run() {
    this.createTaskBtn.addEventListener("click", () => this.addTask());
    document.body.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        this.destroyTask(id);
      }
    });
    document.body.addEventListener("click", (d) =>{
      if(d.target.classList.contains("edit-btn")){
        const id = d.target.dataset.id;
        this.editTask;
      }
    })
    
      
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
    const idsArray = this.tasks.map(task => task.id);
    const taskToDestroy = idsArray.indexOf(+taskId);
    if (taskToDestroy === -1) {
      return;
    }

    this.tasks.splice(taskToDestroy, 1);
    this.update();
  }
  
  editTask() {
    let taskEdit = prompt("Введите изменения");
    if(!taskEdit) {
      return
    }

    let editedTask = new Task(taskName);
    this.tasks.push(task);

    this.update()
  }
 
}

class Task {

  constructor(name) {
    this.name = name;
    this.id = Date.now();
  }

  render() {
    return `
      <div class="task">
        <p>${this.name}</p>
        <button class="delete-btn" data-id="${this.id}">Удалить</button>
        <button class="edit-btn" data-id="${this.id}">Изменить</button>
      </div>
    `; 
  }
}

let application = new Application();
application.run();
