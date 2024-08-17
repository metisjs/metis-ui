import React from 'react';
import { Scrollbar } from 'metis-ui';

export const Lorem = () => {
  const lorem = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
  nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
  erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
  et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
  Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
  sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
  et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
  accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
  no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

  return (
    <>
      <p>{lorem}</p>
      <p>{lorem}</p>
      <p>{lorem}</p>
      <p>{lorem}</p>
      <p>{lorem}</p>
      <p>{lorem}</p>
      <p>{lorem}</p>
      <p>{lorem}</p>
    </>
  );
};

const App: React.FC = () => (
  <Scrollbar className="h-[300px] max-w-[600px]">
    <Lorem />
  </Scrollbar>
);

export default App;
