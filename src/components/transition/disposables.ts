import { microTask } from './utils';

class Disposables {
  private disposables: (() => void)[] = [];

  constructor() {
    this.dispose = this.dispose.bind(this);
  }

  addEventListener<TEventName extends keyof WindowEventMap>(
    element: HTMLElement | Window | Document,
    name: TEventName,
    listener: (event: WindowEventMap[TEventName]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    element.addEventListener(name, listener as any, options);
    return this.add(() => element.removeEventListener(name, listener as any, options));
  }

  requestAnimationFrame(...args: Parameters<typeof requestAnimationFrame>) {
    const raf = requestAnimationFrame(...args);
    return this.add(() => cancelAnimationFrame(raf));
  }

  nextFrame(...args: Parameters<typeof requestAnimationFrame>) {
    return this.requestAnimationFrame(() => {
      return this.requestAnimationFrame(...args);
    });
  }

  setTimeout(...args: Parameters<typeof setTimeout>) {
    const timer = setTimeout(...args);
    return this.add(() => clearTimeout(timer));
  }

  microTask(...args: Parameters<typeof microTask>) {
    let task = { current: true };
    microTask(() => {
      if (task.current) {
        args[0]();
      }
    });
    return this.add(() => {
      task.current = false;
    });
  }

  group(cb: (d: Disposables) => void) {
    const d = new Disposables();
    cb(d);
    return this.add(() => d.dispose());
  }

  add(cb: () => void) {
    this.disposables.push(cb);
    return () => {
      const idx = this.disposables.indexOf(cb);
      if (idx >= 0) {
        for (const dispose of this.disposables.splice(idx, 1)) {
          dispose();
        }
      }
    };
  }

  dispose() {
    for (const _dispose of this.disposables.splice(0)) {
      _dispose();
    }
  }
}

export default Disposables;
