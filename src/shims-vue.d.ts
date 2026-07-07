/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// PrimeVue ships this module without type declarations.
declare module 'primevue/toasteventbus' {
  import type { ToastMessageOptions } from 'primevue/toast'
  const ToastEventBus: {
    on(type: string, fn: (evt?: unknown) => void): void
    off(type: string, fn: (evt?: unknown) => void): void
    emit(type: 'add', evt: ToastMessageOptions): void
  }
  export default ToastEventBus
}
