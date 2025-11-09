import React from 'react';
import { Student, PaymentMethod } from '../types.ts';

declare const jspdf: any;
declare const html2canvas: any;

interface ReceiptPageProps {
    student: Student;
    paymentDetails: {
        amount: number;
        transactionId: string;
        method: PaymentMethod;
    };
    onBack: () => void;
}

const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
};

const ReceiptPage: React.FC<ReceiptPageProps> = ({ student, paymentDetails, onBack }) => {
    const receiptDate = new Date();
    const dueAmount = student.totalFees - student.paidAmount;

    const handleDownload = () => {
        const receiptElement = document.getElementById('receipt');
        if (receiptElement && typeof jspdf !== 'undefined' && typeof html2canvas !== 'undefined') {
            const { jsPDF } = jspdf;
            
            // Store original inline styles to revert back after rendering
            const originalInlineStyle = receiptElement.style.cssText;
            
            // Set a fixed width to ensure the PDF looks like a desktop view, not a cramped mobile view.
            // This prevents content from being cut off on mobile. 896px corresponds to max-w-4xl.
            receiptElement.style.width = '896px';
            
            html2canvas(receiptElement, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                windowWidth: 896, // Ensure canvas renders at this width
            }).then(canvas => {
                // Restore original styles right after capture to prevent UI disruption
                receiptElement.style.cssText = originalInlineStyle;

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'a4'
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                // Calculate the height of the image in the PDF, maintaining aspect ratio
                const imgHeightInPdf = canvas.height * pdfWidth / canvas.width;
                let heightLeft = imgHeightInPdf;
                let position = 0;

                // Add the first part of the image
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
                heightLeft -= pdfHeight;

                // Add new pages if the content is taller than one page
                while (heightLeft > 0) {
                    position = -heightLeft;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
                    heightLeft -= pdfHeight;
                }
                
                pdf.save(`SEC-Receipt-${student.id}.pdf`);
            }).catch(err => {
                // Ensure styles are restored even if there's an error
                receiptElement.style.cssText = originalInlineStyle;
                console.error("PDF generation failed:", err);
                alert("Sorry, an error occurred while generating the PDF.");
            });
        } else {
            console.error("PDF generation libraries not found or receipt element is missing.");
        }
    };


    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-32"> {/* Added padding-bottom for sticky footer */}
                <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-gray-200" id="receipt">
                    <div className="text-center mb-8 border-b pb-6">
                        <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
                        <p className="text-gray-500 mt-2">Your fee payment has been processed successfully.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h2 className="text-2xl font-semibold text-gray-800">Receipt</h2>
                            <p className="text-gray-500">SEC Fee Management</p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                            <p className="font-semibold">Transaction ID:</p>
                            <p className="text-gray-600 text-sm break-all">{paymentDetails.transactionId}</p>
                            <p className="font-semibold mt-2">Date:</p>
                            <p className="text-gray-600 text-sm">{receiptDate.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="bg-sec-light-blue p-6 rounded-lg mb-8">
                        <h3 className="font-semibold text-lg mb-4 text-sec-blue">Student Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><span className="font-medium text-gray-600">Name:</span> <span className="font-semibold text-sec-blue">{student.name}</span></div>
                            <div><span className="font-medium text-gray-600">Roll Number:</span> <span className="font-semibold text-sec-blue">{student.id}</span></div>
                            <div><span className="font-medium text-gray-600">Email:</span> <span className="font-semibold text-sec-blue">{student.email}</span></div>
                            <div><span className="font-medium text-gray-600">Course:</span> <span className="font-semibold text-sec-blue">{`${student.course} - ${student.year}${getOrdinal(student.year)} Year, Sem ${student.semester}`}</span></div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-sec-blue">Payment Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b pb-3">
                                <p className="text-gray-600">Amount Paid</p>
                                <p className="font-bold text-green-600 text-xl">₹{paymentDetails.amount.toLocaleString('en-IN')}</p>
                            </div>
                             <div className="flex justify-between items-center border-b pb-3">
                                <p className="text-gray-600">Payment Method</p>
                                <p className="font-semibold">{paymentDetails.method}</p>
                            </div>
                            <div className="flex justify-between items-center border-b pb-3">
                                <p className="text-gray-600">Total Fees</p>
                                <p className="font-semibold">₹{student.totalFees.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="flex justify-between items-center border-b pb-3">
                                <p className="text-gray-600">Total Paid Amount</p>
                                <p className="font-semibold">₹{student.paidAmount.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                                <p className="font-bold text-gray-800">Balance Due</p>
                                <p className="font-bold text-red-500 text-xl">₹{dueAmount.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>An email receipt has been sent to {student.email}.</p>
                        <p>This is a computer-generated receipt and does not require a signature.</p>
                    </div>
                </div>
            </div>
            <div className="sticky bottom-0 bg-white p-4 shadow-top flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden">
                <button onClick={onBack} className="w-full sm:w-auto order-2 sm:order-1 text-gray-700 font-semibold py-3 px-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                    Back to Dashboard
                </button>
                <button onClick={handleDownload} className="w-full sm:w-auto order-1 sm:order-2 bg-sec-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
                    Download Receipt
                </button>
            </div>
        </>
    );
};

export default ReceiptPage;