/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import objstr from 'obj-str';

import styles from './candidateMap.css';

class CandidateZone extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      fill: 'red',
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    this.setState({
      fill: 'black',
    });
    this.props.focusRegion(this.props.index);
  }

  handleMouseLeave() {
    this.setState({
      fill: 'red',
    });
    this.props.focusRegion(null);
  }

  render() {
    return <rect x={this.props.x} y={this.props.y} width="180" height="180" fill={this.state.fill} stroke="black" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />;
  }
}

export class CandidateMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false,
      focusedRegion: null,
    };

    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.focusRegion = this.focusRegion.bind(this);
  }

  handleMouseLeave() {
    this.focusRegion(null);
  }

  focusRegion(region) {
    this.setState({
      showTooltip: region !== null,
      focusedRegion: region !== null ? region : null,
    });

    this.props.focusRegion(region);
  }

  render() {
    const focusedRegionData = this.state.focusedRegion !== null && this.props.regionData[this.state.focusedRegion].candidates;
    const winner = focusedRegionData && this.props.totalData[focusedRegionData.indexOf(Math.max(...focusedRegionData))];
    return (
      <div className={styles.wrapper}>
        <svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" onMouseLeave={this.handleMouseLeave}>
          <CandidateZone x={0} y={0} index={0} focusRegion={this.focusRegion} />
          <CandidateZone x={180} y={0} index={1} focusRegion={this.focusRegion} />
          <CandidateZone x={0} y={180} index={2} focusRegion={this.focusRegion} />
          <CandidateZone x={180} y={180} index={3} focusRegion={this.focusRegion} />
        </svg>
        <p
          className={objstr({
            [styles.tooltip]: true,
            [styles.showTooltip]: this.state.showTooltip,
          })}
        >
          Region winner {!!winner && winner.name}
        </p>
      </div>
    );
  }
}
