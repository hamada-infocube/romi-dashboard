import { makeStyles } from '@material-ui/core';
import React from 'react';
import {
  Plan,
  PlannerConfigRequest,
  PlannerConfigResponse,
  StartPlanningRequest,
  StartPlanningResponse,
  StepRequest,
  StepResponse,
  ClosePlannerRequest,
  ClosePlannerResponse,
  PlanningManager,
} from '../../planning-manager';

const useStyles = makeStyles(() => ({
  map: {
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
  },
}));
