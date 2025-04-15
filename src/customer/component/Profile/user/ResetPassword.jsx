import React, { useState } from 'react'
import ResetForm from './NewPassword';
import { OtpForm } from './Otp';

const ResetPassword = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Thay đổi mật khẩu</h2>
      {step === 1 && <OtpForm onNext={() => setStep(2)} />}
      {step === 2 && <ResetForm />}
    </div>
  );

}

export default ResetPassword
