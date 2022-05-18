import { Test } from "@nestjs/testing";
import { TodosController } from "./todos.controller";
import { CreateTodoDto } from "./todos.dto";
import { Todo } from "./todos.interface";
import { TodosService } from "./todos.service";

describe('TodosController', () => {
  let todosController:  TodosController;
  let todosService: TodosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [TodosService]
    }).compile();

    todosService = module.get<TodosService>(TodosService);
    todosController = module.get<TodosController>(TodosController);
  });

  describe('create', () => {
    it('should add todo to list of todos', async () => {
      const todo: Todo = {title: 'title', description: 'description', id: 1, type: 1, priority: 5, isDone: false};

      expect(await todosController.create(todo)).toEqual(undefined);
    })
  })

  describe('update', () => {
    it('should update todo by id in list of todos', async () => {
      const todo: CreateTodoDto = {title: 'title', description: 'description', id: 1, type: 1, priority: 5, isDone: false};
      jest.spyOn(todosService, 'update').mockImplementation(() => undefined);

      expect(await todosController.update(1, todo)).toBe(undefined);
    })
  })

  describe('delete', () => {
    it('should delete todo by id from list of todos', async () => {
      const todos: Todo[] = [ {title: 'title', description: 'description', id: 1, type: 1, priority: 5, isDone: false}];
      jest.spyOn(todosService, 'delete').mockImplementation((id) => todos.filter(t => t.id != id));

      expect(await todosController.delete(1)).toBe(undefined);
    })
  })

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result: Todo[] = [{title: 'title', description: 'description', id: 1, type: 1, priority: 5, isDone: false}];
      jest.spyOn(todosService, 'findAll').mockImplementation(() => result);

      expect(await todosController.findAll()).toEqual(result);
      expect(todosService.findAll).toHaveBeenCalled();
    })
  })

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const result: Todo= {title: 'title', description: 'description', id: 1, type: 1, priority: 5, isDone: false};
      jest.spyOn(todosService, 'findOne').mockImplementation(() => result);

      expect(await todosController.findOne(1)).toBe(result);
    })

    // it('should not find a todo', async () => {
    //   jest.spyOn(todosService, 'findOne').mockImplementation(() => null);

    //   expect(await todosController.findOne(2)).toBe(undefined);
    // })
  })

})