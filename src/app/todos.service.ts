import { Injectable } from '@nestjs/common';
import { Todo } from './todos.interface';
import { filter } from 'fp-ts/Array'
// import { map } from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';
import { CreateTodoDto, oneThroughThree } from './todos.dto';
// import { None, Some } from 'fp-ts/lib/Option';
import * as O from 'fp-ts/Option'
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

  setInitialData(todos: Todo[]){
    this.todoIdCounter = 0;
    this.todos = todos;
    this.todos.map(t => {
      this.todoIdCounter ++;
      t.id = this.todoIdCounter;
    });
    // this.todos = [];
    // return pipe(
    //   todos,
    //   (ts) => {
    //     ts.forEach(t =>{
    //       this.todoIdCounter ++;
    //       t.id = this.todoIdCounter;
    //       this.todos.push(t);
    //     });
    //     return this.todos;
    //   },
      // O.map()
    // )
  }

  create(createTodo: CreateTodoDto): Todo {
    this.todoIdCounter ++; //TODO: change this when adding database
    const newTodo: Todo = {
      id: this.todoIdCounter,
      title: createTodo.title ? createTodo.title : '',
      description: createTodo.description ? createTodo.description : '',
      isDone: createTodo.isDone ? createTodo.isDone : false,
      priority: createTodo.priority ? createTodo.priority : 10,
      type: createTodo.type ? createTodo.type : 1
    }
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    if(this.todos.find(t => t.id === id) == undefined){
      throw new Error(`id: ${id} does not exist in todos`)
    }
    return pipe(
      this.todos,
      this.findTodo(id),
      (t) => O.toNullable(t),
    );
  }

  update(id: number, todoUpdate: Todo): Todo {
    if(this.todos.find(t => t.id === id) == undefined){
      throw new Error(`id: ${id} does not exist in todos, therefore cannot be updated`)
    }
    if(todoUpdate.id != id){
      throw new Error('The id on an existing todo should not be updated')
    }
    return pipe(
      this.todos, 
      this.findTodo(id),
      this.updateTodoObj(todoUpdate.title, todoUpdate.description, todoUpdate.priority, todoUpdate.type)
    );
  }

  updateIsDone(id: number, isDone: boolean): Todo {
    if(this.todos.find(t => t.id === id) == undefined){
      throw new Error(`id: ${id} does not exist in todos, therefore cannot be updated`)
    }
    return pipe(
      this.todos, 
      this.findTodo(id),
      this.changeIsDone(isDone)
    );
  }

  delete(id: number) {
    if(this.todos.find(t => t.id === id) == undefined){
      throw new Error(`id: ${id} does not exist in todos, delete failed`)
    }
    this.todos = filter(this.checkTodoForNotSameId(id))(this.todos);
  }

  ///////// helper
  private findTodo: (id:number) => (todoArr: Todo[]) => O.Option<Todo> = (id: number) => (todoArr: Todo[]) => O.fromNullable(todoArr.find(t => t.id === id));

  private checkTodoForNotSameId = (id: number) => (t: Todo) => t.id != id;

  private changeIsDone = (isDone: boolean) => (t: O.Option<Todo>) => {
    O.toNullable(t).isDone = isDone
    return O.toNullable(t);
  };

  private updateTodoObj: (ti: string, d: string, p: number, ty: oneThroughThree) => (todo:  O.Option<Todo>) => Todo = 
    (ti: string, d: string, p: number, ty: oneThroughThree) => (todo:  O.Option<Todo>) => {
      if(O.isSome(todo)){
        O.toNullable(todo).title = ti;
        O.toNullable(todo).description = d;
        O.toNullable(todo).priority = p;
        O.toNullable(todo).type = ty;
      }
      return O.toNullable(todo);
    }
  // private getObjFromArr = a => a[0];
}