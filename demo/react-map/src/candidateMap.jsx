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

import React, { useState } from "react";
import objstr from "obj-str";

import styles from "./candidateMap.css";

function CandidateZone({ index, focusRegion, x, y }) {
  const [fill, setFill] = useState("red");

  function handleMouseEnter() {
    setFill("black");
    focusRegion(index);
  }

  function handleMouseLeave() {
    setFill("red");
    focusRegion(null);
  }

  return (
    <rect
      x={x}
      y={y}
      width="180"
      height="180"
      fill={fill}
      stroke="black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export function CandidateMap({ focusRegion, regionData, totalData }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [focusedRegion, setFocusedRegion] = useState(null);

  function handleMouseLeave() {
    localFocusRegion(null);
  }

  function localFocusRegion(region) {
    setShowTooltip(region !== null);
    setFocusedRegion(region !== null ? region : null);

    focusRegion(region);
  }

  const focusedRegionData =
    focusedRegion !== null && regionData[focusedRegion].candidates;
  const winner =
    focusedRegionData &&
    totalData[focusedRegionData.indexOf(Math.max(...focusedRegionData))];

  return (
    <div className={styles.wrapper}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="360"
        height="360"
        onMouseLeave={handleMouseLeave}
      >
        <CandidateZone x={0} y={0} index={0} focusRegion={localFocusRegion} />
        <CandidateZone x={180} y={0} index={1} focusRegion={localFocusRegion} />
        <CandidateZone x={0} y={180} index={2} focusRegion={localFocusRegion} />
        <CandidateZone
          x={180}
          y={180}
          index={3}
          focusRegion={localFocusRegion}
        />
      </svg>
      <p
        className={objstr({
          [styles.tooltip]: true,
          [styles.showTooltip]: showTooltip,
        })}
      >
        Region winner {!!winner && winner.name}
      </p>
    </div>
  );
}
