import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Auth = () => {
  const [loginMode, setLoginMode] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">E-Chat</h2>
        
        {loginMode ? (
          <LoginForm onToggleForm={() => setLoginMode(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setLoginMode(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;