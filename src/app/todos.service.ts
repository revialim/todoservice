import { Injectable } from '@nestjs/common';
import { Todo } from './todos.interface';

@Injectable()
export class TodosService {
  
  private readonly todos: Todo[] = [{
    title: 'first todo',
    description: 'just an example todo',
    id: 1,
    priority: 9,
    isDone: false,
    type: 1
  }];

  create(todo: Todo) {
    console.log('new todo - push todo: ', todo);
    this.todos.push(todo);
  }

  findAll(): Todo[] {
    return this.todos;
  }
}