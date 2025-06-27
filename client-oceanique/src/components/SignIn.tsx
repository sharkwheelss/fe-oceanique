import { useState } from 'react';
import PassInput from './PassInput';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Signin = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, completeLogin, isAdmin, isCust } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showWrongUserType, setShowWrongUserType] = useState(false);
    const [wrongUserTypeData, setWrongUserTypeData] = useState({ userType: '', correctPath: '' });

    // Function to get title based on current path
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/signin':
                return {
                    title: 'Discover Breathtaking Indonesian Shores with ',
                    subtitle: '– Try our recommendation now!',
                    img: '/cust-signin.png'
                };
            case '/admincms-signin':
                return {
                    title: 'Content Management System of ',
                    subtitle: '- Manage the content effortlessly!',
                    img: '/admincms-signin.png'
                };
            case '/adminevent-signin':
                return {
                    title: 'Event Admin Hub of ',
                    subtitle: '- Share your events with the world!',
                    img: '/adminevent-signin.png'
                };
        }
    };

    // Function to get expected user type based on signin page
    const getExpectedUserType = () => {
        switch (location.pathname) {
            case '/signin':
                return 1;
            case '/admincms-signin':
                return 2;
            case '/adminevent-signin':
                return 3;
            default:
                return 1;
        }
    };

    // Function to get redirect path based on signin page
    const getRedirectPath = () => {
        // First check if there's a 'from' state (user was redirected to login)
        const from = location.state?.from?.pathname;
        if (from && from !== '/') {
            return from;
        }

        // Otherwise, redirect based on the signin page type
        switch (location.pathname) {
            case '/signin':
                return '/home'; // Regular user dashboard/home
            case '/admincms-signin':
                return '/admin'; // CMS admin dashboard
            case '/adminevent-signin':
                return '/admin'; // Event admin dashboard
            default:
                return '/home';
        }
    };

    // Function to validate user type matches signin page
    const validateUserType = (userTypesId) => {
        const expectedType = getExpectedUserType();
        return userTypesId === expectedType;
    };

    // Function to get user type name for error message
    const getUserTypeName = (userTypesId) => {
        switch (userTypesId) {
            case 1:
                return 'Customer';
            case 2:
                return 'CMS Admin';
            case 3:
                return 'Event Admin';
            default:
                return 'Unknown';
        }
    };

    // Function to get correct signin path for user type
    const getCorrectSigninPath = (userTypesId) => {
        switch (userTypesId) {
            case 1:
                return '/signin';
            case 2:
                return '/admincms-signin';
            case 3:
                return '/adminevent-signin';
            default:
                return '/signin';
        }
    };

    const { title, subtitle, img } = getPageTitle();

    const handleSubmit = async () => {
        const result = await login(emailOrUsername, password);

        if (result.success && result.user) {
            // Validate user type BEFORE completing login
            const userTypesId = result.user.user_types_id;

            if (!validateUserType(userTypesId)) {
                const currentUserType = getUserTypeName(userTypesId);
                const correctPath = getCorrectSigninPath(userTypesId);

                setShowSuccess(false);
                setErrorMessage('');
                setShowWrongUserType(true);
                setWrongUserTypeData({
                    userType: currentUserType,
                    correctPath: correctPath
                });

                // Important: Don't complete login, just return
                return;
            }

            // If validation passes, complete the login
            completeLogin(result.user, result.token!);

            setShowSuccess(true);
            setErrorMessage('');
            setShowWrongUserType(false);
        } else {
            setShowSuccess(false);
            setErrorMessage(result.message || 'Login failed');
            setShowWrongUserType(false);
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row">
            {/* Left side */}
            <div className="md:w-1/2 flex flex-col justify-center p-8">
                <h1 className="text-3xl font-bold mb-4">
                    {title}<span className="text-teal-500 font-sharemono">Oceanique</span>
                </h1>
                <p className="text-xl mb-6 italic">{subtitle}</p>
                <div className="max-w-md mx-auto">
                    <img
                        src={img}
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

                    {location.pathname === '/signin' && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 mb-6">Are you the one who held event?</p>
                            <button
                                onClick={() => navigate('/adminevent-signin')}
                                className="w-full py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-500 hover:text-white transition-colors"
                            >
                                Sign in here!
                            </button>
                        </div>
                    )}

                    {/* Pop-up Messages */}
                    {showSuccess && (
                        <DialogMessage
                            type="success"
                            title="Sign In Successful!"
                            message={`Welcome back to Oceanique!`}
                            handleResponse={() => setShowSuccess(false)}
                            redirectPath={getRedirectPath()}
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
                    {showWrongUserType && (
                        <WrongUserTypeDialog
                            userType={wrongUserTypeData.userType}
                            correctPath={wrongUserTypeData.correctPath}
                            onClose={() => setShowWrongUserType(false)}
                            onRedirect={() => {
                                setShowWrongUserType(false);
                                navigate(wrongUserTypeData.correctPath);
                            }}
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
    redirectPath?: string;
}

const DialogMessage: React.FC<DialogMessageProps> = ({
    type,
    title,
    message,
    handleResponse,
    redirectPath
}) => {
    const navigate = useNavigate();

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
                        if (type === 'success' && redirectPath) {
                            navigate(redirectPath, { replace: true });
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

interface WrongUserTypeDialogProps {
    userType: string;
    correctPath: string;
    onClose: () => void;
    onRedirect: () => void;
}

const WrongUserTypeDialog: React.FC<WrongUserTypeDialogProps> = ({
    userType,
    correctPath,
    onClose,
    onRedirect
}) => {
    const getPageName = (path: string) => {
        switch (path) {
            case '/signin':
                return 'Customer Sign In';
            case '/admincms-signin':
                return 'CMS Admin Sign In';
            case '/adminevent-signin':
                return 'Event Admin Sign In';
            default:
                return 'Sign In';
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center animate-popup">
                <div className="mb-4">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-orange-600">Wrong Sign In Page</h3>
                    <p className="text-gray-700 mb-6">
                        You are trying to sign in as a <strong>{userType}</strong>, but you're on the wrong sign in page.
                    </p>
                    <p className="text-sm text-gray-600 mb-6">
                        Please use the <strong>{getPageName(correctPath)}</strong> page instead.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                        Stay Here
                    </button>
                    <button
                        onClick={onRedirect}
                        className="flex-1 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                    >
                        Go to Correct Page
                    </button>
                </div>
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
    );
};

export default Signin;