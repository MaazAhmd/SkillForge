import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFunds, fetchAccount } from "../redux/slices/accountSlice";
import { useNavigate } from "react-router-dom";

const suggestedAmounts = [50, 100, 200, 500];

const DepositFunds = () => {
    const dispatch = useDispatch();
    const { account } = useSelector((state) => state.account);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedAmount, setSelectedAmount] = useState("");
    const [customAmount, setCustomAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if(!account) {
        dispatch(fetchAccount());
      }
    }, [dispatch]);
    const handleAmountSelect = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount("");
    };

    const handleNext = () => {
        if (customAmount) setSelectedAmount(Number(customAmount));
        setStep(2);
    };

    const handleVerify = () => {
        setStep(3);
        setIsLoading(true);

        setTimeout(() => {
            dispatch(addFunds({ accountId: account._id, amount: selectedAmount }));
            dispatch(fetchAccount());
            setIsLoading(false);
            setStep(4);
        }, 6000);
    };

    return (
        <div className="max-w-lg mx-auto my-20 bg-white rounded-2xl shadow">
            <div className="bg-primary text-white p-8 rounded-t-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">Current Balance</h1>
                    <p className="text-3xl font-semibold">${account?.balance}</p>
                </div>
                <p className="text-sm">SkillForge Virtual Bank</p>
            </div>
            {step === 1 && (
                <div className="p-8">
                    <h2 className="text-xl font-semibold mb-4">Select Deposit Amount</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {suggestedAmounts.map((amt) => (
                            <button
                                key={amt}
                                className={`px-4 py-2 rounded cursor-pointer ${
                                    selectedAmount === amt ? "bg-blue-500 text-white" : "bg-blue-100"
                                }`}
                                onClick={() => handleAmountSelect(amt)}
                            >
                                ${amt}
                            </button>
                        ))}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Custom Amount</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(null);
                            }}
                            placeholder="Enter custom amount"
                        />
                    </div>
                    <button
                        className="bg-primary text-white px-4 py-2 rounded cursor-pointer"
                        disabled={!selectedAmount && !customAmount}
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="p-8">
                    <h2 className="text-xl font-semibold mb-4">Transfer Funds</h2>
                    <p className="mb-2">Please send ${selectedAmount} to the following PSID using your preferred payment app:</p>
                    <div className="bg-gray-100 p-3 rounded mb-4">
                        <p className="font-mono text-lg">PSID: 1234567899990000</p>
                        <p className="text-sm text-gray-500">SkillForge Virtual Bank</p>
                    </div>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                        onClick={handleVerify}
                    >
                        Verify Transaction
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="text-center p-8">
                    <h2 className="text-xl font-bold mb-2">Verifying Transaction</h2>
                    <p className="text-gray-500 mb-4">Please wait while we verify your payment...</p>
                    <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                </div>
            )}

            {step === 4 && (
                <div className="text-center p-8">
                    <h2 className="text-xl font-bold text-green-600 mb-2">Transaction Received!</h2>
                    <p>Your funds have been added to your SkillForge account.</p>
                    <button
                        className="mt-4 bg-primary text-white px-4 py-2 rounded cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        Go Back
                    </button>
                </div>
            )}
        </div>
    );
};

export default DepositFunds;
