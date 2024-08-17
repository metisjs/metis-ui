import * as React from 'react';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import useState from 'rc-util/lib/hooks/useState';
import type { TransitionStatus } from '../interface';
import { TransitionStep } from '../interface';
import useNextFrame from './useNextFrame';

const STEP_QUEUE: TransitionStep[] = [
  TransitionStep.Prepare,
  TransitionStep.Start,
  TransitionStep.Active,
];

/** Skip current step */
export const SkipStep = false as const;
/** Current step should be update in */
export const DoStep = true as const;

export function isActive(step: TransitionStep) {
  return step === TransitionStep.Active;
}

export default (
  status: TransitionStatus,
  callback: (step: TransitionStep) => Promise<void> | void | typeof SkipStep | typeof DoStep,
): [() => void, TransitionStep] => {
  const [step, setStep] = useState<TransitionStep>(TransitionStep.None);

  const [nextFrame, cancelNextFrame] = useNextFrame();

  function startQueue() {
    setStep(TransitionStep.Prepare, true);
  }

  useLayoutEffect(() => {
    if (step !== TransitionStep.None) {
      const index = STEP_QUEUE.indexOf(step);
      const nextStep = STEP_QUEUE[index + 1];

      const result = callback(step);

      if (result === SkipStep) {
        // Skip when no needed
        setStep(nextStep, true);
      } else if (nextStep) {
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

          if (result === DoStep) {
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
