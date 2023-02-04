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
import CollapseCategory from './CollapseCategory';

interface RenderTree {
  id: string;
  category: string;
  name: string;
  children: RenderTree[];
}

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: RenderTree[];
}

const CreateProductModal = ({ isOpen, setIsOpen, data }: IProps) => {

    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <Typography variant="h6" fontWeight={500} sx={{ marginBottom: '2%'}}>카테고리 데이터 생성</Typography>
        <TableContainer component={Paper} sx={{ height: '88%'}}>
          <Table aria-label="collapsible table">
            <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
              <TableRow>
                <TableCell />
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">대분류 이름</TableCell>
                <TableCell align="center">하위 분류 개수</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <CollapseCategory key={index} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    );
};

export default CreateProductModal;
