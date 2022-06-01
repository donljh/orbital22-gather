import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../Navbar/Navbar'

const Main = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Main