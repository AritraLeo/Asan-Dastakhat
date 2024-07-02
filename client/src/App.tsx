import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import UploadSignature from './components/UploadSignature';
import UploadPDF from './components/UploadPDF';
import SignPDF from './components/SignPDF';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/upload-signature' element={<UploadSignature />} />
          <Route path='/upload-pdf' element={<UploadPDF />} />
          <Route path='/sign-pdf' element={<SignPDF />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
