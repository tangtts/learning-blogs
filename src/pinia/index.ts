import { App } from "vue";

export const PiniaSymbol = Symbol();

export function createPinia() {
  const pina = {
    _s: new Map(),
    install: function (app: App) {
      app.provide(PiniaSymbol, pina);
    },
  };

  return pina;
}
