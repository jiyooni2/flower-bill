import { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from 'renderer/components/Modal/Modal';
import CreateStoreForm from './components/CreateStoreForm/CreateSellerForm';

const StorePage = () => {
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState<boolean>(false);
  const [isStoreListOpen, setIsStoreListOpen] = useState<boolean>(false);

  return (
  <div>
      {isCreateStoreOpen && (
        <Modal isOpen={isCreateStoreOpen} setIsOpen={setIsCreateStoreOpen}>
          <CreateStoreForm />
        </Modal>
      )}
      {isStoreListOpen && (
        <Modal isOpen={isStoreListOpen} setIsOpen={setIsStoreListOpen}>
          하이
        </Modal>
      )}
      <Button variant="contained" onClick={() => setIsCreateStoreOpen(true)}>
        스토어 등록
      </Button>
      <Button variant="contained" onClick={() => setIsStoreListOpen(true)}>
        스토어 관리
      </Button>
    </div>
  );
};

export default StorePage;
