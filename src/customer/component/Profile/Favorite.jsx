import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Place as PlaceIcon,
  AccessTime as AccessTimeIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { addToFavorites } from '../../../state/Auth/Action';
import { useNavigate } from 'react-router-dom';

const Favorite = () => {

  const { auth } = useSelector((store) => store);
  const favorite = auth?.favorites || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFavorite = (restaurantId) => {
    dispatch(addToFavorites({ restaurantId: restaurantId, jwt: auth.jwt || sessionStorage.getItem('jwt') }));
  };

  const navigateToRestaurant = (restaurant) => {
    navigate(`/restaurant/${restaurant.title}/${restaurant.id}`);
  };

  return (
    <Box className="min-h-screen p-6 bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <Box className="mb-8">
        <Typography
          variant="h4"
          sx={{
            color: '#ea580c',
            fontWeight: 'bold',
            mb: 1
          }}
        >
          Nhà hàng yêu thích
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#57534e' }}
        >
          Danh sách những nhà hàng bạn đã đánh dấu yêu thích
        </Typography>
      </Box>

      {/* Favorite List */}
      {favorite.length === 0 ? (
        <Box
          className="flex flex-col items-center justify-center"
          sx={{ py: 8 }}
        >
          <FavoriteIcon sx={{ fontSize: 60, color: '#fed7aa', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#57534e' }}>
            Bạn chưa có nhà hàng yêu thích nào
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorite.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <Card
                className="h-full relative hover:shadow-lg transition-shadow"
                sx={{
                  borderRadius: 3,
                  border: '1px solid #fed7aa',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}

              >
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.images[0]}
                  alt={restaurant.title}
                  sx={{ height: 200 }}
                  onClick={() => navigateToRestaurant(restaurant)}
                />

                <IconButton
                  onClick={() => handleRemoveFavorite(restaurant.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      bgcolor: '#fee2e2',
                      color: '#ef4444'
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>

                <CardContent sx={{ pt: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#ea580c',
                      mb: 1
                    }}
                  >
                    {restaurant.title}
                  </Typography>

                  <Box className="flex items-center gap-1 mb-2">
                    <Rating
                      value={restaurant.rating}
                      readOnly
                      size="small"
                      sx={{ color: '#ea580c' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: '#57534e' }}
                    >
                      ({restaurant.reviewCount})
                    </Typography>
                  </Box>



                  <Box className="flex items-center justify-between">
                    <Box className="flex items-center gap-1">
                      <AccessTimeIcon sx={{ fontSize: 20, color: '#57534e' }} />
                      <Typography
                        variant="body2"
                        sx={{ color: '#57534e' }}
                      >
                        {restaurant.openingHours}
                      </Typography>
                    </Box>
                    <Chip
                      label={restaurant.open ? "Đang mở cửa" : "Đã đóng cửa"}
                      size="small"
                      color={restaurant.open ? "success" : "error"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Favorite
