import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Card, CardHeader, IconButton, Modal,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography
} from '@mui/material';
import { Create, RestaurantMenu } from '@mui/icons-material';
import CreateCategory from './CreateCategory';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  outline: "none",
  p: 4,
};

const Category = () => {
  const { restaurant } = useSelector(store => store)
  const [openCreateCategory, setOpenCreateCategory] = React.useState(false);
  const handleOpenCreateCategory = () => setOpenCreateCategory(true);
  const handleCloseCreateCategory = () => setOpenCreateCategory(false);


  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <Card
        className="mt-1"
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardHeader
          avatar={
            <RestaurantMenu sx={{ color: '#ea580c' }} />
          }
          title={
            <Typography variant="h6" sx={{ color: '#ea580c', fontWeight: '600' }}>
              Danh mục món ăn
            </Typography>
          }
          sx={{
            p: 3,
            borderBottom: '1px solid #f1f5f9',
            '& .MuiCardHeader-action': { mt: 0.6 },
          }}
          action={
            <IconButton
              onClick={handleOpenCreateCategory}
              sx={{
                color: '#ea580c',
                '&:hover': {
                  backgroundColor: '#fff7ed',
                }
              }}
            >
              <Create />
            </IconButton>
          }
        />
        <TableContainer sx={{ p: 2 }}>
          <Table aria-label="categories table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>
                  Tên danh mục
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurant.categories.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  className="cursor-pointer"
                  sx={{
                    '&:last-of-type td, &:last-of-type th': { border: 0 },
                    '&:hover': {
                      backgroundColor: '#fff7ed',
                    },
                  }}
                >
                  <TableCell sx={{ color: '#64748b' }}>
                    {item?.id}
                  </TableCell>
                  <TableCell sx={{ color: '#334155', fontWeight: 500 }}>
                    {item.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Modal
        open={openCreateCategory}
        onClose={handleCloseCreateCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #f1f5f9'
          }}
        >
          <CreateCategory handleClose={handleCloseCreateCategory} />
        </Box>
      </Modal>
    </div>
  )
}

export default Category