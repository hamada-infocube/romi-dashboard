import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { SossTransport } from '@osrf/romi-js-soss-transport';
import FakeTrajectoryManager from './mock/fake-traj-manager';
import FakePlanningManager from './mock/fake-planning-manager';
import { FakeTransport } from './mock/fake-transport';
import { DefaultTrajectoryManager, RobotTrajectoryManager } from './robot-trajectory-manager';
import { DefaultPlanningManager, PlanningManager } from './planning-manager';

export interface AppConfig {
  transportFactory: () => Promise<RomiCore.Transport>;
  trajectoryManagerFactory?: () => Promise<RobotTrajectoryManager>;
  planningManagerFactory?: () => Promise<PlanningManager>;
}

export let appConfig: AppConfig;

if (!process.env.REACT_APP_MOCK && process.env.NODE_ENV !== 'test') {
  // { user: 'romi-dashboard' } signed with HS256 + secret 'rmf'
  // prettier-ignore
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicm9taS1kYXNoYm9hcmQiLCJpYXQiOjE1ODMyODYyMTV9.x9aNjcLujQPHchWEsbrRbvctmnGQtEzw-81X0aPIE-Y'

  appConfig = {
    transportFactory: () => SossTransport.connect('romi-dashboard', 'wss://localhost:50001', token),
    trajectoryManagerFactory: () => DefaultTrajectoryManager.create('ws://localhost:8006'),
    planningManagerFactory: () => DefaultPlanningManager.create('ws://localhost:8007'),
  };
} else {
  appConfig = {
    transportFactory: async () => new FakeTransport(),
    trajectoryManagerFactory: async () => new FakeTrajectoryManager(),
    planningManagerFactory: async () => new FakePlanningManager(),
  };
}

export default appConfig;
