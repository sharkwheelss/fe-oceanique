import { useState } from 'react';
import {
    DollarSign,
    Upload,
    FileImage,
    X,
    AlertCircle,
    CreditCard,
    Building2,
    Smartphone
} from "lucide-react";

function PaymentMethodPage({ total, formatCurrency, goToNextPage, eventData }) {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [errors, setErrors] = useState({});

    // Payment methods with their details
    const paymentMethods = [
        {
            id: 'bank_transfer',
            name: 'Bank Transfer',
            icon: Building2,
            details: {
                bankName: 'Bank Central Asia (BCA)',
                accountNumber: '1234567890',
                accountName: 'PT Oceanique Events'
            }
        },
    ];

    // Handle file upload
    const handleFileUpload = (file) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setErrors({ file: 'Please upload a valid image file (JPG, PNG)' });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ file: 'File size must be less than 5MB' });
            return;
        }

        setErrors({});
        setUploadedFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // Remove uploaded file
    const removeFile = () => {
        setUploadedFile(null);
        setPreviewUrl('');
        setErrors({});
    };

    // Handle form submission
    const handleSubmit = () => {
        const newErrors = {};

        if (!selectedMethod) {
            newErrors.method = 'Please select a payment method';
        }

        if (!uploadedFile) {
            newErrors.file = 'Please upload payment evidence';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Proceed to next page (confirmation/summary)
        goToNextPage();
    };

    const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);

    return (
        <div className="container mx-auto max-w-4xl px-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Payment Methods</h2>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl text-teal-500 font-bold">
                        {formatCurrency(total)}
                    </p>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
                {errors.method && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">{errors.method}</span>
                    </div>
                )}

                <div className="grid gap-4">
                    {paymentMethods.map((method) => {
                        const IconComponent = method.icon;
                        return (
                            <div
                                key={method.id}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedMethod === method.id
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setSelectedMethod(method.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg mr-3 ${selectedMethod === method.id ? 'bg-teal-500 text-white' : 'bg-gray-100'
                                            }`}>
                                            <IconComponent className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium">{method.name}</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 ${selectedMethod === method.id
                                            ? 'border-teal-500 bg-teal-500'
                                            : 'border-gray-300'
                                        }`}>
                                        {selectedMethod === method.id && (
                                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Payment Details */}
            {selectedPaymentMethod && (
                <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">Payment Details</h4>
                    <div className="space-y-2 text-sm">
                        {selectedPaymentMethod.id === 'bank_transfer' ? (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Bank:</span>
                                    <span className="font-medium">{selectedPaymentMethod.details.bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Account Number:</span>
                                    <span className="font-medium font-mono">{selectedPaymentMethod.details.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Account Name:</span>
                                    <span className="font-medium">{selectedPaymentMethod.details.accountName}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Provider:</span>
                                    <span className="font-medium">{selectedPaymentMethod.details.provider}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Number:</span>
                                    <span className="font-medium font-mono">{selectedPaymentMethod.details.number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Name:</span>
                                    <span className="font-medium">{selectedPaymentMethod.details.name}</span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between pt-2 border-t border-blue-200">
                            <span className="text-blue-700 font-medium">Amount to Transfer:</span>
                            <span className="font-bold text-lg text-blue-900">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Payment Evidence */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Upload Payment Evidence</h3>
                {errors.file && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">{errors.file}</span>
                    </div>
                )}

                {!uploadedFile ? (
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            Upload Payment Screenshot
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Drag and drop your payment screenshot here, or click to browse
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 cursor-pointer transition-colors"
                        >
                            <FileImage className="h-4 w-4 mr-2" />
                            Choose File
                        </label>
                        <p className="text-xs text-gray-400 mt-2">
                            Supported formats: JPG, PNG (Max 5MB)
                        </p>
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Uploaded Evidence</h4>
                            <button
                                onClick={removeFile}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={previewUrl}
                                    alt="Payment evidence"
                                    className="w-24 h-24 object-cover rounded-lg border"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {uploadedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                    <p className="text-xs text-green-700">
                                        ✓ File uploaded successfully. Your payment will be verified by our admin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Payment Instructions</h4>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Transfer the exact amount to the selected payment method</li>
                    <li>Take a screenshot of your successful payment</li>
                    <li>Upload the screenshot as evidence</li>
                    <li>Wait for admin approval (usually within 24 hours)</li>
                </ol>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
                <button
                    onClick={handleSubmit}
                    disabled={!selectedMethod || !uploadedFile}
                    className={`px-8 py-3 rounded-lg flex items-center font-medium transition-all ${selectedMethod && uploadedFile
                            ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Submit Payment Evidence
                    <DollarSign className="ml-2 h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export default PaymentMethodPage;