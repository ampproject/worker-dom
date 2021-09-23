import React from 'react';
import { render } from 'react-dom';
import { CandidateTable } from './candidateTable.jsx';
import { CandidateMap } from './candidateMap.jsx';

const TOTAL_VOTES = 226628056;
const CANDIDATE_DATA = [
  {
    victor: true,
    name: 'Elaine Barrish',
    party: 'Republican',
    votes: 123818000,
  },
  {
    victor: false,
    name: 'Steven Armstrong',
    party: 'Democrat',
    votes: 102810012,
  },
  { victor: false, name: 'Benjamin Arthur', party: 'Independent', votes: 42 },
];
const REGION_DATA = [
  { total: 1000, candidates: [100, 900, 0] },
  { total: 101810112, candidates: [101810012, 100, 0] },
  { total: 42, candidates: [0, 0, 42] },
  { total: 142, candidates: [0, 100, 42] },
];

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      focusedRegion: null,
    };

    this.handleRegionFocus = this.handleRegionFocus.bind(this);
  }

  handleRegionFocus(regionToFocus) {
    this.setState({
      focusedRegion: regionToFocus,
    });
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    return [
      <CandidateTable key="table" votes={TOTAL_VOTES} totalData={CANDIDATE_DATA} regionData={REGION_DATA} focusedRegion={this.state.focusedRegion} />,
      <h1 key="map">Precinct Map</h1>,
      <CandidateMap key="map-display" regionData={REGION_DATA} totalData={CANDIDATE_DATA} focusRegion={this.handleRegionFocus} />,
    ];
  }
}

const div = document.createElement('div');
document.body.appendChild(div);
render(<App />, div);
