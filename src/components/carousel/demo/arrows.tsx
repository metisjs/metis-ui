import React from 'react';
import { Carousel } from 'metis-ui';

const contentCls = 'h-40 bg-indigo-800 text-center text-white text-lg leading-[160px]';

const App: React.FC = () => (
  <>
    <Carousel showArrow>
      <div className={contentCls}>1</div>
      <div className={contentCls}>2</div>
      <div className={contentCls}>3</div>
      <div className={contentCls}>4</div>
    </Carousel>
    <br />
    <Carousel showArrow indicatorPosition="left">
      <div className={contentCls}>1</div>
      <div className={contentCls}>2</div>
      <div className={contentCls}>3</div>
      <div className={contentCls}>4</div>
    </Carousel>
  </>
);

export default App;
