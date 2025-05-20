import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TablePagination
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteFoodAction,
  getMenuItemsByRestaurantId,
  updateMenuItemsAvailability,
} from "../../state/Customer/Menu/Action";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { categorizedIngredients } from "../../util/categorizedIngredients";
import DeleteIcon from "@mui/icons-material/Delete";
import { Create } from "@mui/icons-material";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';


const MenuItemTable = ({ isDashboard, name }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menu, ingredients, restaurant, auth } = useSelector((store) => store);
  const { id } = useParams();
  const jwt = sessionStorage.getItem("jwt");

  // Add pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Add pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {

    if (restaurant.usersRestaurant) {
      dispatch(getMenuItemsByRestaurantId({
        restaurantId: restaurant.usersRestaurant?.id,
        jwt: sessionStorage.getItem("jwt"),
        seasonal: false,
        vegetarian: false,
        nonveg: false,
        foodCategory: "",
      }));
    }


  }, [ingredients?.update, restaurant.usersRestaurant]);




  const handleFoodAvialability = (foodId) => {
    dispatch(updateMenuItemsAvailability({ foodId, jwt: auth.jwt || jwt }));
  };

  const handleDeleteFood = (foodId) => {
    dispatch(deleteFoodAction({ foodId, jwt: auth.jwt || jwt }));
  };

  return (
    <Box width={"100%"}>
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
            <RestaurantMenuIcon sx={{ color: '#ea580c' }} />
          }
          title={
            <Typography variant="h6" sx={{ color: '#ea580c', fontWeight: '600' }}>
              {name}
            </Typography>
          }
          sx={{
            p: 3,
            borderBottom: '1px solid #f1f5f9',
            '& .MuiCardHeader-action': { mt: 0.6 },
          }}
          action={
            <Button
              startIcon={<Create />}
              onClick={() => navigate("/admin/restaurant/add-menu")}
              sx={{
                color: '#ea580c',
                '&:hover': {
                  backgroundColor: '#fff7ed',
                }
              }}
            >
              Thêm món
            </Button>
          }
        />
        <TableContainer sx={{ p: 2 }}>
          <Table aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Hình ảnh</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Tên món</TableCell>
                {!isDashboard && (
                  <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>
                    Thành phần
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 'bold', color: '#475569', textAlign: "center" }}>Giá</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569', textAlign: "center" }}>Trạng thái</TableCell>
                {!isDashboard && (
                  <TableCell sx={{ fontWeight: 'bold', color: '#475569', textAlign: "center" }}>Xóa</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {menu.menuItems
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((item) => (
                  <TableRow
                    hover
                    key={item?.id}
                    sx={{
                      "&:last-of-type td, &:last-of-type th": { border: 0 },
                      "&:hover": {
                        backgroundColor: '#fff7ed',
                      },
                    }}
                  >
                    <TableCell>
                      <Avatar
                        alt={item?.name}
                        src={item?.images[0]}
                        sx={{
                          width: 56,
                          height: 56,
                          border: '2px solid #f1f5f9'
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {item?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item?.brand}
                        </Typography>
                      </Box>
                    </TableCell>

                    {!isDashboard && (
                      <TableCell>
                        {Object.keys(categorizedIngredients(item?.ingredientsItems))?.map((category) => (
                          <div key={category} className="mb-4">
                            <Typography sx={{
                              fontWeight: 600,
                              color: '#ea580c',
                              mb: 1
                            }}>
                              {category}
                            </Typography>
                            <div className="pl-5 space-y-1">
                              {categorizedIngredients(item?.ingredientsItems)[category].map((ingredient) => (
                                <div key={ingredient?.id} className="flex items-center gap-2">
                                  <HorizontalRuleIcon sx={{ fontSize: "8px", color: '#94a3b8' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {ingredient?.name}
                                    {ingredient?.price && (
                                      <span className="text-orange-600 ml-1">
                                        ({ingredient?.price.toLocaleString()} VNĐ)
                                      </span>
                                    )}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </TableCell>
                    )}

                    <TableCell sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: '#ea580c'
                        }}
                      >
                        {item?.price?.toLocaleString() || 0} VNĐ
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={item?.available ? "Còn hàng" : "Hết hàng"}
                        color={item?.available ? "success" : "error"}
                        onClick={() => handleFoodAvialability(item?.id)}
                        sx={{
                          '&.MuiChip-root': {
                            borderRadius: '8px',
                            fontWeight: 500
                          }
                        }}
                      />
                    </TableCell>

                    {!isDashboard && (
                      <TableCell sx={{ textAlign: "center" }}>
                        <IconButton
                          onClick={() => handleDeleteFood(item?.id)}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#fee2e2',
                            }
                          }}
                        >
                          <DeleteIcon sx={{ color: '#ef4444' }} />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Add TablePagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={menu.menuItems?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '.MuiTablePagination-select': {
              color: '#ea580c',
            },
            '.MuiTablePagination-selectIcon': {
              color: '#ea580c',
            },
            '.MuiTablePagination-displayedRows': {
              color: '#475569',
            },
            '.MuiTablePagination-actions': {
              color: '#ea580c',
            },
          }}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Card>

      <Backdrop
        sx={{
          color: '#fff',
          backdropFilter: 'blur(3px)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={menu.loading}
      >
        <CircularProgress sx={{ color: '#ea580c' }} />
      </Backdrop>
    </Box>
  );
};

export default MenuItemTable;
