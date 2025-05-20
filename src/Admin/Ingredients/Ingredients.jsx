import {
  AddCircleOutline,
  Category as CategoryIcon,
  Inventory2 as InventoryIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateIngredientForm from "./CreateIngredientForm";
import CreateIngredientCategoryForm from "./CreateIngredientCategory";
import { updateStockOfIngredient } from "../../state/Admin/Ingredients/Action";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  backdropFilter: "blur(10px)",
  p: 4,
};

const Ingredients = () => {
  const dispatch = useDispatch();
  const { ingredients } = useSelector((store) => store);
  const jwt = sessionStorage.getItem("jwt");

  const [openIngredientModal, setOpenIngredientModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const handleUpdateStock = (id) => {
    dispatch(updateStockOfIngredient({ id, jwt }));
  };

  return (
    <Box sx={{ p: 4 }} className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header Section */}
      <Box className="mb-8">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#ea580c',
            mb: 2
          }}
        >
          Quản lý nguyên liệu & phân loại
        </Typography>
        <Divider sx={{ borderColor: '#fed7aa' }} />
      </Box>

      <Grid container spacing={4}>
        {/* Danh sách nguyên liệu */}
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid #fed7aa',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <InventoryIcon sx={{ color: '#ea580c', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#ea580c' }}>
                    Danh sách nguyên liệu
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  onClick={() => setOpenIngredientModal(true)}
                  sx={{
                    backgroundColor: '#ea580c',
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#c2410c'
                    }
                  }}
                >
                  Thêm nguyên liệu
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  boxShadow: 'none',
                  border: '1px solid #fed7aa',
                  overflow: 'hidden'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fff7ed' }}>
                      <TableCell width="10%" sx={{ fontWeight: 600, color: '#ea580c' }}>ID</TableCell>
                      <TableCell width="30%" sx={{ fontWeight: 600, color: '#ea580c' }}>Tên</TableCell>
                      <TableCell width="25%" sx={{ fontWeight: 600, color: '#ea580c' }}>Loại</TableCell>
                      <TableCell width="20%" sx={{ fontWeight: 600, color: '#ea580c' }}>Giá</TableCell>
                      <TableCell width="15%" sx={{ fontWeight: 600, color: '#ea580c' }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ingredients?.ingredients?.map((item) => (
                      <TableRow
                        key={item?.id}
                        hover
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': {
                            backgroundColor: '#fff7ed'
                          }
                        }}
                      >
                        <TableCell sx={{ color: '#57534e' }}>{item?.id}</TableCell>
                        <TableCell sx={{ fontWeight: 500, color: '#292524' }}>{item?.name}</TableCell>
                        <TableCell sx={{ color: '#57534e' }}>{item?.ingredientCategory?.name}</TableCell>
                        <TableCell>
                          {item?.price != null ? (
                            <Typography sx={{ color: '#ea580c', fontWeight: 500 }}>
                              {item?.price.toLocaleString()} VNĐ
                            </Typography>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color={item?.inStoke ? "success" : "error"}
                            onClick={() => handleUpdateStock(item?.id)}
                            sx={{
                              borderRadius: 5,
                              textTransform: 'none',
                              minWidth: 100,
                              fontWeight: 500
                            }}
                          >
                            {item?.inStoke ? "Còn hàng" : "Hết hàng"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Phân loại nguyên liệu */}
        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid #fed7aa',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <CategoryIcon sx={{ color: '#ea580c', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#ea580c' }}>
                    Phân loại nguyên liệu
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutline />}
                  onClick={() => setOpenCategoryModal(true)}
                  sx={{
                    color: '#ea580c',
                    borderColor: '#ea580c',
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      borderColor: '#c2410c',
                      backgroundColor: '#fff7ed',
                    }
                  }}
                >
                  Thêm loại
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  boxShadow: 'none',
                  border: '1px solid #fed7aa',
                  overflow: 'hidden'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fff7ed' }}>
                      <TableCell width="30%" sx={{ fontWeight: 600, color: '#ea580c' }}>ID</TableCell>
                      <TableCell width="70%" sx={{ fontWeight: 600, color: '#ea580c' }}>Tên loại</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ingredients?.category?.map((cat) => (
                      <TableRow
                        key={cat.id}
                        hover
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': {
                            backgroundColor: '#fff7ed'
                          }
                        }}
                      >
                        <TableCell sx={{ color: '#57534e' }}>{cat.id}</TableCell>
                        <TableCell sx={{ fontWeight: 500, color: '#292524' }}>{cat.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modals */}
      {/* Modals with updated style */}
      <Modal
        open={openIngredientModal}
        onClose={() => setOpenIngredientModal(false)}
      >
        <Box sx={{
          ...modalStyle,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #fed7aa'
        }}>
          <CreateIngredientForm
            handleClose={() => setOpenIngredientModal(false)}
          />
        </Box>
      </Modal>

      <Modal
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
      >
        <Box sx={{
          ...modalStyle,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #fed7aa'
        }}>
          <CreateIngredientCategoryForm
            handleClose={() => setOpenCategoryModal(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Ingredients;
