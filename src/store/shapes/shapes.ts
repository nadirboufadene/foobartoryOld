export interface FoobarElem {
  identifier: string;
}

export interface Foobar {
  foo: FoobarElem;
  bar: FoobarElem;
}

export type RobotOrder =
  | 'ASSEMBLE_FOOBAR'
  | 'SELL_FOOBAR'
  | 'MINE_BAR'
  | 'MINE_FOO'
  | 'BUY_ROBOT'
  | 'CHANGE_TASK'
  | 'WAITING_RESSOURCES'
  | 'RESUME_MISSION'
  | '';

export interface RobotsShape {
  timer: number;
  processingAction: RobotOrder;
  pendingAction: RobotOrder;
  identifier: string;
  specialized: boolean;
  waitingRessources: boolean;
}

export interface WarehouseShape {
  foos: FoobarElem[];
  bars: FoobarElem[];
  foobars: Foobar[];
  bank: number;
}
