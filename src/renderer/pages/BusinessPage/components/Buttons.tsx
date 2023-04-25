import { Button } from "@mui/material";
import styles from '../BusinessPage.module.scss';
import { useRecoilState, useRecoilValue } from "recoil";
import { businessesState, businessState, tokenState } from "renderer/recoil/states";
import { Inputs } from "../types";
import { DeleteBusinessOutput } from "main/business/dtos/delete-business.dto";
import { Business } from "main/business/entities/business.entity";
import { GetBusinessesOutput } from "main/business/dtos/get-businesses.dto";
import { UpdateBusinessInput, UpdateBusinessOutPut } from "main/business/dtos/update-busiess.dto";
import InfoModal from "renderer/components/InfoModal/InfoModal";
import { useState } from "react";


type IProps = {
  inputs: Inputs;
}

const Buttons = ({ inputs} : IProps) => {
  const token = useRecoilValue(tokenState)
  const [business, setBusiness] = useRecoilState(businessState);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const deleteDataHandler = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
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
              }
            );
          }
          if (error) {
            console.log(error);
          }
        }
      );
    }
  };

  const updateDataHandler = () => {
      const number = parseInt(inputs.businessNumber);

      const newData: UpdateBusinessInput = {
        businessNumber: number,
        address: inputs.address,
        name: inputs.name,
        businessOwnerName: inputs.businessOwnerName,
        token,
        businessId: business.id,
      };

      window.electron.ipcRenderer.sendMessage('update-business', {
        ...newData,
      });

      window.electron.ipcRenderer.on(
        'update-business',
        ({ ok, error }: UpdateBusinessOutPut) => {
          if (ok) {
            window.electron.ipcRenderer.sendMessage('get-businesses', {
              token,
              businessId: business.id,
            });
            window.electron.ipcRenderer.on(
              'get-businesses',
              (args: GetBusinessesOutput) => {
                setBusinesses(args.businesses as Business[]);
                setIsOpen(true);
              }
            );
          }
          if (error) {
            console.log(error);
          }
        }
      );
  };

  return (
    <>
      <InfoModal isOpen={isOpen} setIsOpen={setIsOpen} text="사업자 정보를 수정하였습니다." />
      <div className={styles.list}>
        <div className={styles.buttonList}>
          <Button
            variant="contained"
            size="small"
            onClick={updateDataHandler}
          >
            수정하기
          </Button>
        </div>
        <hr />
        <span
          style={{
            fontSize: '13px',
            color: 'darkgray',
            cursor: 'pointer',
          }}
          onClick={() => deleteDataHandler()}
        >
          사업자 삭제하기
        </span>
      </div>
    </>
  )
};

export default Buttons;
