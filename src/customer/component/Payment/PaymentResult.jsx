import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { cash } = useParams();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm text-center">
        <div className="flex justify-center">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        {(!cash || cash == null) && <h2 className="text-2xl font-semibold text-gray-800 mt-4">Thanh toán thành công!</h2>}
        <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý ngay.</p>
        <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          Quay lại trang chủ
        </button>
      </div>
    </div>

  );
};

export default PaymentResult;
