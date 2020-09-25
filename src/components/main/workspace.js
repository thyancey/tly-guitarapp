import React, { Component } from 'react';

import PanelGroup from './panel-group';
import Maps from 'src/utils/maps';

require('./style.less');

class Workspace extends Component {
  render() {
    const layoutId = this.props.layout;
    const layout = Maps.MAP_LAYOUTS[layoutId];

    return(
      <div id="workspace" className={`layout-${this.props.layout}`}>
        { layout.groups.map((groupId, i) => (
          <PanelGroup key={i} groupId={groupId} panelPositions={this.props.panelPositions[groupId]} />
        ))}
      </div>
    );
  }
}

export default Workspace;