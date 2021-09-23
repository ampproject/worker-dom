import { h, Component } from 'preact';
import { useState } from 'preact/hooks';
import objstr from 'obj-str';

import styles from './candidateMap.css';

function CandidateZone({ index, focusRegion, x, y }) {
  const [fill, setFill] = useState('red');

  function handleMouseEnter() {
    setFill('black');
    focusRegion(index);
  }

  function handleMouseLeave() {
    setFill('red');
    focusRegion(null);
  }

  return <rect x={x} y={y} width="180" height="180" fill={fill} stroke="black" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />;
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

  const focusedRegionData = focusedRegion !== null && regionData[focusedRegion].candidates;
  const winner = focusedRegionData && totalData[focusedRegionData.indexOf(Math.max(...focusedRegionData))];

  return (
    <div className={styles.wrapper}>
      <svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" onMouseLeave={handleMouseLeave}>
        <CandidateZone x={0} y={0} index={0} focusRegion={localFocusRegion} />
        <CandidateZone x={180} y={0} index={1} focusRegion={localFocusRegion} />
        <CandidateZone x={0} y={180} index={2} focusRegion={localFocusRegion} />
        <CandidateZone x={180} y={180} index={3} focusRegion={localFocusRegion} />
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
