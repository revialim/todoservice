import { Injectable } from '@nestjs/common';
import { Todo } from './todos.interface';
import { filter } from 'fp-ts/Array'
import { map } from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';
import { oneThroughThree } from './todos.dto';
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
    // return this.todos.find(t => t.id === id);
    const filtered = filter(this.checkTodoForSameId(id))(this.todos);
    return this.getObjFromArr(filtered);
  }

  update(id: number, todoUpdate: Todo) {
    pipe(
      this.todos, 
      filter(this.checkTodoForSameId(id)), 
      this.getObjFromArr, 
      this.updateTodoObj(todoUpdate.title, todoUpdate.description, todoUpdate.priority, todoUpdate.type)
    );
    // this.todos.find(t => {
    //   if(t.id === id){
    //     t.title = todoUpdate.title;
    //     t.description = todoUpdate.description;
    //     t.priority = todoUpdate.priority;
    //     t.type = todoUpdate.type;
    //   }
    // })
  }

  updateIsDone(id: number, isDone: boolean) {
    pipe(
      this.todos, 
      filter(this.checkTodoForSameId(id)),
      map(this.changeIsDone(isDone)) 
    );
    // this.todos.find(t => {
    //   if(t.id === id){
    //     t.isDone = isDone;
    //   }
    // })
  }

  delete(id: number) {
    // this.todos = this.todos.filter(t => t.id != id);
    this.todos = filter(this.checkTodoForNotSameId(id))(this.todos);
  }

  ///////// helper
  private todoHasNotSameId = (t: Todo, id: number) => t.id != id;
  private checkTodoForNotSameId = (id: number) => (t: Todo) => this.todoHasNotSameId(t, id);

  private todoHasSameId = (t: Todo, id: number) => t.id === id;
  private checkTodoForSameId = (id: number) => (t: Todo) => this.todoHasSameId(t, id);

  private changeIsDone = (isDone: boolean) => (t: Todo) => t.isDone = isDone;
  private updateTodoObj = (ti: string, d: string, p: number, ty: oneThroughThree) => (todo: Todo) => {
    todo.title = ti;
    todo.description = d;
    todo.priority = p;
    todo.type = ty;
  }
  private getObjFromArr = a => a[0];
}