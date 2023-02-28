import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'create-bill'
  | 'get-bill'
  | 'delete-bill'
  | 'update-bill'
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
  | 'login';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
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
  },
});
