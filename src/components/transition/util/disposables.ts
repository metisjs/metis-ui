export default function disposables() {
  const _disposables: (() => void)[] = [];

  const api = {
    addEventListener<TEventName extends keyof WindowEventMap>(
      element: HTMLElement | Window | Document,
      name: TEventName,
      listener: (event: WindowEventMap[TEventName]) => any,
      options?: boolean | AddEventListenerOptions,
    ) {
      element.addEventListener(name, listener as any, options);
      return api.add(() => element.removeEventListener(name, listener as any, options));
    },

    requestAnimationFrame(...args: Parameters<typeof requestAnimationFrame>) {
      let raf = requestAnimationFrame(...args);
      return api.add(() => cancelAnimationFrame(raf));
    },

    nextFrame(...args: Parameters<typeof requestAnimationFrame>) {
      return api.requestAnimationFrame(() => {
        return api.requestAnimationFrame(...args);
      });
    },

    setTimeout(...args: Parameters<typeof setTimeout>) {
      const timer = setTimeout(...args);
      return api.add(() => clearTimeout(timer));
    },

    group(cb: (d: any) => void) {
      const d = disposables();
      cb(d);
      return this.add(() => d.dispose());
    },

    add(cb: () => void) {
      _disposables.push(cb);
      return () => {
        const idx = _disposables.indexOf(cb);
        if (idx >= 0) {
          for (let dispose of _disposables.splice(idx, 1)) {
            dispose();
          }
        }
      };
    },

    dispose() {
      for (let dispose of _disposables.splice(0)) {
        dispose();
      }
    },
  };

  return api;
}
