import { Knot } from './util/cublic-spline';

// RawVelocity received from server is in this format (x, y, theta)
export type RawVelocity = [number, number, number];

// RawPose2D received from server is in this format (x, y, theta)
export type RawPose2D = [number, number, number];

interface RawKnot {
  t: number; // milliseconds
  v: RawVelocity;
  x: RawPose2D;
}

export interface Plan {
  id: number;
  shape: string;
  dimensions: number;
  segments: RawKnot[];
}

export interface PlannerConfigRequest {
  request: 'planner_config';
  param: {
    id: number;
    profile_radius: number;
    linear_velocity: number;
    linear_acceleration: number;
    angular_velocity: number;
    angular_acceleration: number;
    graph_file_path: string;
  };
}

export interface PlannerConfigResponse {
  response: 'planner_config';
  id: number;
  values: {
    success: boolean;
  };
  error: string;
}

export interface StartPlanningRequest {
  request: 'start_planning';
  param: {
    id: string;
    start: {
      x: number;
      y: number;
      yaw: number;
    };
    goal: number;
  };
}

export interface StartPlanningResponse {
  response: 'start_planning';
  id: string;
  values: Plan[];
  error: string;
}

export interface StepRequest {
  request: 'step';
  param: {
    id: string;
  };
}

export interface StepResponse {
  response: 'step';
  id: string;
  values: Plan[];
  error: string;
}

export interface ClosePlannerRequest {
  request: 'close_planner';
  param: {
    id: string;
  };
}

export interface ClosePlannerResponse {
  response: 'close_planner';
  id: string;
  values: {
    success: boolean;
  };
  error: string;
}

export interface PlanningManager {
 configurePlanner(request: PlannerConfigRequest): Promise<PlannerConfigResponse>;
 startPlanning(request: StartPlanningRequest): Promise<StartPlanningResponse>;
 stepPlanner(request: StepRequest): Promise<StepResponse>;
 closePlanner(request: ClosePlannerRequest): Promise<ClosePlannerResponse>;
}

interface Request {
  request: string;
  param: unknown;
}

interface Response {
  response: string;
  id: string;
  values: unknown;
  error: string;
}

export class DefaultPlanningManager {
  static async create(url: string): Promise<DefaultPlanningManager> {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => {
      ws.addEventListener('open', function listener() {
        ws.removeEventListener('open', listener);
        res();
      });

      ws.addEventListener('error', function listener(e) {
        ws.removeEventListener('error', listener);
        rej(e);
      });
    });
    return new DefaultPlanningManager(ws);
  }

  async configurePlanner(request: PlannerConfigRequest): Promise<PlannerConfigResponse> {
    const event = await this._send(JSON.stringify(request));
    const resp = JSON.parse(event.data);
    this._checkResponse(request, resp);
    return resp as PlannerConfigResponse;
  }

  async startPlanning(request: StartPlanningRequest): Promise<StartPlanningResponse> {
    const event = await this._send(JSON.stringify(request));
    const resp = JSON.parse(event.data);
    this._checkResponse(request, resp);
    if (resp.values === null) {
      resp.values = [];
    }
    return resp as StartPlanningResponse;
  }

  async stepPlanner(request: StepRequest): Promise<StepResponse> {
    const event = await this._send(JSON.stringify(request));
    const resp = JSON.parse(event.data);
    this._checkResponse(request, resp);
    if (resp.values === null) {
      resp.values = [];
    }
    return resp as StepResponse;
  }

  async closePlanner(request: ClosePlannerRequest): Promise<ClosePlannerResponse> {
    const event = await this._send(JSON.stringify(request));
    const resp = JSON.parse(event.data);
    this._checkResponse(request, resp);
    return resp as ClosePlannerResponse;
  }

  private _ongoingRequest: Promise<MessageEvent> | null = null;

  private constructor(private _webSocket: WebSocket) {}

  private _listenOnce<K extends keyof WebSocketEventMap>(
    event: K,
    listener: (e: WebSocketEventMap[K]) => unknown,
  ): void {
    this._webSocket.addEventListener(event, e => {
      this._webSocket.removeEventListener(event, listener);
      listener(e);
    });
  }

  /**
   * Sends a message and waits for response from the server.
   *
   * @remarks This is an alternative to the old implementation of creating a promise, storing the
   * resolver and processing each message in an event loop. Advantage of this is that each message
   * processing logic can be self-contained without a need for a switch or if elses.
   */
  private async _send(payload: WebSocketSendParam0T): Promise<MessageEvent> {
    // response should come in the order that requests are sent, this should allow multiple messages
    // in-flight while processing the responses in the order they are sent.
    this._webSocket.send(payload);
    // waits for the earlier response to be processed.
    if (this._ongoingRequest) {
      await this._ongoingRequest;
    }

    this._ongoingRequest = new Promise(res => {
      this._listenOnce('message', e => {
        this._ongoingRequest = null;
        res(e);
      });
    });
    return this._ongoingRequest;
  }

  private _checkResponse(request: Request, resp: Response): void {
    if (request.request !== resp.response) {
      console.warn('received response for wrong request');
      throw new Error('received response for wrong request');
    }
  }
}

export function rawKnotsToKnots(rawKnots: RawKnot[]): Knot[] {
  const knots: Knot[] = [];

  for (const rawKnot of rawKnots) {
    const [poseX, poseY, poseTheta] = rawKnot.x;
    const [velocityX, velocityY, velocityTheta] = rawKnot.v;
    knots.push({
      pose: {
        x: poseX,
        y: poseY,
        theta: poseTheta,
      },
      velocity: {
        x: velocityX,
        y: velocityY,
        theta: velocityTheta,
      },
      time: rawKnot.t,
    });
  }

  return knots;
}

type WebSocketSendParam0T = Parameters<WebSocket['send']>[0];
