import { useState } from 'react';
import PassInput from './PassInput';
import GoogleBtn from './GoogleBtn';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Signin = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handleSubmit = async () => {
        const result = await login(emailOrUsername, password);

        if (result.success) {
            setShowSuccess(true);
            setErrorMessage('');
        } else {
            setShowSuccess(false);
            setErrorMessage(result.message || 'Login failed');
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row">
            {/* Left side */}
            <div className="md:w-1/2 flex flex-col justify-center p-8">
                <h1 className="text-3xl font-bold mb-4">
                    Discover Breathtaking Indonesian Shores with <span className="text-teal-500 font-sharemono">Oceanique</span>
                </h1>
                <p className="text-xl mb-6">– Try our recommendation now!</p>
                <div className="max-w-md mx-auto">
                    <img
                        src="/cust-signin.png"
                        alt="Beach illustration"
                        className="w-full h-auto"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="md:w-1/2 flex flex-col justify-center p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Sign In</h2>

                <div className="max-w-md mx-auto w-full">
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Enter email or username"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div className="mb-2">
                        <PassInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>

                    <div className="text-right mb-6">
                        <a href="#" className="text-sm text-gray-400 hover:text-teal-500">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                    >
                        Sign in
                    </button>

                    <div className="text-center mt-6">
                        <p>
                            Don't have an account?
                            <Link to="/signup" className="text-teal-500 ml-1 hover:underline">
                                Register here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500">or continue with</p>
                        <GoogleBtn text="Sign in with Google" />
                    </div>

                    {/* Pop-up Messages */}
                    {showSuccess && (
                        <DialogMessage
                            type="success"
                            title="Sign In Successful!"
                            message={`Welcome back to Oceanique!`}
                            handleResponse={() => setShowSuccess(false)}
                        />
                    )}
                    {errorMessage && (
                        <DialogMessage
                            type="error"
                            title="Sign In Failed!"
                            message={errorMessage}
                            handleResponse={() => setErrorMessage('')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

interface DialogMessageProps {
    type: 'success' | 'error';
    title: string;
    message: string;
    handleResponse: () => void;
}

const DialogMessage: React.FC<DialogMessageProps> = ({ type, title, message, handleResponse }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/home';

    const styles = {
        success: {
            background: 'bg-white',
            title: 'text-teal-600',
            button: 'bg-teal-500 hover:bg-teal-600',
        },
        error: {
            background: 'bg-white',
            title: 'text-red-600',
            button: 'bg-red-500 hover:bg-red-600',
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
            <div
                className={`${styles[type].background} rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-popup`}
                style={{
                    animation: 'popup 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
            >
                <h3 className={`text-2xl font-bold mb-4 ${styles[type].title}`}>{title}</h3>
                <p className="mb-6 text-gray-700">{message}</p>
                <button
                    onClick={() => {
                        handleResponse();
                        if (type === 'success') {
                            navigate(from, { replace: true });
                        }
                    }}
                    className={`px-6 py-2 text-white rounded transition-colors ${styles[type].button}`}
                >
                    {type === 'success' ? 'Continue' : 'Close'}
                </button>
            </div>
            <style>
                {`
                @keyframes popup {
                    0% {
                    opacity: 0;
                    transform: scale(0.8);
                    }
                    100% {
                    opacity: 1;
                    transform: scale(1);
                    }
                }
                .animate-popup {
                    animation: popup 0.3s cubic-bezier(0.22, 1, 0.36, 1);
                }
                `}
            </style>
        </div>
    )
}

export default Signin;
