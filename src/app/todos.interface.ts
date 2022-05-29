export interface Todo {
  title: string;
  description: string;
  id: Readonly<number>;
  priority: number;
  isDone: boolean;
  /**
   * {"WORK":1,"PERSONAL":2,"IMPORTANT":3}
   */
  type: 1 | 2 | 3;
}