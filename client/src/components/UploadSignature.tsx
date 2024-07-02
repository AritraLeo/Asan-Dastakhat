import React from 'react';

const UploadSignature: React.FC = () => {
    return (
        <div>
            <h1>Upload Your Signature</h1>
            <input type='file' accept='image/*' />
            <button>Upload</button>
        </div>
    );
};

export default UploadSignature;
