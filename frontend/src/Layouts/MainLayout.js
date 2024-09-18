// src/Layouts/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Component/Navbar/Navbar';
import { Footer } from '../Component/Footer/Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;