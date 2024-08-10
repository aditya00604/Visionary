"use client";
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import Sidebar from './Sidebar';

const AppProvider = ({ children }) => {
  return (
    <SessionProvider>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        
          {children}
        
      </div>
    </SessionProvider>
  );
};

export default AppProvider;
