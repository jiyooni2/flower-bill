import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'create-bill'
  | 'get-bill'
  | 'delete-bill'
  | 'update-bill'
  | 'create-store'
  | 'search-store'
  | 'get-stores'
  | 'delete-store'
  | 'update-store'
  | 'create-user'
  | 'create-order-product'
  | 'get-order-product'
  | 'delete-order-product'
  | 'update-order-product'
  | 'create-product'
  | 'get-product'
  | 'get-products'
  | 'delete-product'
  | 'update-product'
  | 'create-category'
  | 'get-category'
  | 'delete-category'
  | 'update-category';

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
