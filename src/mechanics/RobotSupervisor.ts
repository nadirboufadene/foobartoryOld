import { newOrderShape } from '../store/actions';
import {
  FoobarElem,
  RobotOrder,
  RobotsShape,
  WarehouseShape,
} from '../store/shapes/shapes';
import { v4 as uuidv4 } from 'uuid';

export class RobotSupervisor {
  private static initialRobot: RobotsShape = {
    timer: 1,
    pendingAction: '',
    processingAction: '',
    identifier: 'temporary',
    specialized: true,
  };

  private static initialFoobarElem: FoobarElem = {
    identifier: 'temporary',
  };

  public static buildNewRobot(): RobotsShape {
    return { ...this.initialRobot, identifier: uuidv4() };
  }

  public static buildNewFoobarElem(): FoobarElem {
    return { ...this.initialFoobarElem, identifier: uuidv4() };
  }

  private static getOrderForNewBotPhaseOne(robots: RobotsShape[]): RobotOrder {
    if (
      !robots.find(
        robot =>
          robot.specialized &&
          (robot.processingAction === 'MINE_BAR' ||
            robot.pendingAction === 'MINE_BAR'),
      )
    ) {
      return 'MINE_BAR';
    }
    if (
      !robots.find(
        robot =>
          robot.specialized &&
          (robot.processingAction === 'ASSEMBLE_FOOBAR' ||
            robot.pendingAction === 'ASSEMBLE_FOOBAR'),
      )
    ) {
      return 'ASSEMBLE_FOOBAR';
    }
    if (
      !robots.find(
        robot =>
          robot.specialized &&
          (robot.processingAction === 'SELL_FOOBAR' ||
            robot.pendingAction === 'SELL_FOOBAR'),
      )
    ) {
      return 'SELL_FOOBAR';
    }
    if (
      !robots.find(
        robot =>
          robot.specialized &&
          (robot.processingAction === 'BUY_ROBOT' ||
            robot.pendingAction === 'BUY_ROBOT'),
      )
    ) {
      return 'BUY_ROBOT';
    }
    return 'MINE_FOO';
  }

  private static getSpecialistRatio(
    firstJob: RobotOrder,
    secondJob: RobotOrder,
    robots: RobotsShape[],
  ) {
    return (
      robots.filter(
        robot =>
          robot.processingAction === firstJob ||
          robot.pendingAction === firstJob,
      ).length /
      robots.filter(
        robot =>
          robot.processingAction === secondJob ||
          robot.pendingAction === secondJob,
      ).length
    );
  }

  private static getOrderForNewBotPhaseTwo(robots: RobotsShape[]): RobotOrder {
    // s'il n'y a pas autant de mineur que d'assembleur je crée un mineur de bar
    if (this.getSpecialistRatio('MINE_BAR', 'ASSEMBLE_FOOBAR', robots) < 1)
      return 'MINE_BAR';
    // s'il n'y a pas de 2 fois plus de mineur de foos que d'assembleur je crée un mineur de foo
    if (this.getSpecialistRatio('MINE_FOO', 'ASSEMBLE_FOOBAR', robots) < 2)
      return 'MINE_FOO';
    // s'il n'y a pas 2 fois plus d'assembleur de foobars que de vendeur de foobar je crée un assembleur
    if (this.getSpecialistRatio('ASSEMBLE_FOOBAR', 'SELL_FOOBAR', robots) < 2)
      return 'ASSEMBLE_FOOBAR';
    return 'SELL_FOOBAR';
  }

  private static enoughRessources(
    order: RobotOrder,
    warehouse: WarehouseShape,
  ): boolean {
    if (
      order === 'BUY_ROBOT' &&
      (warehouse.bank < 3 || warehouse.foos.length < 6)
    ) {
      return false;
    } else if (
      order === 'ASSEMBLE_FOOBAR' &&
      (warehouse.foos.length < 1 || warehouse.bars.length < 1)
    ) {
      return false;
    } else if (order === 'SELL_FOOBAR' && warehouse.foobars.length < 5) {
      return false;
    }
    return true;
  }

  private static putRobotsOnOrder(
    robots: RobotsShape[],
    order: RobotOrder,
  ): newOrderShape[] {
    let orders: newOrderShape[] = [];
    robots.map(robot =>
      orders.push({
        order: order,
        robotIdentifier: robot.identifier,
      }),
    );
    return orders;
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
    if (!this.enoughRessources('BUY_ROBOT', warehouse)) {
      orders = orders.concat(
        this.putRobotsOnOrder(
          robots.filter(robot => robot.processingAction === 'BUY_ROBOT'),
          'WAITING_RESSOURCES',
        ),
      );
    } else {
      orders = orders.concat(
        this.putRobotsOnOrder(
          robots.filter(
            robot =>
              robot.processingAction === 'WAITING_RESSOURCES' &&
              robot.pendingAction === 'BUY_ROBOT',
          ),
          'RESUME_MISSION',
        ),
      );
    }
    return orders;
  }

  private static phaseTwo(robots: RobotsShape[]): newOrderShape[] {
    let orders: newOrderShape[] = [];

    const newRobots = robots.filter(
      robot =>
        robot.specialized === true &&
        robot.pendingAction === '' &&
        robot.processingAction === '',
    );
    if (newRobots) {
      newRobots.map(robot =>
        orders.push({
          order: this.getOrderForNewBotPhaseTwo(robots),
          robotIdentifier: robot.identifier,
        }),
      );
    }
    return orders;
  }

  public static getNewOrders(
    robots: RobotsShape[],
    warehouse: WarehouseShape,
  ): newOrderShape[] {
    let orders: newOrderShape[] = [];

    if (robots.length <= 5) orders = this.phaseOne(robots, warehouse);
    else {
      const flyingRobot = robots.find(robot => robot.specialized === false);
      if (flyingRobot)
        orders.push({
          robotIdentifier: flyingRobot.identifier,
          order: 'BUY_ROBOT',
        });
      orders = orders.concat(this.phaseTwo(robots));
    }

    if (!this.enoughRessources('ASSEMBLE_FOOBAR', warehouse)) {
      orders = orders.concat(
        this.putRobotsOnOrder(
          robots.filter(robot => robot.processingAction === 'ASSEMBLE_FOOBAR'),
          'WAITING_RESSOURCES',
        ),
      );
    } else {
      orders = orders.concat(
        this.putRobotsOnOrder(
          robots.filter(
            robot =>
              robot.processingAction === 'WAITING_RESSOURCES' &&
              robot.pendingAction === 'ASSEMBLE_FOOBAR',
          ),
          'RESUME_MISSION',
        ),
      );
    }
    if (!this.enoughRessources('SELL_FOOBAR', warehouse)) {
      orders = orders.concat(
        this.putRobotsOnOrder(
          robots.filter(robot => robot.processingAction === 'SELL_FOOBAR'),
          'WAITING_RESSOURCES',
        ),
      );
    } else {
      orders = orders.concat(
        this.putRobotsOnOrder(
          robots.filter(
            robot =>
              robot.processingAction === 'WAITING_RESSOURCES' &&
              robot.pendingAction === 'SELL_FOOBAR',
          ),
          'RESUME_MISSION',
        ),
      );
    }
    return orders;
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
    if (task === 'RESUME_MISSION') {
      return 0;
    }
    if (task === 'WAITING_RESSOURCES') {
      return 0;
    }
    return 0;
  }
}
