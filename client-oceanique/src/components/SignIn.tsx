import { useState } from 'react';
import PassInput from './PassInput';
import GoogleBtn from './GoogleBtn';

const Signin = () => {
    // Form state
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = () => {
        console.log('Signing in with:', { emailOrUsername, password });
        // Add sign in logic here
    };

    return (
        <div className="w-full flex flex-col md:flex-row">
            {/* Left side with illustration and text */}
            <div className="md:w-1/2 flex flex-col justify-center p-8">
                <h1 className="text-3xl font-bold mb-4">
                    Discover Breathtaking Indonesian Shores with <span className="text-teal-500">Oceanique</span>
                </h1>
                <p className="text-xl mb-6">– Try our recommendation now!</p>

                {/* Beach illustration */}
                <div className="max-w-md mx-auto">
                    <img
                        src="public/cust-signin.png"
                        alt="Beach illustration"
                        className="w-full h-auto"
                    />
                </div>
            </div>

            {/* Right side with sign in form */}
            <div className="md:w-1/2 flex flex-col justify-center p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">Sign In</h2>

                <div className="max-w-md mx-auto w-full">
                    {/* Email/Username Input */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Enter email or username"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-2">
                        <PassInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right mb-6">
                        <a href="#" className="text-sm text-gray-400 hover:text-teal-500">
                            Forgot password?
                        </a>
                    </div>

                    {/* Sign In Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                    >
                        Sign in
                    </button>

                    {/* Register Link */}
                    <div className="text-center mt-6">
                        <p>
                            Don't have an account?
                            <a href="#" className="text-teal-500 ml-1 hover:underline">
                                Register here
                            </a>
                        </p>
                    </div>

                    {/* Or continue with */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-500">or continue with</p>

                        {/* Google Sign In */}
                        <GoogleBtn text='Sign in with Google' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin