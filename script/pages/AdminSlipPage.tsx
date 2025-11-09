import React from 'react';
import { Student } from '../types.ts';
import CollegeLogo from '../components/icons/CollegeLogo.tsx';
import SignatureIcon from '../components/icons/SignatureIcon.tsx';

declare const jspdf: any;
declare const html2canvas: any;

interface AdminSlipPageProps {
    student: Student;
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

const AdminSlipPage: React.FC<AdminSlipPageProps> = ({ student, onBack }) => {
    const issueDate = new Date();

    const handleDownload = () => {
        const slipElement = document.getElementById('admin-slip');
        if (slipElement && typeof jspdf !== 'undefined' && typeof html2canvas !== 'undefined') {
            const { jsPDF } = jspdf;
            
            const originalInlineStyle = slipElement.style.cssText;
            slipElement.style.width = '896px';
            
            html2canvas(slipElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 896,
            }).then(canvas => {
                slipElement.style.cssText = originalInlineStyle;

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'a4'
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const imgHeightInPdf = canvas.height * pdfWidth / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightInPdf);
                
                pdf.save(`SEC-Admin-Slip-${student.id}.pdf`);
            }).catch(err => {
                slipElement.style.cssText = originalInlineStyle;
                console.error("PDF generation failed:", err);
                alert("Sorry, an error occurred while generating the PDF.");
            });
        } else {
            console.error("PDF generation libraries not found or slip element is missing.");
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-32">
                <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-gray-200" id="admin-slip">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b-2 border-sec-blue pb-6">
                        <div className="flex items-center space-x-4">
                             <CollegeLogo className="h-20 w-20" />
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-sec-blue">Sengunthar Engineering College</h1>
                                <p className="text-gray-600">Tiruchengode, Namakkal (Dt), Tamilnadu - 637205</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">Admin Slip / No Dues Certificate</h2>
                    </div>

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
                         <p className="text-lg text-gray-700 leading-relaxed">
                            This is to certify that the student mentioned above has paid all the fees, including tuition, hostel, and other miscellaneous charges for the academic period.
                        </p>
                        <p className="text-xl font-bold text-green-600 mt-4">
                            All Dues Cleared.
                        </p>
                    </div>

                    <div className="mt-24 text-right">
                        <div className="inline-block text-center">
                            <SignatureIcon className="w-48 h-12 text-gray-800" />
                            <div className="w-48 border-t-2 border-gray-400 mt-1"></div>
                            <p className="font-semibold text-gray-700 mt-2">Authorised Signature</p>
                            <p className="text-sm text-gray-500">Accounts Department</p>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-sm text-gray-500">
                        <p>This is a computer-generated slip and does not require a physical signature for validation if downloaded from the official portal.</p>
                    </div>
                </div>
            </div>
            <div className="sticky bottom-0 bg-white p-4 shadow-top flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden">
                <button onClick={onBack} className="w-full sm:w-auto order-2 sm:order-1 text-gray-700 font-semibold py-3 px-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                    Back to Dashboard
                </button>
                <button onClick={handleDownload} className="w-full sm:w-auto order-1 sm:order-2 bg-sec-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
                    Download Slip
                </button>
            </div>
        </>
    );
};

export default AdminSlipPage;