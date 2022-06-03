import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AppLayout is a placeholder page component that wraps around the entire app.
 * 
 * This component allows its children routes to be rendered appropriately in 
 * main routing of the application.
 */
function AppLayout() {
  return (
    <main className="app">
      <Outlet />
    </main>
  )
}

export default AppLayout;