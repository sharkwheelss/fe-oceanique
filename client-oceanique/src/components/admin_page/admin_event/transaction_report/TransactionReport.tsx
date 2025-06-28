import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const TransactionList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // You can replace this with your actual API call
    // const { getTransactions } = useTransactions(); // Replace with your actual context

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);

                // Replace this with your actual API call
                // const transactionsResponse = await getTransactions();

                // Sample data - replace with actual API response
                const sampleData = [
                    {
                        id: '1',
                        paymentId: '5245143414',
                        createdAt: '07 Mei 13:00',
                        bookedBy: 'Ryyan Ramadhan',
                        status: 'pending',
                        bookedAt: '07 Mei 2025',
                        paymentMethod: 'BCA VA',
                        totalPayment: 2200000,
                        totalTickets: 3
                    },
                    {
                        id: '2',
                        paymentId: '5245143413',
                        createdAt: '01 Januari 13:00',
                        bookedBy: 'Ryyan Ramadhan',
                        status: 'approved',
                        bookedAt: '01 Januari 2025',
                        paymentMethod: 'BCA VA',
                        totalPayment: 300000,
                        totalTickets: 2
                    },
                    {
                        id: '3',
                        paymentId: '5245143412',
                        createdAt: '02 Februari 09:00',
                        bookedBy: 'Ryyan Ramadhan',
                        status: 'approved',
                        bookedAt: '02 Februari 2025',
                        paymentMethod: 'BCA VA',
                        totalPayment: 200000,
                        totalTickets: 1
                    },
                    {
                        id: '4',
                        paymentId: '0123781741',
                        createdAt: '01 Januari 13:30',
                        bookedBy: 'Ryyan Ramadhan',
                        status: 'rejected',
                        bookedAt: '01 Januari 2024',
                        paymentMethod: 'BCA VA',
                        totalPayment: 100000,
                        totalTickets: 1
                    }
                ];

                setTransactions(sampleData);

                // Uncomment when using real API
                // if (transactionsResponse && transactionsResponse.data) {
                //     setTransactions(transactionsResponse.data);
                // } else if (Array.isArray(transactionsResponse)) {
                //     setTransactions(transactionsResponse);
                // } else {
                //     setTransactions([]);
                // }
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError('Failed to load transactions. Please try again.');
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredTransactions = transactions?.filter(transaction =>
        transaction.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.bookedBy?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="flex-1 bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Transaction List</h1>
                </div>
            </div>

            <div className="p-8">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">Error: {error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-80"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                                <span className="ml-2 text-gray-600">Loading transactions...</span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Payment ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Booked By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Payment Method
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Tickets
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                {loading ? 'Loading...' : 'No transactions found'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50">
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer hover:text-teal-600"
                                                    onClick={() => {
                                                        navigate(`/admin/tickets/transactions-report/${transaction.id}`);
                                                    }}
                                                >
                                                    {transaction.paymentId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.createdAt}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.bookedBy}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.paymentMethod}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatCurrency(transaction.totalPayment)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.totalTickets}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                                                    >
                                                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/admin/tickets/transactions-report/${transaction.id}`);
                                                            }}
                                                            className="text-teal-600 hover:text-teal-900 transition-colors"
                                                            title="View transaction details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionList;