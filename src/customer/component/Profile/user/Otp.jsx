import axios from "axios";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { api } from "../../config/api";
import { Button } from "@mui/material";


// Step2OtpForm.js
export const OtpForm = ({onNext }) => {
    const {auth} = useSelector((store) => store)
    const jwt = auth?.jwt || localStorage.getItem("jwt")
  

    const formik = useFormik({
      initialValues: { otp: '' },
      validationSchema: Yup.object({
        otp: Yup.string().required('Nhập mã OTP')
      }),
      onSubmit: async (values) => {
        await api.post('/auth/verify-otp', {otp:values.otp}, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        onNext(); // tới bước 3
      }
    });

    const handleSendOtp = async () => {
        await api.post('/auth/send-otp',{}, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

    }
  
    return (
        <div>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input name="otp" placeholder="Nhập mã OTP"
          onChange={formik.handleChange} value={formik.values.otp}
          className="border p-2 w-full" />
          <div className="flex justify-center gap-4 mt-4">
            <Button sx={{border: "2px solid #FF5722", color: "#FF5722"}} type="submit" className="px-4 py-2">Xác nhận OTP</Button>
            <Button sx={{bgcolor: "#FF5722"}} variant="contained" onClick={handleSendOtp} className="text-white px-4 py-2">Gửi OTP</Button>
          </div>
        
      </form>
        </div>
      
    );
  };
  