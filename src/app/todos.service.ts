import { Injectable } from '@nestjs/common';
import { Todo } from './todos.interface';
import { CreateTodoDto, oneThroughThree } from './todos.dto';
import { flow, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';

@Injectable()
export class TodosService {
  private todos: Todo[] = [
    {
      title: 'first todo',
      description: 'just an example todo',
      id: 1,
      priority: 9,
      isDone: false,
      type: 1,
      deadline: new Date('2023-01-31'),
    },
  ];

  private todoIdCounter = 1;

  setInitialData(todos: Todo[]) {
    this.todoIdCounter = 0;
    this.todos = todos;
    const assignId = (t) => {
      this.todoIdCounter++;
      t.id = this.todoIdCounter;
    };
    return pipe(this.todos, A.map(assignId));
  }

  create(createTodo: CreateTodoDto): Todo {
    this.todoIdCounter++; //TODO: change this when adding database
    const newTodo: Todo = {
      id: this.todoIdCounter,
      title: createTodo.title ? createTodo.title : '',
      description: createTodo.description ? createTodo.description : '',
      isDone: createTodo.isDone ? createTodo.isDone : false,
      priority: createTodo.priority ? createTodo.priority : 10,
      type: createTodo.type ? createTodo.type : 1,
      deadline: createTodo.deadline ? createTodo.deadline : new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): E.Either<Error, Todo> {
    const errorMessage = `id: ${id} does not exist in todos`;

    const todo = this.todos.find((t) => t.id === id);
    const todoOption = O.fromNullable(todo);
    const todoEither = pipe(
      todoOption,
      E.fromOption(() => 'todoOption error'),
      E.mapLeft(() => new Error(errorMessage)),
    );
    return todoEither;
  }

  update(id: number, todoUpdate: Todo): Todo {
    if (this.todos.find((t) => t.id === id) === undefined) {
      throw new Error(
        `id: ${id} does not exist in todos, therefore cannot be updated`,
      );
    }
    if (todoUpdate.id != undefined && todoUpdate.id != id) {
      throw new Error('The id on an existing todo should not be updated');
    }
    return pipe(
      this.todos,
      this.findTodo(id),
      this.updateTodoObj(
        todoUpdate.title,
        todoUpdate.description,
        todoUpdate.priority,
        todoUpdate.type,
        todoUpdate.deadline,
      ),
    );
  }

  updateIsDone(id: number, isDone: boolean): Todo {
    if (this.todos.find((t) => t.id === id) === undefined) {
      throw new Error(
        `id: ${id} does not exist in todos, therefore cannot be updated`,
      );
    }
    return pipe(this.todos, this.findTodo(id), this.changeIsDone(isDone));
  }

  delete(id: number) {
    if (this.todos.find((t) => t.id === id) === undefined) {
      throw new Error(`id: ${id} does not exist in todos, delete failed`);
    }
    this.todos = A.filter(this.checkTodoForNotSameId(id))(this.todos);
  }

  ///////// helper
  private findTodo: (id: number) => (todoArr: Todo[]) => O.Option<Todo> =
    (id: number) => (todoArr: Todo[]) =>
      O.fromNullable(todoArr.find((t) => t.id === id));

  private checkTodoForNotSameId = (id: number) => (t: Todo) => t.id != id;

  private changeIsDone = (isDone: boolean) => (t: O.Option<Todo>) => {
    O.toNullable(t).isDone = isDone;
    return O.toNullable(t);
  };

  private updateTodoObj: (
    ti: string,
    d: string,
    p: number,
    ty: oneThroughThree,
    dl: Date,
  ) => (todo: O.Option<Todo>) => Todo =
    (ti: string, d: string, p: number, ty: oneThroughThree, dl: Date) =>
    (todo: O.Option<Todo>) => {
      if (O.isSome(todo)) {
        O.toNullable(todo).title = ti;
        O.toNullable(todo).description = d;
        O.toNullable(todo).priority = p;
        O.toNullable(todo).type = ty;
        O.toNullable(todo).deadline = dl;
      }
      return O.toNullable(todo);
    };
  // private getObjFromArr = a => a[0];
}
