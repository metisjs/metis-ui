import { Slider } from 'metis-ui';
import React from 'react';

const App: React.FC = () => <Slider range={{ draggableTrack: true }} defaultValue={[20, 50]} />;

export default App;
