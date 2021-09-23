import { Component, h, render } from 'preact';
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

class App extends Component {
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

  render(props, state) {
    return (
      <div>
        <CandidateTable votes={TOTAL_VOTES} totalData={CANDIDATE_DATA} regionData={REGION_DATA} focusedRegion={state.focusedRegion} />
        <h1>Precinct Map</h1>
        <CandidateMap regionData={REGION_DATA} totalData={CANDIDATE_DATA} focusRegion={this.handleRegionFocus} />
      </div>
    );
  }
}

render(<App />, document.body);
