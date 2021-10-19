import { newOrderShape } from '../store/actions';
import {
  RobotOrder,
  RobotsShape,
  WarehouseShape,
} from '../store/shapes/shapes';

export class RobotSupervisor {
  private static getOrderForNewBotPhaseOne(robots: RobotsShape[]): RobotOrder {
    if (
      robots.find(
        robot =>
          !robot.specialized &&
          (robot.processingAction === 'MINE_BAR' ||
            robot.pendingAction === 'MINE_BAR'),
      )
    ) {
      return 'MINE_BAR';
    }
    if (
      robots.find(
        robot =>
          !robot.specialized &&
          (robot.processingAction === 'ASSEMBLE_FOOBAR' ||
            robot.pendingAction === 'ASSEMBLE_FOOBAR'),
      )
    ) {
      return 'ASSEMBLE_FOOBAR';
    }
    if (
      robots.find(
        robot =>
          !robot.specialized &&
          (robot.processingAction === 'SELL_FOOBAR' ||
            robot.pendingAction === 'SELL_FOOBAR'),
      )
    ) {
      return 'SELL_FOOBAR';
    }
    return 'BUY_ROBOT';
  }

  private static phaseOne(
    robots: RobotsShape[],
    warehouse: WarehouseShape,
  ): newOrderShape[] {
    let orders: newOrderShape[] = [];
    const flyingRobot = robots.find(robot => !robot.specialized);
    // check s'il y a un robot spécialiste sans mission
    // lui attribue une mission si c'est le cas
    // par ordre de création bars => foobars => sell foobars => buy robot
    const newRobots = robots.filter(
      robot =>
        robot.specialized === true &&
        robot.pendingAction === '' &&
        robot.processingAction === '',
    );
    if (newRobots) {
      newRobots.map(robot =>
        orders.push({
          order: this.getOrderForNewBotPhaseOne(robots),
          robotIdentifier: robot.identifier,
        }),
      );
    }
    // check s'il y a assez de ressource pour créer un robot
    // si oui demande au robot spécialiste d'en créer un
    // s'il n'y a pas de robot spécialiste, demande au robot volant de changer de mission et de créer un robot
    if (warehouse.bank >= 3 && warehouse.foos.length >= 6) {
      if (
        flyingRobot!.processingAction !== 'BUY_ROBOT' &&
        flyingRobot!.pendingAction !== 'BUY_ROBOT'
      ) {
        orders.push({
          robotIdentifier: flyingRobot!.identifier,
          order: 'BUY_ROBOT',
        });
      }
    }
    // check s'il y a au moins 5 foobars demande et demande au robot spécialiste de vendre 5 foobars
    // s'il n'y a pas de robot spécialiste demande au robot volant
    else if (warehouse.foobars.length >= 5) {
      if (
        flyingRobot!.processingAction !== 'SELL_FOOBAR' &&
        flyingRobot!.pendingAction !== 'SELL_FOOBAR'
      ) {
        orders.push({
          robotIdentifier: flyingRobot!.identifier,
          order: 'SELL_FOOBAR',
        });
      }
    }
    // check s'il y a au moins 5 bars et au moins 5 foos
    // demande au robot volant de d'assembler des foobars s'il n'y a pas un robot spécialiste
    else if (warehouse.foos.length >= 5 && warehouse.bars.length > 0) {
      if (
        flyingRobot!.processingAction !== 'ASSEMBLE_FOOBAR' &&
        flyingRobot!.pendingAction !== 'ASSEMBLE_FOOBAR'
      ) {
        orders.push({
          robotIdentifier: flyingRobot!.identifier,
          order: 'ASSEMBLE_FOOBAR',
        });
      }
    } else if (
      flyingRobot!.processingAction !== 'MINE_BAR' &&
      flyingRobot!.pendingAction !== 'MINE_BAR'
    ) {
      orders.push({
        robotIdentifier: flyingRobot!.identifier,
        order: 'MINE_BAR',
      });
    }

    return orders;
  }

  private static phaseTwo(
    robots: RobotsShape[],
    warehouse: WarehouseShape,
  ): newOrderShape[] {
    return [];
  }

  public static getNewOrders(
    robots: RobotsShape[],
    warehouse: WarehouseShape,
  ): newOrderShape[] {
    return this.phaseOne(robots, warehouse);
  }

  public static getTaskTimer(task: RobotOrder): number {
    function genRand(min: number, max: number, decimalPlaces: number) {
      var rand = Math.random() * (max - min) + min;
      var power = Math.pow(10, decimalPlaces);
      return Math.floor(rand * power) / power;
    }

    if (task === 'MINE_BAR') {
      return 1;
    }
    if (task === 'CHANGE_TASK') {
      return 5;
    }
    if (task === 'MINE_FOO') {
      return genRand(0.5, 2.5, 1);
    }
    if (task === 'ASSEMBLE_FOOBAR') {
      return 2;
    }
    if (task === 'BUY_ROBOT') {
      return 0;
    }
    if (task === 'SELL_FOOBAR') {
      return 10;
    }
    return 0;
  }
}
