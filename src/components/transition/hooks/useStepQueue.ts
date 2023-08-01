import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import useState from 'rc-util/lib/hooks/useState';
import * as React from 'react';
import { TransitionStatus, TransitionStep } from '../interface';
import useNextFrame from './useNextFrame';

const STEP_QUEUE: TransitionStep[] = [
  TransitionStep.Prepare,
  TransitionStep.Start,
  TransitionStep.Active,
  TransitionStep.End,
];

export function isActive(step: TransitionStep) {
  return step === TransitionStep.Active || step === TransitionStep.End;
}

export default (
  status: TransitionStatus,
  callback: (step: TransitionStep) => Promise<void> | void,
): [() => void, TransitionStep] => {
  const [step, setStep] = useState<TransitionStep>();

  const [nextFrame, cancelNextFrame] = useNextFrame();

  function startQueue() {
    setStep(TransitionStep.Prepare, true);
  }

  useLayoutEffect(() => {
    if (step !== TransitionStep.End) {
      const index = STEP_QUEUE.indexOf(step);
      const nextStep = STEP_QUEUE[index + 1];

      const result = callback(step);

      if (nextStep) {
        // Do as frame for step update
        nextFrame((info) => {
          function doNext() {
            // Skip since current queue is ood
            if (info.isCanceled()) {
              console.log('canceled next frame');
              return;
            }

            setStep(nextStep, true);
          }

          if (result === true) {
            doNext();
          } else {
            // Only promise should be async
            Promise.resolve(result).then(doNext);
          }
        });
      }
    }
  }, [status, step]);

  React.useEffect(
    () => () => {
      cancelNextFrame();
    },
    [],
  );

  return [startQueue, step];
};
