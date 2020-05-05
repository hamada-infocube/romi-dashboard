import { Button, ButtonGroup, makeStyles, Slide } from '@material-ui/core';
import { Close as CloseIcon, KeyboardBackspace as BackIcon } from '@material-ui/icons';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';
import { PlanningPanelViewProps } from './planning-panel-view';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexFlow: 'column',
  },

  viewContainer: {
    height: '100%',
    overflowX: 'hidden',
    position: 'relative',
  },

  viewContainer2: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

export interface PlanningPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  view: number;
  transport?: Readonly<RomiCore.Transport>;
  classes?: {
    navigation?: string;
    backButton?: string,
    closeButton?: string,
  };
  onBack?: (current: number) => void;
  onClose?: () => void;
}

export const PlanningPanel = React.forwardRef(function(
  props: PlanningPanelProps,
  ref: React.Ref<HTMLDivElement>,
): React.ReactElement {
  const {view, classes: innerClasses, onBack, onClose, ...otherProps } = props;
  const classes = useStyles();

  const className = (() => 
    `${otherProps.className || ''} ${classes.container} ${props.className}`)();

  function handlebackClick() {
    props.onBack && props.onBack(props.view);
  }

  function handleCloseClick() {
    props.onClose && props.onClose();
  }

  return (
    <div {...otherProps} ref={ref} className={className}>
      <ButtonGroup className={props.classes?.navigation} variant="text" fullWidth>
        <Button className={props.classes?.backButton} size="large" onClick={handlebackClick}>
          <BackIcon />
        </Button>
        <Button className={props.classes?.closeButton} size="large" onClick={handleCloseClick}>
          <CloseIcon />
        </Button>
      </ButtonGroup>
      <div className={classes.viewContainer}>
      </div>
    </div>
  );

});

export default PlanningPanel;
