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
import plan from './data/plan.json';

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
        id: request.param.id,
        values: {
          success: false,
        },
        error: 'Radius, velocity and acceleration must be positive.',
      }
    }
    return {
      response: request.request,
      id: request.param.id,
      values: {
        success: true,
      },
      error: '',
    };
  }

  async startPlanning(request: StartPlanningRequest): Promise<StartPlanningResponse> {
    let resp_plan = plan;
    resp_plan.response = request.request;
    resp_plan.id = request.param.id;

    resp_plan.id = request.param.id;
    resp_plan.response = 'start_planning';
    return resp_plan;
  }
  // async startPlanning(request: StartPlanningRequest): Promise<StartPlanningResponse> {
  //   const event = await this._send(JSON.stringify(request));
  //   const resp = JSON.parse(event.data);
  //   this._checkResponse(request, resp);
  //   if (resp.values === null) {
  //     resp.values = [];
  //   }
  //   return resp as StartPlanningResponse;
  // }

  // async stepPlanner(request: StepRequest): Promise<StepResponse> {
  //   const event = await this._send(JSON.stringify(request));
  //   const resp = JSON.parse(event.data);
  //   this._checkResponse(request, resp);
  //   if (resp.values === null) {
  //     resp.values = [];
  //   }
  //   return resp as StepResponse;
  // }

  // async closePlanner(request: ClosePlannerRequest): Promise<ClosePlannerResponse> {
  //   const event = await this._send(JSON.stringify(request));
  //   const resp = JSON.parse(event.data);
  //   this._checkResponse(request, resp);
  //   return resp as ClosePlannerResponse;
  // }
}
