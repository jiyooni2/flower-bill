import { Button } from "@mui/material";
import BusinessInputs from "./BusinessInputs";
import styles from '../BusinessPage.module.scss';
import { useRecoilState, useRecoilValue } from "recoil";
import { businessesState, businessState, tokenState } from "renderer/recoil/states";
import { useEffect, useState } from "react";
import { Inputs } from "../types";
import { DeleteBusinessOutput } from "main/business/dtos/delete-business.dto";
import { Business } from "main/business/entities/business.entity";
import { GetBusinessesOutput } from "main/business/dtos/get-businesses.dto";
import { UpdateBusinessInput, UpdateBusinessOutPut } from "main/business/dtos/update-busiess.dto";

const Buttons = () => {
  const token = useRecoilValue(tokenState)
  const [business, setBusiness] = useRecoilState(businessState);
  const [businesses, setBusinesses] = useRecoilState(businessesState);
  const [inputs, setInputs] = useState<Inputs>({
    businessNumber: '',
    name: '',
    businessOwnerName: '',
    address: '',
  })

  useEffect(() => {
    setInputs({ businessNumber: business.businessNumber.toString(), name: business.name, businessOwnerName: business.businessOwnerName, address: business.address })
  }, [business]);

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
    if (window.confirm('정말 수정하시겠습니까?')) {
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

  return (
    <div className={styles.list}>
      <BusinessInputs inputs={inputs} setInputs={setInputs} />
      <div className={styles.buttonList}>
        <Button
          variant="contained"
          size="small"
          onClick={updateDataHandler}
        >
          수정
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
  )
};

export default Buttons;
