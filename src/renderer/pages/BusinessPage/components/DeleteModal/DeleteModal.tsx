import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DeleteBusinessOutput } from 'main/business/dtos/delete-business.dto';
import { GetBusinessesOutput } from 'main/business/dtos/get-businesses.dto';
import { Business } from 'main/business/entities/business.entity';
import { useRecoilState, useRecoilValue } from 'recoil';
import { businessState, businessesState, tokenState } from 'renderer/recoil/states';

type IProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlert: React.Dispatch<
    React.SetStateAction<{
      success: string;
      error: string;
    }>
  >;
};

const DeleteModal = ({ isOpen, setIsOpen, setAlert }: IProps) => {
  const token = useRecoilValue(tokenState);
  const [business, setBusiness] = useRecoilState(businessState);
  const [businesses, setBusinesses] = useRecoilState(businessesState);

  const deleteHandler = () => {
    window.electron.ipcRenderer.sendMessage('delete-business', {
      token,
      businessId: business.id,
    });

    window.electron.ipcRenderer.on(
      'delete-business',
      ({ ok, error }: DeleteBusinessOutput) => {
        if (ok) {
          window.electron.ipcRenderer.sendMessage('get-businesses', {
            token,
            businessId: business.id,
          });
          window.electron.ipcRenderer.on(
            'get-businesses',
            (args: GetBusinessesOutput) => {
              setBusinesses(args.businesses as Business[]);
              setBusiness(businesses[0]);
              setAlert({ success: '사업자가 삭제되었습니다.', error: '' });
            }
          );
        }
        if (error) {
          console.log(error);
          setIsOpen(false);
          setAlert({ success: '', error: `네트워크 ${error}` });
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>삭제하시겠습니까?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          해당 사업자와 관련된 모든 데이터 및 개인정보가 삭제되며 복구가 불가능합니다.
          <br />
          정말 삭제하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>취소</Button>
        <Button onClick={deleteHandler}>삭제하기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
