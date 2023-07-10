import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'create-bill'
  | 'get-bill'
  | 'delete-bill'
  | 'update-bill'
  | 'get-bills'
  | 'get-bill-by-store'
  | 'create-store'
  | 'search-store'
  | 'get-stores'
  | 'get-store'
  | 'delete-store'
  | 'update-store'
  | 'create-order-product'
  | 'get-order-product'
  | 'delete-order-product'
  | 'update-order-product'
  | 'create-product'
  | 'get-product-by-category'
  | 'get-product'
  | 'get-products'
  | 'delete-product'
  | 'update-product'
  | 'search-product'
  | 'create-category'
  | 'get-category'
  | 'get-categories'
  | 'delete-category'
  | 'update-category'
  | 'create-owner'
  | 'update-owner'
  | 'create-business'
  | 'update-business'
  | 'delete-business'
  | 'get-business'
  | 'get-businesses'
  | 'check-password'
  | 'login'
  | 'change-password';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      console.log(`call ${channel} event`);
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      // for (const eventName of ipcRenderer.eventNames()) {
      //   console.log(eventName, ipcRenderer.listenerCount(eventName));
      // }

      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    sendSyncMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.sendSync(channel, args);
    },
    isListenerAttached(channel: Channels) {
      const eventListeners = ipcRenderer
        .eventNames()
        .filter((name) => name === channel);
      return eventListeners.length >= 1;
    },
  },
});
