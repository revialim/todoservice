import { Controller, Get, Post, Param, Body, Delete, Put } from '@nestjs/common';
import { CreateTodoDto } from './todos.dto';
import { Todo } from './todos.interface';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  async create(@Body() createTodo: CreateTodoDto) {
    this.todosService.create(createTodo);
  }

  @Put(':id')
  async update(@Param() params, @Body() updateTodo: CreateTodoDto) {
    // console.log('TodosController => update => params', params);
    // console.log('TodosController => update => updateTodo', updateTodo);
    this.todosService.update(Number(params.id), updateTodo);
  }

  @Delete(':id')
  delete(@Param() params) {
    this.todosService.delete(params.id);
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a todo with id #${params.id} `;
  }
}