import { tokenState, businessState } from 'renderer/recoil/states';
import { useRecoilValue } from 'recoil';
import { Channels } from 'main/preload';

const useIpc = async (api: Channels, args: any) => {
  const token = useRecoilValue(tokenState);
  const business = useRecoilValue(businessState);

  window.electron.ipcRenderer.sendMessage(api, {
    token,
    businessId: business.id,
    ...args,
  });
};

export default useIpc;
