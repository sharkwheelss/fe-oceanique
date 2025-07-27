import { useState } from 'react';
import PassInput from './PassInput';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DialogMessage from '../components/helper/DialogMessage';
import { useDialog } from '../components/helper/useDialog';
import { useI18n } from '../context/I18nContext';

const Signup = () => {
    // Form state
    const { signup } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { t } = useI18n();

    const [dialogState, { showSuccess, showError, closeDialog }] = useDialog();

    const navigate = useNavigate();
    const location = useLocation();

    // Function to get page content and userTypeId based on current path
    const getPageContent = () => {
        switch (location.pathname) {
            case '/signup':
                return {
                    title: t('signup.title'),
                    subtitle: t('signup.subtitle'),
                    img: '/cust-signup.png',
                    userTypeId: 1,
                    signinLink: '/signin',
                    signinText: t('signup.signinHere')
                };
            case '/adminevent-signup':
                return {
                    title: t('signup.adminTitle'),
                    subtitle: t('signup.adminSubtitle'),
                    img: '/adminevent-signin.png',
                    userTypeId: 3,
                    signinLink: '/adminevent-signin',
                    signinText: t('signup.signinHere')
                };
        }
    };

    const { title, subtitle, img, userTypeId, signinLink, signinText } = getPageContent();

    // Handle form submission
    const handleSubmit = async () => {
        const result = await signup(username, email, password, confirmPassword, userTypeId);
        if (result.success) {
            showSuccess(
                t('signup.successTitle'),
                t('signup.successMessage'),
            )
        } else {
            showError(
                t('signup.failedTitle'),
                result.message || 'Sign Up Failed'
            )
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
                            placeholder={t('signup.usernamePlaceholder')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder={t('signup.emailPlaceholder')}
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
                            placeholder={t('signup.passwordPlaceholder')}
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-6">
                        <PassInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t('signup.confirmPasswordPlaceholder')}
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                    >
                        {t('signup.signupButton')}
                    </button>

                    {/* Sign In Link */}
                    <div className="text-center mt-6">
                        <p>
                            {t('signup.haveAcc')}
                            <Link to={signinLink} className="text-teal-500 ml-1 hover:underline">
                                {signinText}
                            </Link>
                        </p>
                    </div>

                    {/* Additional navigation for customer signup */}
                    {location.pathname === '/signup' && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 mb-6">{t('signup.organizingEvent')}</p>
                            <button
                                onClick={() => navigate('/adminevent-signup')}
                                className="w-full py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-500 hover:text-white transition-colors"
                            >
                                {t('signup.eventAdminSignup')}
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
    );
}


export default Signup;