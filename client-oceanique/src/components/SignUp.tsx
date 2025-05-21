import { useState } from 'react';
import GoogleBtn from './GoogleBtn';
import PassInput from './PassInput';

const Signup = () => {
    // Form state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    // Handle form submission
    const handleSubmit = () => {
        // You can add validation here if needed
        setShowDialog(true);
        console.log('Signing up with:', { username, email, password, confirmPassword });
        // Add sign up logic here
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
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
                            <a href="#" className="text-teal-500 ml-1 hover:underline">
                                Sign in here
                            </a>
                        </p>
                    </div>

                    {/* Or continue with */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-500">or continue with</p>

                        {/* Google Sign Up */}
                        <GoogleBtn text='Sign up with Google' />
                    </div>
                </div>
            </div>

            {/* Right side with illustration and text */}
            <div className="md:w-1/2 flex flex-col justify-center p-8">
                <h1 className="text-3xl font-bold mb-4">
                    Your Indonesian Beach Escape Starts Here
                </h1>
                <p className="text-xl mb-6">– Join <span className="text-teal-500 font-sharemono">Oceanique</span> Now!</p>

                {/* Beach vacation illustration */}
                <div className="max-w-md ml-auto">
                    <img
                        src="/cust-signup.png"
                        alt="Beach vacation illustration"
                        className="w-full h-auto"
                    />
                </div>
            </div>

            {/* Popup Dialog */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
                    <div
                        className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-popup"
                        style={{
                            animation: 'popup 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                    >
                        <h3 className="text-2xl font-bold mb-4 text-teal-600">Sign Up Successful!</h3>
                        <p className="mb-6 text-gray-700">Welcome to <span className="font-sharemono text-teal-500">Oceanique</span>! Your account has been created.</p>
                        <button
                            onClick={handleCloseDialog}
                            className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                        >
                            Close
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
            )}
        </div>
    );
}

export default Signup;