class Application {

  constructor() {
    this.tasks = [];
  }

  addTask(name) {  
    let task = new Task(name);
    this.tasks.push(task);
  }

  destroyTask(taskId) {

  }

}

class Task {
  
  constructor(name) {
    this.name = name;
    this.isCompleted = false;
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
application.addTask("Задача №1");
application.addTask("Задача №2");


