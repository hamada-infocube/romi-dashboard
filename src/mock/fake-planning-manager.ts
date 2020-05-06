import {
  PlanningManager,
  PlannerConfigRequest,
  PlannerConfigResponse,
  StartPlanningRequest,
  StartPlanningResponse,
  StepRequest,
  StepResponse,
  ClosePlannerRequest,
  ClosePlannerResponse,
} from '../planning-manager';
import plans from './data/plans.json';

export default class FakePlanningManager implements PlanningManager {
  async configurePlanner(request: PlannerConfigRequest): Promise<PlannerConfigResponse> {
    if (request.param.profile_radius < 0 ||
        request.param.linear_velocity < 0 ||
        request.param.linear_acceleration < 0 ||
        request.param.angular_velocity < 0 ||
        request.param.angular_acceleration < 0 ||
        request.param.graph_file_path === '') {
      // maybe check for the existence of the file
      return {
        response: request.request,
        id: request.id,
        values: {
          success: false,
        },
        error: 'Radius, velocity and acceleration must be positive.',
      }
    }
    return {
      response: request.request,
      id: request.id,
      values: {
        success: true,
      },
      error: '',
    };
  }

  async startPlanning(request: StartPlanningRequest): Promise<StartPlanningResponse> {
    this.currentPlanStep = 0;
    const plan = plans[this.currentPlanStep];
    let plan_data = JSON.parse(JSON.stringify(plan)) as StartPlanningResponse;
    plan_data.response = request.request;
    plan_data.id = request.id;
    plan_data.error = '';
    return plan_data;
  }

  async stepPlanner(request: StepRequest): Promise<StepResponse> {
    this.currentPlanStep++;
    const plan = plans[this.currentPlanStep];

    let plan_data = JSON.parse(JSON.stringify(plan)) as StepResponse;
    plan_data.response = request.request;
    plan_data.id = request.id;
    plan_data.error = '';
    return plan_data;
  }

  async closePlanner(request: ClosePlannerRequest): Promise<ClosePlannerResponse> {
    return {
      response: request.request,
      id: request.id,
      values: {
        success: true,
      },
      error: '',
    }
  }

  private currentPlanStep = 0;
}
