import React from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  Chip,
  ImageList,
  ImageListItem,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useDispatch, useSelector } from 'react-redux';
import { updateRestaurantStatus } from '../../state/Customer/Restaurant/Action';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SOCIAL_ICONS = [
  {
    name: 'Facebook',
    key: 'facebook',
    icon: <FacebookIcon sx={{ fontSize: '2rem' }} />
  },
  {
    name: 'Instagram',
    key: 'instagram',
    icon: <InstagramIcon sx={{ fontSize: '2rem' }} />
  },
  {
    name: 'Twitter',
    key: 'twitter',
    icon: <TwitterIcon sx={{ fontSize: '2rem' }} />
  },
  {
    name: 'LinkedIn',
    key: 'linkedin',
    icon: <LinkedInIcon sx={{ fontSize: '2rem' }} />
  }
];

const SocialIcon = ({ href, icon, name }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="p-2 hover:bg-orange-50 rounded-full transition-colors"
    title={name}
  >
    {React.cloneElement(icon, {
      className: "text-gray-600 hover:text-orange-500"
    })}
  </a>
);

const Details = () => {
  const { auth, restaurant } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = sessionStorage.getItem("jwt");

  const handleRestaurantStatus = () => {
    dispatch(updateRestaurantStatus({
      restaurantId: restaurant.usersRestaurant.id,
      jwt: auth.jwt || jwt,
    }));
  };

  return (
    <div className="min-h-screen bg-white p-6 lg:p-10">
      {/* Header Section with Restaurant Images */}
      <Box className="relative mb-16">
        <Grid container spacing={4}>
          {/* Restaurant Info */}
          <Grid item xs={12} md={4}>
            <div className="text-center flex items-center align-center gap-20">

              <Typography variant="h3" className="font-bold text-black my-4">
                {restaurant.usersRestaurant?.name}
              </Typography>
              <Button
                onClick={handleRestaurantStatus}
                size="large"
                variant="contained"
                sx={{
                  background: restaurant.usersRestaurant?.open ? '#ef4444' : '#22c55e',
                  padding: '0.8rem 2.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  '&:hover': {
                    background: restaurant.usersRestaurant?.open ? '#dc2626' : '#16a34a',
                  }
                }}
              >
                {restaurant.usersRestaurant?.open ? 'Close Restaurant' : 'Open Restaurant'}
              </Button>
            </div>
          </Grid>

          {/* Restaurant Images */}
          <Grid item xs={12} md={8}>
            <Box sx={{
              height: 400,
              overflow: 'hidden',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}>
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3000}
                pauseOnHover={true}
                arrows={true}
              >
                {restaurant.usersRestaurant?.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`Restaurant ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </Slider>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Content Grid */}
      <Grid container spacing={4}>
        {/* Restaurant Information */}
        <Grid item xs={12} lg={6}>
          <Card className="shadow-xl">
            <CardHeader
              avatar={<RestaurantIcon className="text-orange-500" />}
              title={
                <Typography variant="h6" className="text-black">
                  Thông tin quán ăn
                </Typography>
              }
              className="border-b"
            />
            <CardContent className="space-y-4">
              <InfoRow label="Owner" value={restaurant.usersRestaurant?.owner.fullName} />
              <InfoRow label="Cuisine Type" value={restaurant.usersRestaurant?.cuisineType} />
              <InfoRow label="Opening Hours" value={restaurant.usersRestaurant?.openingHours} />
              <InfoRow
                label="Status"
                value={
                  <Chip
                    label={restaurant.usersRestaurant?.open ? 'Open' : 'Closed'}
                    color={restaurant.usersRestaurant?.open ? 'success' : 'error'}
                    variant="filled"
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Address Information */}
        <Grid item xs={12} lg={6}>
          <Card className="shadow-xl">
            <CardHeader
              avatar={<LocationOnIcon className="text-orange-500" />}
              title={
                <Typography variant="h6" className="text-black">
                  Địa chỉ chi tiết
                </Typography>
              }
              className="border-b"
            />
            <CardContent className="space-y-4">
              <InfoRow label="Country" value={restaurant.usersRestaurant?.address.country} />
              <InfoRow label="City" value={restaurant.usersRestaurant?.address.city} />
              <InfoRow label="Postal Code" value={restaurant.usersRestaurant?.address.postalCode} />
              <InfoRow
                label="Street Address"
                value={restaurant.usersRestaurant?.address.streetAddress}
                className="text-wrap"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Card className="shadow-xl">
            <CardHeader
              avatar={<ContactMailIcon className="text-orange-500" />}
              title={
                <Typography variant="h6" className="text-black">
                  Thông tin liên hệ
                </Typography>
              }
              className="border-b"
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InfoRow label="Email" value={restaurant.usersRestaurant?.contactInformation.email} />
                  <InfoRow label="Mobile" value={restaurant.usersRestaurant?.contactInformation.mobile} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className="text-black mb-3">Mạng xã hội</Typography>
                  <div className="flex gap-4 justify-start">
                    {SOCIAL_ICONS.map((item) => (
                      <SocialIcon
                        key={item.name}
                        href={restaurant.usersRestaurant?.contactInformation[item.key]}
                        icon={item.icon}
                        name={item.name}
                      />
                    ))}
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

const InfoRow = ({ label, value, className = '' }) => (
  <div className={`flex justify-between items-center py-2 ${className}`}>
    <Typography className="text-gray-600 font-medium">{label}</Typography>
    <Typography className="text-black">{value || '-'}</Typography>
  </div>
);

export default Details;
// ...rest of the code remains the same...