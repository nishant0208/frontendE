// pages/fees.tsx
"use client"
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// --- Dummy Data (Reused and adapted from parent.tsx) ---
// In a real application, this data would be fetched from a backend API,
// linked to specific parent and student accounts.

const classes = [
  { id: '1', name: 'Class 10 A', teacher: 'Ms. Smith' },
  { id: '2', name: 'Class 10 B', teacher: 'Mr. Johnson' },
  { id: '3', name: 'Class 11 Science', teacher: 'Dr. Lee' },
  { id: '4', name: 'Class 9 C', teacher: 'Ms. Davis' },
];

const students = [
  {
    id: 's1',
    name: 'Alice Smith',
    classId: '1', // Class 10 A
    email: 'alice.s@example.com',
    feesStatus: {
      totalAmount: 12000,
      paidAmount: 10000,
      dueDate: '2025-06-30',
      status: 'Partial Paid',
    },
  },
  {
    id: 's2',
    name: 'Bob Johnson',
    classId: '1', // Class 10 A
    email: 'bob.j@example.com',
    feesStatus: {
      totalAmount: 12000,
      paidAmount: 12000,
      dueDate: '2025-06-30',
      status: 'Paid',
    },
  },
  {
    id: 's3',
    name: 'Charlie Brown',
    classId: '2', // Class 10 B
    email: 'charlie.b@example.com',
    feesStatus: {
      totalAmount: 11000,
      paidAmount: 0,
      dueDate: '2025-06-30',
      status: 'Unpaid',
    },
  },
];

const FeesPage: React.FC = () => {
  // State to hold the ID of the currently selected student
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  // State for payment option: 'full' or 'installment'
  const [paymentOption, setPaymentOption] = useState<'full' | 'installment'>('full');
  // State for installment amount
  const [installmentAmount, setInstallmentAmount] = useState<number | ''>('');
  // State for any payment messages
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Find the selected student's data
  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const studentClass = selectedStudent ? classes.find(c => c.id === selectedStudent.classId) : null;

  // Calculate pending amount
  const pendingAmount = selectedStudent
    ? selectedStudent.feesStatus.totalAmount - selectedStudent.feesStatus.paidAmount
    : 0;

  // Set initial selected student to the first one available
  useEffect(() => {
    if (!selectedStudentId && students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  }, [selectedStudentId]); // Only run once on mount

  // Reset installment amount when student or payment option changes
  useEffect(() => {
    setInstallmentAmount('');
    setPaymentMessage('');
    setMessageType('');
  }, [selectedStudentId, paymentOption]);

  const handlePayment = () => {
    setPaymentMessage('');
    setMessageType('');

    if (!selectedStudent) {
      setPaymentMessage('Please select a student to proceed with payment.');
      setMessageType('error');
      return;
    }

    let amountToPay = 0;
    if (paymentOption === 'full') {
      amountToPay = pendingAmount;
    } else {
      amountToPay = Number(installmentAmount);
      if (isNaN(amountToPay) || amountToPay <= 0 || amountToPay > pendingAmount) {
        setPaymentMessage('Please enter a valid installment amount.');
        setMessageType('error');
        return;
      }
    }

    if (amountToPay === 0) {
      setPaymentMessage('No pending amount to pay or invalid amount entered.');
      setMessageType('error');
      return;
    }

    // --- Simulate Razorpay Redirection ---
    // In a real application, you would typically:
    // 1. Make an API call to your backend to create a Razorpay Order.
    // 2. The backend responds with Order ID and other details.
    // 3. You then initialize Razorpay Checkout with these details.
    // 4. On successful payment, Razorpay redirects or calls a callback URL.

    const dummyRazorpayUrl = `https://example.com/razorpay-checkout?amount=${amountToPay}&studentId=${selectedStudent.id}&paymentType=${paymentOption}`;

    // Open in a new tab to simulate redirection
    window.open(dummyRazorpayUrl, '_blank');

    setPaymentMessage(`Redirecting to Razorpay for payment of ₹${amountToPay.toLocaleString()}. Please complete the payment.`);
    setMessageType('success');

    // In a real app, after successful payment callback, you'd update feesStatus
    // For dummy data, we can simulate an update after a delay
    setTimeout(() => {
      // This is a client-side simulation. In reality, backend would update DB.
      const updatedStudents = students.map(s => {
        if (s.id === selectedStudent.id) {
          const newPaidAmount = s.feesStatus.paidAmount + amountToPay;
          const newStatus = newPaidAmount >= s.feesStatus.totalAmount ? 'Paid' : 'Partial Paid';
          return {
            ...s,
            feesStatus: {
              ...s.feesStatus,
              paidAmount: newPaidAmount,
              status: newStatus,
            },
          };
        }
        return s;
      });
      console.log("Simulated fees update:", updatedStudents);
      // You would typically update your global state or re-fetch data here
    }, 3000);
  };

  return (
    <div className="font-inter max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Fees Payment</title>
        <meta name="description" content="Pay student fees" />
        <link rel="icon" href="/favicon.ico" />
        {/* Tailwind CSS CDN for quick preview. Remove if using PostCSS build. */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-teal-700">Fees Payment</h1>
      </div>

      {/* Student Selector Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="mb-6">
          <label htmlFor="student-select" className="block text-lg font-semibold text-gray-700 mb-3">
            Select Student:
          </label>
          <select
            id="student-select"
            className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            value={selectedStudentId || ''}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            <option value="" disabled>Select a student</option>
            {students.length > 0 ? (
              students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({classes.find(c => c.id === student.classId)?.name})
                </option>
              ))
            ) : (
              <option value="">No students available</option>
            )}
          </select>
        </div>

        {selectedStudent ? (
          <div className="mt-8 animate-fade-in">
            <h2 className="text-3xl font-semibold text-teal-700 mb-6 pb-3 border-b border-gray-200">
              {selectedStudent.name}'s Fee Details
            </h2>

            {/* Fee Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 shadow-md text-center">
                <p className="text-lg font-medium text-teal-700 mb-2">Total Amount:</p>
                <p className="text-3xl font-bold text-gray-800">₹{selectedStudent.feesStatus.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 shadow-md text-center">
                <p className="text-lg font-medium text-teal-700 mb-2">Amount Paid:</p>
                <p className="text-3xl font-bold text-gray-800">₹{selectedStudent.feesStatus.paidAmount.toLocaleString()}</p>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 shadow-md text-center col-span-1 md:col-span-2">
                <p className="text-lg font-medium text-teal-700 mb-2">Pending Amount:</p>
                <p className="text-4xl font-bold text-red-600">₹{pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-2">Due Date: {selectedStudent.feesStatus.dueDate}</p>
                <span className={`mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-bold
                  ${selectedStudent.feesStatus.status === 'Paid' ? 'bg-green-200 text-green-800' :
                    selectedStudent.feesStatus.status === 'Partial Paid' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                  }`}>
                  Status: {selectedStudent.feesStatus.status}
                </span>
              </div>
            </div>

            {/* Payment Options */}
            {pendingAmount > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">Choose Payment Option</h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-teal-600"
                      name="paymentOption"
                      value="full"
                      checked={paymentOption === 'full'}
                      onChange={() => setPaymentOption('full')}
                    />
                    <span className="ml-2 text-lg text-gray-800">Full Payment (₹{pendingAmount.toLocaleString()})</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-teal-600"
                      name="paymentOption"
                      value="installment"
                      checked={paymentOption === 'installment'}
                      onChange={() => setPaymentOption('installment')}
                    />
                    <span className="ml-2 text-lg text-gray-800">Pay in Installments</span>
                  </label>
                </div>

                {paymentOption === 'installment' && (
                  <div className="mb-6 animate-fade-in">
                    <label htmlFor="installment-amount" className="block text-lg font-semibold text-gray-700 mb-3">
                      Enter Installment Amount:
                    </label>
                    <input
                      type="number"
                      id="installment-amount"
                      className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder={`Max: ₹${pendingAmount.toLocaleString()}`}
                      value={installmentAmount}
                      onChange={(e) => setInstallmentAmount(Number(e.target.value) || '')}
                      min="1"
                      max={pendingAmount}
                    />
                    <p className="text-sm text-gray-500 mt-2">Enter the amount you wish to pay in this installment.</p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  className="w-full bg-teal-600 text-white px-6 py-3 rounded-md font-semibold cursor-pointer hover:bg-teal-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    (paymentOption === 'installment' && (Number(installmentAmount) <= 0 || Number(installmentAmount) > pendingAmount)) ||
                    pendingAmount === 0
                  }
                >
                  Pay Now
                </button>

                {paymentMessage && (
                  <div className={`mt-4 p-3 rounded-md text-center font-medium
                    ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {paymentMessage}
                  </div>
                )}
              </div>
            )}

            {pendingAmount === 0 && selectedStudent.feesStatus.status === 'Paid' && (
              <div className="bg-green-50 border border-green-200 rounded-xl shadow-md p-6 mb-8 text-center">
                <h3 className="text-2xl font-semibold text-green-700 mb-3">Fees Paid in Full!</h3>
                <p className="text-lg text-gray-700">All outstanding fees for {selectedStudent.name} have been successfully paid.</p>
              </div>
            )}

          </div>
        ) : (
          <div className="p-8 text-center text-gray-600 bg-white rounded-xl shadow-lg border border-gray-200">
            <p className="text-xl">Please select a student from the dropdown above to view their fee details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesPage;
