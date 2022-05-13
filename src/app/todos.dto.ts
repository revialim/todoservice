export class CreateTodoDto {
  readonly title: string;
  readonly description: string;
  readonly id: number;
  readonly priority: number;
  readonly isDone: boolean;
  /**
   * {"WORK":1,"PERSONAL":2,"IMPORTANT":3}
   */
   readonly type: 1 | 2 | 3;
}