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

import styles from './candidateTable.css';

const numberFormatter = new Intl.NumberFormat('en-US');
const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });
const shortParty = party => {
  switch (party) {
    case 'Republican':
      return 'Rep.';
    case 'Democrat':
      return 'Dem.';
    case 'Independent':
      return 'Ind.';
    default:
      return '-';
  }
};

const Candidate = ({ victor, name, party, votes, percent }) => {
  return (
    <tr>
      <td>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          className={objstr({
            [styles.victor]: true,
            [styles.displayVictor]: victor,
          })}
        >
          <path d="M20.285 2L9 13.567 3.714 8.556 0 12.272 9 21 24 5.715z" />
        </svg>
        <span className={styles.name}>{name}</span>
      </td>
      <td>
        <span className={styles.party}>{party}</span>
        <span
          className={objstr({
            [styles.party]: true,
            [styles.shortParty]: true,
          })}
        >
          {shortParty(party)}
        </span>
      </td>
      <td>
        <span className={styles.votes}>{numberFormatter.format(votes)}</span>
      </td>
      <td>
        <span className={styles.percent}>{percentFormatter.format(percent)}</span>
      </td>
    </tr>
  );
};

export const CandidateTable = ({ victor, totalData, regionData, votes, focusedRegion }) => {
  const focusedRegionData = focusedRegion !== null && regionData[focusedRegion].candidates;
  const winnerIndex = focusedRegionData && focusedRegionData.indexOf(Math.max(...focusedRegionData));
  return (
    <table>
      <thead>
        <tr>
          <th className={styles.name}>Candidate</th>
          <th className={styles.party}>Party</th>
          <th className={styles.votes}>Votes</th>
          <th className={styles.percent}>Pct.</th>
        </tr>
      </thead>
      <tbody>
        {totalData.map((candidate, index) => {
          const isVictor = focusedRegion !== null ? winnerIndex === index : candidate.victor;
          return <Candidate victor={isVictor} key={candidate.name} name={candidate.name} party={candidate.party} votes={candidate.votes} percent={candidate.votes / votes} />;
        })}
      </tbody>
    </table>
  );
};
