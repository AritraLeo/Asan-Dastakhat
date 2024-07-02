import React from 'react';

const UploadPDF: React.FC = () => {
    return (
        <div>
            <h1>Upload Your PDF</h1>
            <input type='file' accept='application/pdf' />
            <button>Upload</button>
        </div>
    );
};

export default UploadPDF;
