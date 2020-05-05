import React from 'react';

export interface PlanningPanelViewProps extends React.PropsWithChildren<{}> {
  id: number;
}

export default function PlanningPanelView(props: PlanningPanelViewProps): React.ReactElement {
  return <React.Fragment>{props.children}</React.Fragment>
}
