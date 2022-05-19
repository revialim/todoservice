import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from './todos.interface';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let todosService: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService],
    }).compile();

    todosService = module.get<TodosService>(TodosService);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // }); 
  describe('create', () => {
    it('should add todo to list of todos', async () => {
      const todo: Todo = {title: 'title', description: 'description', id: 1, type: 1, priority: 5, isDone: false};
      jest.spyOn(todosService, 'create').mockImplementation(todo => undefined);

      expect(todosService.create(todo)).toEqual(undefined);
    })
  })
});
