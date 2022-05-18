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
    console.log('new todo - push todo: ', todo);

    this.todos.push(todo);
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    return this.todos.find(t => t.id === id);
  }

  update(id: number, todoUpdate: Todo){
    this.todos.find(t => {
      if(t.id === id){
        console.log('t.id === id')
        t.title = todoUpdate.title;
        t.description = todoUpdate.description;
      }
    })
    // console.log('TodosService => update => todoUpdate', todoUpdate);
    // console.log('TodosService => update => this.todos', this.todos);
  }

  delete(id: number) {
    this.todos = this.todos.filter(t => t.id != id);
  }
}