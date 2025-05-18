import { DollarSign } from "lucide-react";

function PaymentMethodPage({ total, formatCurrency, goToNextPage }) {
    return (
        <div className="container mx-auto max-w-6xl px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
                <p className="text-xl text-teal-500 font-medium">
                    Total: {formatCurrency(total)}
                </p>
            </div>

            {/* Payment method selection */}
            <div className="bg-gray-200 rounded-lg p-20 flex items-center justify-center mb-8">
                <h3 className="text-xl font-bold">MIDTRANS API</h3>
            </div>

            {/* Pay Now Button */}
            <div className="flex justify-end">
                <button
                    onClick={goToNextPage}
                    className="px-8 py-3 rounded-lg bg-teal-500 text-white flex items-center"
                >
                    Pay Now
                    <DollarSign className="ml-2 h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export default PaymentMethodPage;