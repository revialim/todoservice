import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  BadRequestException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto, dealineQuery } from './todos.dto';
import { Todo } from './todos.interface';
import { TodosService } from './todos.service';
import * as E from 'fp-ts/Either';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  //value = "Creates a new todo, saves it to a list of todos"
  @ApiOperation({
    description: 'Create a new todo, save it to a list of todos',
  })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully created.',
  })
  @Post()
  async create(@Body() createTodo: CreateTodoDto) {
    console.log("🚀 ~ file: todos.controller.ts:34 ~ TodosController ~ create ~ createTodo", createTodo)
    const t = {...createTodo, deadline: new Date(createTodo.deadline)};
    
    console.log("🚀 ~ file: todos.controller.ts:37 ~ TodosController ~ create ~ t", t)
    this.todosService.create(t);
  }

  @ApiOperation({
    description: 'Update a todo by id, mark as done or not done',
  })
  @ApiResponse({
    status: 201,
    description: "The todo's isDone has been successfully updated.",
  })
  @ApiParam({ name: 'id', description: 'Gets the todo id', type: Number })
  @ApiParam({
    name: 'isDone',
    description: "Contains the todo's isDone value",
    type: Boolean,
  })
  @Put('/isDone/:id/:isDone')
  async updateIsDone(@Param() params) {
    // console.log('TodosController => update => params', params);
    // console.log('TodosController => update => updateTodo', updateTodo);
    if (params.isDone === 'true') {
      this.todosService.updateIsDone(Number(params.id), true);
    } else if (params.isDone === 'false') {
      this.todosService.updateIsDone(Number(params.id), false);
    } else {
      throw new BadRequestException('Wrong parameter passed.');
    }
  }

  @ApiOperation({ description: 'Update a todo by id' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully updated.',
  })
  @ApiParam({ name: 'id', description: 'Contains the todo id' })
  @Put(':id')
  async update(@Param() params, @Body() updateTodo: CreateTodoDto) {
    // console.log('TodosController => update => params', params);
    // console.log('TodosController => update => updateTodo', updateTodo);
    this.todosService.update(Number(params.id), updateTodo);
  }

  @ApiOperation({ description: 'Delete a todo by id' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully deleted.',
  })
  @ApiParam({ name: 'id', description: 'Contains the todo id' })
  @Delete(':id')
  delete(@Param() params) {
    this.todosService.delete(Number(params.id));
  }

  @ApiOperation({ description: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'All todos successfully received.' })
  @Get()
  async findAll(@Query() query: dealineQuery): Promise<Todo[]> {
    // TODO: fix this hacky solution 
    // console.log("🚀 ~ file: todos.controller.ts:95 ~ TodosController ~ findAll ~ query", query)
    const from = query.deadlineFrom !== 'undefined' ? query.deadlineFrom : '';
    // console.log("🚀 ~ file: todos.controller.ts:97 ~ TodosController ~ findAll ~ from", from)
    const to = query.deadlineTo !== 'undefined'  ? query.deadlineTo : '';
    return this.todosService.findAll(from, to);
  }

  @ApiOperation({ description: 'Get a todo by id' })
  @ApiResponse({
    status: 200,
    description: 'Todo by id successfully received.',
  })
  @ApiResponse({
    status: 404,
    description: 'Todo not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'Contains the todo id',
  })
  @Get(':id')
  findOne(@Param() params): Todo {
    const maybeTodo = this.todosService.findOne(Number(params.id));
    if (E.isLeft(maybeTodo)) {
      throw new NotFoundException(maybeTodo.left.message);
    } else {
      return maybeTodo.right; //no error occured and todo is returned
    }
  }
}
