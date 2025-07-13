// Refactored Signin.tsx
import { useState } from 'react';
import PassInput from './PassInput';
import DialogMessage from '../components/helper/DialogMessage';
import { useDialog } from '../components/helper/useDialog';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Signin = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, completeLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Using the reusable dialog hook
    const [dialogState, { showSuccess, showError, showWarning, closeDialog }] = useDialog();

    // Function to get title based on current path
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/signin':
                return {
                    title: 'Discover Breathtaking Indonesian Shores with ',
                    subtitle: '– Try our recommendation now!',
                    img: '/cust-signin.png'
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
            case '/adminevent-signin':
                return 3;
            default:
                return 1;
        }
    };

    // Function to get redirect path based on signin page
    const getRedirectPath = () => {
        const from = location.state?.from?.pathname;
        if (from && from !== '/') {
            return from;
        }

        switch (location.pathname) {
            case '/signin':
                return '/home';
            case '/adminevent-signin':
                return '/admin';
            default:
                return '/home';
        }
    };

    // Function to validate user type matches signin page
    const validateUserType = (userTypesId: any) => {
        const expectedType = getExpectedUserType();
        return userTypesId === expectedType;
    };

    // Function to get user type name for error message
    const getUserTypeName = (userTypesId: any) => {
        switch (userTypesId) {
            case 1:
                return 'Customer';
            case 3:
                return 'Event Admin';
            default:
                return 'Unknown';
        }
    };

    // Function to get correct signin path for user type
    const getCorrectSigninPath = (userTypesId: any) => {
        switch (userTypesId) {
            case 1:
                return '/signin';
            case 3:
                return '/adminevent-signin';
            default:
                return '/signin';
        }
    };

    const getPageName = (path: string) => {
        switch (path) {
            case '/signin':
                return 'Customer Sign In';
            case '/adminevent-signin':
                return 'Event Admin Sign In';
            default:
                return 'Sign In';
        }
    };

    const { title, subtitle, img } = getPageTitle();

    const handleSubmit = async () => {
        const result = await login(emailOrUsername, password);

        if (result.success && result.user) {
            const userTypesId = result.user.user_types_id;

            if (!validateUserType(userTypesId)) {
                const currentUserType = getUserTypeName(userTypesId);
                const correctPath = getCorrectSigninPath(userTypesId);

                // Show wrong user type warning with redirect option
                showWarning(
                    'Wrong Sign In Page',
                    `You are trying to sign in as a ${currentUserType}, but you're on the wrong sign in page. Please use the ${getPageName(correctPath)} page instead.`,
                    {
                        showCancel: true,
                        confirmText: 'Go to Correct Page',
                        cancelText: 'Stay Here',
                        onConfirm: () => {
                            closeDialog();
                            navigate(correctPath);
                        }
                    }
                );
                return;
            }

            // If validation passes, complete the login
            completeLogin(result.user, result.token!);

            // Show success message with redirect
            showSuccess(
                'Sign In Successful!',
                'Welcome back to Oceanique!',
                {
                    showCancel: false,
                    redirectPath: getRedirectPath()
                }
            );
        } else {
            // Show error message
            showError(
                'Sign In Failed!',
                result.message || 'Login failed',
                {
                    showCancel: false
                }
            );
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

                    {/* Reusable Dialog Component */}
                    <DialogMessage
                        type={dialogState.type}
                        title={dialogState.title}
                        message={dialogState.message}
                        isOpen={dialogState.isOpen}
                        onClose={closeDialog}
                        redirectPath={dialogState.redirectPath}
                        onConfirm={dialogState.onConfirm}
                        confirmText={dialogState.confirmText}
                        cancelText={dialogState.cancelText}
                        showCancel={dialogState.showCancel}
                        autoClose={dialogState.autoClose}
                        autoCloseDelay={dialogState.autoCloseDelay}
                    />
                </div>
            </div>
        </div>
    );
};

export default Signin;