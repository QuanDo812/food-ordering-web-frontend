import axios from "axios";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { api } from "../../config/api";


// Step3ResetPassword.js
const ResetForm = () => {
    const {auth} = useSelector((store) => store)
    const jwt = auth?.jwt || localStorage.getItem("jwt")
    const email = auth?.user?.email;

    const formik = useFormik({
      initialValues: { newPassword: '' },
      validationSchema: Yup.object({
        newPassword: Yup.string().min(6, 'Tối thiểu 6 kí tự').required()
      }),
      onSubmit: async (values) => {
        await api.post('/auth/reset-password', values.newPassword , 
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        alert("Đổi mật khẩu thành công!");
      }
    });
  
    return (
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input name="newPassword" type="password" placeholder="Mật khẩu mới"
          onChange={formik.handleChange} value={formik.values.newPassword}
          className="border p-2 w-full" />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2">Đặt lại mật khẩu</button>
      </form>
    );
  };
  
  export default ResetForm;
    