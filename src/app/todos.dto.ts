import { ApiProperty } from '@nestjs/swagger';

export type oneThroughThree = 1 | 2 | 3;
export type dealineQuery = {deadlineFrom: string, deadlineTo: string}
export class CreateTodoDto {
  @ApiProperty({
    description: 'Todo title',
    type: String,
  })
  readonly title: string;

  @ApiProperty({
    description: 'Todo description',
    type: String,
  })
  readonly description: string;

  @ApiProperty({
    description: 'Todo ID',
    type: Number,
  })
  readonly id: number;

  @ApiProperty({
    description: "A todo's priority (1-10)",
    type: Number,
  })
  readonly priority: number;
  @ApiProperty({
    description: 'Variable to keep track, if a todo has been done',
  })
  readonly isDone: boolean;
  /**
   * {"WORK":1,"PERSONAL":2,"IMPORTANT":3}
   */
  @ApiProperty({
    description: 'Types for todos encoded by numbers',
    example: '"WORK": 1,"PERSONAL": 2,"IMPORTANT": 3',
  })
  readonly type: oneThroughThree;

  @ApiProperty({
    description: 'A deadline for the todo',
    example: '2023-01-31',
  })
  readonly deadline: Date;
}
