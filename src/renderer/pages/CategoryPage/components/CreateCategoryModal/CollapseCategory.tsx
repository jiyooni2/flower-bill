import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';

interface RenderTree {
  id: string;
  category: string;
  name: string;
  children: RenderTree[];
}

function CollapseCategory(props: { row: RenderTree }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell sx={{ padding: 0 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ margin: '30% 0 0 30%' }}
          >
            {row.children.length !== 0 ? (
              open ? (
                <KeyboardArrowDown />
              ) : (
                <KeyboardArrowRight />
              )
            ) : (
              <KeyboardArrowRight />
            )}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.id}</TableCell>
        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">{row.children.length}</TableCell>
      </TableRow>
      {row.children.length !== 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
            <Collapse in={open} timeout="auto">
              <Box>
                <Table size="small" aria-label="purchases">
                  <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                    <TableRow>
                      <TableCell sx={{ width: '1px' }} />
                      <TableCell align="center">ID</TableCell>
                      <TableCell align="center">중분류 이름</TableCell>
                      <TableCell align="center">소분류 이름</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.children.map((subs: RenderTree) =>
                      subs.children.map((group) => (
                        <TableRow key={subs.id}>
                          <TableCell sx={{ width: '12%' }} />
                          <TableCell align="center" sx={{ width: '13%' }}>
                            {group.id}
                          </TableCell>
                          <TableCell align="center">{subs.name}</TableCell>
                          {group.name && <TableCell align="center">{group.name}</TableCell>}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default CollapseCategory;
