import { useState } from 'react';
import GoogleBtn from './GoogleBtn';
import PassInput from './PassInput';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    // Form state
    const { signup } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    // Function to get page content and userTypeId based on current path
    const getPageContent = () => {
        switch (location.pathname) {
            case '/signup':
                return {
                    title: 'Your Indonesian Beach Escape Starts Here',
                    subtitle: '– Join Oceanique Now!',
                    img: '/cust-signup.png',
                    userTypeId: 1,
                    signinLink: '/signin',
                    signinText: 'Sign in here'
                };
            case '/adminevent-signup':
                return {
                    title: 'Join as Event Organizer',
                    subtitle: '– Share your events with the world!',
                    img: '/adminevent-signin.png',
                    userTypeId: 3,
                    signinLink: '/adminevent-signin',
                    signinText: 'Sign in as event organizer'
                };
        }
    };

    const { title, subtitle, img, userTypeId, signinLink, signinText } = getPageContent();

    // Handle form submission
    const handleSubmit = async () => {
        const result = await signup(username, email, password, confirmPassword, userTypeId);
        if (result.success) {
            setShowSuccess(true);
            setErrorMessage('');
        } else {
            setShowSuccess(false);
            setErrorMessage(result.message || 'Sign up failed');
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row">
            {/* Left side with sign up form */}
            <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Sign Up</h2>

                <div className="max-w-md w-full">
                    {/* Username Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <PassInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-6">
                        <PassInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                    >
                        Sign up
                    </button>

                    {/* Sign In Link */}
                    <div className="text-center mt-6">
                        <p>
                            Already have an account?
                            <Link to={signinLink} className="text-teal-500 ml-1 hover:underline">
                                {signinText}
                            </Link>
                        </p>
                    </div>

                    {/* Additional navigation for customer signup */}
                    {location.pathname === '/signup' && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 mb-6">Are you organizing events?</p>
                            <button
                                onClick={() => navigate('/adminevent-signup')}
                                className="w-full py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-500 hover:text-white transition-colors"
                            >
                                Sign up as event organizer!
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right side with illustration and text */}
            <div className="md:w-1/2 flex flex-col justify-center p-8">
                <h1 className="text-3xl font-bold mb-4">
                    {title}
                </h1>
                <p className="text-xl mb-6">
                    {subtitle.includes('Oceanique') ? (
                        <>
                            {subtitle.split('Oceanique')[0]}
                            <span className="text-teal-500 font-sharemono">Oceanique</span>
                            {subtitle.split('Oceanique')[1]}
                        </>
                    ) : (
                        subtitle
                    )}
                </p>

                {/* Illustration */}
                <div className="max-w-md ml-auto">
                    <img
                        src={img}
                        alt="Signup illustration"
                        className="w-full h-auto"
                    />
                </div>
            </div>

            {/* Pop-up Messages */}
            {showSuccess && (
                <DialogMessage
                    type="success"
                    title="Sign Up Successful!"
                    message={`Welcome to Oceanique!`}
                    navigate={signinLink}
                    handleResponse={() => setShowSuccess(false)}
                />
            )}
            {errorMessage && (
                <DialogMessage
                    type="error"
                    title="Sign Up Failed!"
                    message={errorMessage}
                    navigate={location.pathname}
                    handleResponse={() => setErrorMessage('')}
                />
            )}
        </div>
    );
}

interface DialogMessageProps {
    type: 'success' | 'error';
    title: string;
    message: string;
    handleResponse: () => void;
    navigate: string;
}

const DialogMessage: React.FC<DialogMessageProps> = ({ type, title, message, navigate, handleResponse }) => {
    const styles = {
        success: {
            background: 'bg-white',
            title: 'text-teal-600',
            button: 'bg-teal-500 hover:bg-teal-600',
            navigate: navigate
        },
        error: {
            background: 'bg-white',
            title: 'text-red-600',
            button: 'bg-red-500 hover:bg-red-600',
            navigate: navigate
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
                            window.location.href = navigate;
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

export default Signup;