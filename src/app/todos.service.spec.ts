import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './todos.dto';
import { Todo } from './todos.interface';
import { TodosService } from './todos.service';
import * as E from 'fp-ts/Either';

describe('TodosService', () => {
  let todosService: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService],
    }).compile();

    todosService = module.get<TodosService>(TodosService);
  });

  describe('setInitialData', () => {
    const initTodos: Todo[] = [
      {
        title: 'first todo',
        description: 'just an example todo',
        id: 0,
        priority: 9,
        isDone: false,
        type: 1,
        deadline: new Date('2023-01-31'),
      },
      {
        title: 'second todo',
        description: 'just an example todo',
        id: 0,
        priority: 9,
        isDone: false,
        type: 1,
        deadline: new Date('2023-01-31'),
      },
    ];
    it('should create initial todo array with individual ids', async () => {
      todosService.setInitialData(initTodos);
      const initializedTodos = todosService.findAll('','');
      expect(initializedTodos).toEqual(initTodos);
    });
  });

  describe('create', () => {
    it('should add todo to list of todos and return the new todo', async () => {
      todosService.setInitialData([]);
      const newTodo: CreateTodoDto = {
        id: 0,
        title: 'title',
        description: 'description',
        type: 1,
        priority: 5,
        isDone: false,
        deadline: new Date(),
      };
      const createdTodo = todosService.create(newTodo);
      const newTodoWithId: Todo = {
        id: 1,
        title: 'title',
        description: 'description',
        type: 1,
        priority: 5,
        isDone: false,
        deadline: new Date(),
      };
      expect(createdTodo).toEqual(newTodoWithId);
    });
    it('should fill in default values, if a property is undefined', async () => {
      const newTodo: CreateTodoDto = {
        id: 0,
        title: 'sometitle',
        description: undefined,
        type: undefined,
        priority: undefined,
        isDone: undefined,
        deadline: new Date('2023-01-31'),
      };
      const createdTodo = todosService.create(newTodo);
      expect(createdTodo).toEqual({
        id: createdTodo.id,
        title: 'sometitle',
        description: '',
        type: 1,
        priority: 10,
        isDone: false,
        deadline: new Date('2023-01-31'),
      });
    });
  });

  describe('findAll', () => {
    it('should find list of todos', async () => {
      todosService.setInitialData([]);
      const todos: Todo[] = [];
      expect(todosService.findAll('', '')).toEqual(todos);
    });
  });

  describe('findOne', () => {
    const initialTodo: Todo = {
      title: 'first todo',
      description: 'just an example todo',
      id: 1,
      priority: 9,
      isDone: false,
      type: 1,
      deadline: new Date('2023-01-31'),
    };

    it('should find a certain todo by id', async () => {
      todosService.setInitialData([initialTodo]);
      const todoEitherRight = E.right(initialTodo);
      const foundTodo = todosService.findOne(1);
      expect(foundTodo).toEqual(todoEitherRight);
    });
    it('should throw error when todo with corresponding id does not exist', async () => {
      todosService.setInitialData([initialTodo]);
      const findOneEither = todosService.findOne(2);
      expect(E.isLeft(findOneEither)).toEqual(true);
    });
  });

  describe('update', () => {
    const initialTodo: Todo = {
      title: 'first todo',
      description: 'just an example todo',
      id: 1,
      priority: 9,
      isDone: false,
      type: 1,
      deadline: new Date('2023-01-31'),
    };

    it('should update a todo by id in test data to todoWithChanges', async () => {
      todosService.setInitialData([initialTodo]);
      const todoWithChanges: Todo = {
        title: 'updated todo',
        description: 'just an example todo',
        id: 1,
        priority: 7,
        isDone: false,
        type: 2,
        deadline: new Date('2023-01-31'),
      };
      const updatedTodo = todosService.update(1, todoWithChanges);
      expect(updatedTodo).toEqual(todoWithChanges);
    });
    it('should fail to update a todo, if the todo id does not exist in todo data', async () => {
      todosService.setInitialData([initialTodo]);
      const todoWithChanges: Todo = {
        title: 'updated todo',
        description: 'just an example todo',
        id: 1,
        priority: 7,
        isDone: false,
        type: 2,
        deadline: new Date('2023-01-31'),
      };
      expect(() => todosService.update(2, todoWithChanges)).toThrowError(
        new Error('id: 2 does not exist in todos, therefore cannot be updated'),
      );
    });
    it('should throw error, if trying to update id of an existing todo', async () => {
      todosService.setInitialData([initialTodo]);
      const todoWithChanges: Todo = {
        title: 'updated todo',
        description: 'just an example todo',
        id: 2,
        priority: 7,
        isDone: false,
        type: 2,
        deadline: new Date('2023-01-31'),
      };
      expect(() => todosService.update(1, todoWithChanges)).toThrowError(
        new Error('The id on an existing todo should not be updated'),
      );
    });
  });

  describe('updateIsDone', () => {
    const initialTodo: Todo = {
      title: 'first todo',
      description: 'just an example todo',
      id: 1,
      priority: 9,
      isDone: false,
      type: 1,
      deadline: new Date('2023-01-31'),
    };

    it("should update a todo's isDone value", async () => {
      todosService.setInitialData([initialTodo]);
      const todoWithChanges: Todo = {
        title: 'first todo',
        description: 'just an example todo',
        id: 1,
        priority: 9,
        isDone: true,
        type: 1,
        deadline: new Date('2023-01-31'),
      };
      const updatedTodo = todosService.updateIsDone(1, true);
      expect(updatedTodo).toEqual(todoWithChanges);
    });
    it('should fail to update a todo, if the todo id does not exist in todo data', async () => {
      todosService.setInitialData([initialTodo]);
      expect(() => todosService.updateIsDone(2, true)).toThrowError(
        new Error('id: 2 does not exist in todos, therefore cannot be updated'),
      );
    });
  });

  describe('delete', () => {
    const initialTodo: Todo = {
      title: 'first todo',
      description: 'just an example todo',
      id: 1,
      priority: 9,
      isDone: false,
      type: 1,
      deadline: new Date('2023-01-31'),
    };
    it("should throw error, if there's no todo with given id", async () => {
      todosService.setInitialData([initialTodo]);
      expect(() => todosService.delete(2)).toThrowError(
        new Error('id: 2 does not exist in todos, delete failed'),
      );
    });
    it('should remove todo with respective id from todo list', async () => {
      todosService.setInitialData([initialTodo]);
      todosService.delete(1);
      const todosAfterDelete = todosService.findAll('','');
      expect(todosAfterDelete.length).toBe(0);
    });
  });
});
