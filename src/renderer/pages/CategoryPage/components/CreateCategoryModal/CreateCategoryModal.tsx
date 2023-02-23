import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import Modal from 'renderer/components/Modal/Modal';
import { Category } from 'renderer/types';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Category;
}

const CreateCategoryModal = ({ isOpen, setIsOpen, data }: IProps) => {

    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>

      </Modal>
    );
};

export default CreateCategoryModal;
