import { Controller, Get, Post, Param } from '@nestjs/common';

@Controller('todos')
export class TodosController {
  @Post()
  create(): string {
    return 'This action adds a new todo';
  }

  @Get()
  findAll(): string {
    return 'This action returns all todos';
  }

  @Get(':id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a todo with id #${params.id} `;
  }
}