import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { createRestaurant } from "../../state/Customer/Restaurant/Action";
import { uploadToCloudinary } from "../utils/UploadToCloudnary";

const initialValues = {
  name: "",
  description: "",
  cuisineType: "",
  streetAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  email: "",
  mobile: "",
  twitter: "",
  instagram: "",
  openingHours: "Mon-Sun: 9:00 AM - 9:00 PM",
  images: [],
};

const CreateRestaurantForm = () => {
  const dispatch = useDispatch();
  const jwt = sessionStorage.getItem("jwt");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = (values) => {
    const data = {
      name: values.name,
      description: values.description,
      cuisineType: values.cuisineType,
      address: {
        detailAddress: values.detailAddress,
        ward: values.ward,
        district: values.district,
        province: values.province,
      },
      contactInformation: {
        email: values.email,
        mobile: values.mobile,
        twitter: values.twitter,
        instagram: values.instagram,
      },
      openingHours: values.openingHours,
      images: values.images,
    };
    dispatch(createRestaurant({ data, jwt }));
    console.log(data, jwt);
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Add New Restaurant</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Image Upload Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
            <div className="flex gap-4 flex-wrap">
              <label
                htmlFor="fileInput"
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer"
              >
                <span className="text-gray-400 text-sm">+ Add</span>
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {formik.values.images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Restaurant Name"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <input
              type="text"
              id="cuisineType"
              name="cuisineType"
              placeholder="Cuisine Type"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.cuisineType}
            />
          </div>
          <div className="mb-6">
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              rows="3"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.description}
            ></textarea>
          </div>
          <div className="mb-6">
            <input
              type="text"
              id="openingHours"
              name="openingHours"
              placeholder="Opening Hours"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.openingHours}
            />
          </div>

          {/* Address Section */}
          <h3 className="text-lg font-semibold mb-2">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              id="detailAddress"
              name="detailAddress"
              placeholder="Detail Address"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.detailAddress}
            />
            <input
              type="text"
              id="ward"
              name="ward"
              placeholder="Ward Address"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.ward}
            />
            <input
              type="text"
              id="district"
              name="district"
              placeholder="District Address"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.district}
            />
            <input
              type="text"
              id="province"
              name="province"
              placeholder="Province/State"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.province}
            />

          </div>

          {/* Contact Information */}
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <input
              type="text"
              id="mobile"
              name="mobile"
              placeholder="Mobile"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.mobile}
            />
            <input
              type="text"
              id="twitter"
              name="twitter"
              placeholder="Twitter"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.twitter}
            />
            <input
              type="text"
              id="instagram"
              name="instagram"
              placeholder="Instagram"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={formik.handleChange}
              value={formik.values.instagram}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurantForm;