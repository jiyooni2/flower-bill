import { Bill } from 'main/bill/entities/bill.entity';
import { useState } from 'react';
import { BillService } from './../../main/bill/bill.service';
import { AppDataSource } from './../../main/main';
import { ipcRenderer } from 'electron';

const BillPage = () => {
  const [orderProducts, setOrderProducts] = useState([]);

  const onClick = () => {
    console.log('AAA');
    window.electron.ipcRenderer.sendMessage('create-bill', ['data']);
  };

  return (
    <div>
      <button onClick={onClick}>afdsa</button>
    </div>
  );
};

export default BillPage;
