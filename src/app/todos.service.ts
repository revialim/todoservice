import { Injectable } from '@nestjs/common';
import { Todo } from './todos.interface';

@Injectable()
export class TodosService {
  
  private todos: Todo[] = [{
    title: 'first todo',
    description: 'just an example todo',
    id: 1,
    priority: 9,
    isDone: false,
    type: 1
  }];

  private todoIdCounter = 1;

  create(todo: Todo) {
    this.todoIdCounter ++; //TODO: change this when adding database
    todo.id = this.todoIdCounter;

    this.todos.push(todo);
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    return this.todos.find(t => t.id === id);
  }

  update(id: number, todoUpdate: Todo) {
    this.todos.find(t => {
      if(t.id === id){
        t.title = todoUpdate.title;
        t.description = todoUpdate.description;
        t.priority = todoUpdate.priority;
        t.type = todoUpdate.type;
      }
    })
  }

  updateIsDone(id: number, isDone: boolean) {
    // console.log("🚀 ~ file: todos.service.ts ~ line 45 ~ TodosService ~ updateIsDone ~ isDone", isDone)
    this.todos.find(t => {
      if(t.id === id){
        t.isDone = isDone;
      }
    })
  }

  delete(id: number) {
    this.todos = this.todos.filter(t => t.id != id);
  }
}