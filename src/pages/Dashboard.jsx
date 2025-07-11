import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Landmark,
  CreditCard,
  DollarSign,
  ArrowRightLeft,
  PieChart,
  LogOut,
  Bell
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'Guest',
    email: 'guest@example.com',
    accountNumber: 'N/A',
  });

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');

    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      console.log('Fetched User Data:', parsedData); // Debugging log
      setUserData(parsedData); // Update state with parsed data
    } else {
      console.error('No user data found. Redirecting to login...');
      navigate('/login'); // Redirect if no data
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userData'); // Clear user data from localStorage
    navigate('/login'); // Redirect to login page after logout
  };

  const handleTransferClick = () => {
    navigate('/transfer');
  };

  const handleDepositClick = () => {
    navigate('/deposit');
  };

  const handleBalanceClick = () => {
    navigate('/balance');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Landmark className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">MyBank</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Hi, {userData.name}!
          </h2>
          <p className="text-sm text-gray-600">Welcome to your dashboard</p>
          <p className="text-sm text-gray-600">Account Number: {userData.accountNumber}</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Total Balance</h2>
          <p className="text-3xl font-bold text-gray-900">$24,562.00</p>
          <p className="text-sm text-green-600 mt-1">+2.3% from last month</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Action Buttons */}
          <button
            onClick={handleDepositClick}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <CreditCard className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Deposit</h3>
            <p className="text-sm text-gray-600">Deposit your Money here</p>
          </button>

          <button
            onClick={handleTransferClick}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowRightLeft className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Transfer</h3>
            <p className="text-sm text-gray-600">Send & receive money</p>
          </button>

          <button
            onClick={handleBalanceClick}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Balance</h3>
            <p className="text-sm text-gray-600">Check your balance here</p>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
            <PieChart className="h-5 w-5 text-gray-600" />
          </div>

          <div className="space-y-4">
            {[
              { name: 'Netflix Subscription', amount: -13.99, date: 'Today' },
              { name: 'Salary Deposit', amount: 5000.00, date: 'Yesterday' },
              { name: 'Grocery Store', amount: -64.37, date: '2 days ago' },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{transaction.name}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
