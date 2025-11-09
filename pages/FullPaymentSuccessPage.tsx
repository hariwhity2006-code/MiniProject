import React from 'react';
import { Student, PaymentMethod } from '../types';
import CollegeLogo from '../components/icons/CollegeLogo';
import SignatureIcon from '../components/icons/SignatureIcon';

declare const jspdf: any;
declare const html2canvas: any;

interface FullPaymentSuccessPageProps {
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

const FullPaymentSuccessPage: React.FC<FullPaymentSuccessPageProps> = ({ student, paymentDetails, onBack }) => {
    const receiptDate = new Date();
    const issueDate = new Date();

    const handleDownload = (elementId: string, fileName: string) => {
        const elementToCapture = document.getElementById(elementId);
        if (elementToCapture && typeof jspdf !== 'undefined' && typeof html2canvas !== 'undefined') {
            const { jsPDF } = jspdf;
            
            const originalInlineStyle = elementToCapture.style.cssText;
            elementToCapture.style.width = '896px';
            
            html2canvas(elementToCapture, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 896,
            }).then(canvas => {
                elementToCapture.style.cssText = originalInlineStyle;

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'a4'
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const imgHeightInPdf = canvas.height * pdfWidth / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightInPdf);
                
                pdf.save(fileName);
            }).catch(err => {
                elementToCapture.style.cssText = originalInlineStyle;
                console.error("PDF generation failed:", err);
                alert("Sorry, an error occurred while generating the PDF.");
            });
        } else {
            console.error("PDF generation libraries not found or element is missing.");
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-32">
                <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-gray-200 mb-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
                        <p className="text-gray-600 mt-2 text-lg">Congratulations, all your dues have been cleared.</p>
                    </div>
                </div>

                {/* Receipt Section */}
                <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-gray-200 mb-8" id="receipt-section">
                    {/* ... receipt content ... */}
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">Final Payment Receipt</h2>
                            <p className="text-gray-500">SEC Fee Management</p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto mt-4 sm:mt-0">
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
                            <div className="col-span-full"><span className="font-medium text-gray-600">Course:</span> <span className="font-semibold text-sec-blue">{`${student.course} - ${student.year}${getOrdinal(student.year)} Year, Sem ${student.semester}`}</span></div>
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
                            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                                <p className="font-bold text-gray-800">Balance Due</p>
                                <p className="font-bold text-green-600 text-xl">₹0</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Admin Slip Section */}
                <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-gray-200" id="admin-slip-section">
                    {/* ... admin slip content ... */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b-2 border-sec-blue pb-6">
                        <div className="flex items-center space-x-4">
                             <CollegeLogo className="h-20 w-20" />
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-sec-blue">Sengunthar Engineering College</h1>
                                <p className="text-gray-600">Tiruchengode, Namakkal (Dt), Tamilnadu - 637205</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mb-8"><h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">Admin Slip / No Dues Certificate</h2></div>
                    <div className="text-right mb-8">
                        <p className="font-semibold">Date of Issue:</p>
                        <p className="text-gray-700">{issueDate.toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="bg-sec-light-blue p-6 rounded-lg mb-8">
                        <h3 className="font-semibold text-lg mb-4 text-sec-blue">Student Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
                            <div><span className="font-medium text-gray-600">Name:</span> <span className="font-semibold text-sec-blue">{student.name}</span></div>
                            <div><span className="font-medium text-gray-600">Roll No:</span> <span className="font-semibold text-sec-blue">{student.id}</span></div>
                            <div className="col-span-full"><span className="font-medium text-gray-600">Course:</span> <span className="font-semibold text-sec-blue">{`${student.course} - ${student.year}${getOrdinal(student.year)} Year, Sem ${student.semester}`}</span></div>
                        </div>
                    </div>
                    <div className="text-center my-10">
                         <p className="text-lg text-gray-700 leading-relaxed">This is to certify that the student mentioned above has paid all the fees for the academic period.</p>
                         <p className="text-xl font-bold text-green-600 mt-4">All Dues Cleared.</p>
                    </div>
                    <div className="mt-24 text-right">
                        <div className="inline-block text-center">
                            <SignatureIcon className="w-48 h-12 text-gray-800" />
                            <div className="w-48 border-t-2 border-gray-400 mt-1"></div>
                            <p className="font-semibold text-gray-700 mt-2">Authorised Signature</p>
                            <p className="text-sm text-gray-500">Accounts Department</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 bg-white p-4 shadow-top flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden">
                <button onClick={onBack} className="w-full sm:w-auto order-3 sm:order-1 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                    Back to Dashboard
                </button>
                <button onClick={() => handleDownload('receipt-section', `SEC-Receipt-${student.id}.pdf`)} className="w-full sm:w-auto order-2 sm:order-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
                    Download Receipt
                </button>
                 <button onClick={() => handleDownload('admin-slip-section', `SEC-Admin-Slip-${student.id}.pdf`)} className="w-full sm:w-auto order-1 sm:order-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition">
                    Download Admin Slip
                </button>
            </div>
        </>
    );
};

export default FullPaymentSuccessPage;