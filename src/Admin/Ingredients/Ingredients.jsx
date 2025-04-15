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
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const Ingredients = () => {
  const dispatch = useDispatch();
  const { ingredients } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  const [openIngredientModal, setOpenIngredientModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const handleUpdateStock = (id) => {
    dispatch(updateStockOfIngredient({ id, jwt }));
  };

  return (
    <Box sx={{ p: 4 }} className="w-full h-full">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Quản lý nguyên liệu & phân loại
      </Typography>

      <Grid container spacing={5}>
        {/* Danh sách nguyên liệu */}
        <Grid item xs={12} md={7}>
          <Card elevation={3}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <InventoryIcon color="primary" />
                  <Typography variant="h6">Danh sách nguyên liệu</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutline />}
                  onClick={() => setOpenIngredientModal(true)}
                >
                  Thêm nguyên liệu
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Tên</strong></TableCell>
                      <TableCell><strong>Loại</strong></TableCell>
                      <TableCell><strong>Giá</strong></TableCell>
                      <TableCell><strong>Trạng thái</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ingredients?.ingredients?.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.ingredientCategory?.name}</TableCell>
                        <TableCell>
                          {item.price.toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color={item.inStoke ? "success" : "error"}
                            onClick={() => handleUpdateStock(item.id)}
                          >
                            {item.inStoke ? "Còn hàng" : "Hết hàng"}
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
          <Card elevation={3} sx={{ minWidth: 300 }}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <CategoryIcon color="secondary" />
                  <Typography variant="h6">Phân loại nguyên liệu</Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<AddCircleOutline />}
                  onClick={() => setOpenCategoryModal(true)}
                >
                  Thêm loại
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Tên</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ingredients?.category?.map((cat) => (
                      <TableRow key={cat.id} hover>
                        <TableCell>{cat.id}</TableCell>
                        <TableCell>{cat.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal tạo nguyên liệu */}
      <Modal
        open={openIngredientModal}
        onClose={() => setOpenIngredientModal(false)}
      >
        <Box sx={modalStyle}>
          <CreateIngredientForm
            handleClose={() => setOpenIngredientModal(false)}
          />
        </Box>
      </Modal>

      {/* Modal tạo loại nguyên liệu */}
      <Modal
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
      >
        <Box sx={modalStyle}>
          <CreateIngredientCategoryForm
            handleClose={() => setOpenCategoryModal(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Ingredients;
