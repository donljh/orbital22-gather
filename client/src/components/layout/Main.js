import React from 'react'
import { Outlet } from 'react-router'
import Box from '@mui/material/Box'
import Navbar from '../nav/Navbar'
import { styled } from '@mui/system'

const AppContentWrapper = styled(Box)({
  flex: 1,
  justifyContent: 'center',
  width: '100vw',
  backgroundColor: '#16191b'
})

const Main = () => {
  return (
    <>
      <Navbar />
      <AppContentWrapper>
        <Outlet />
      </AppContentWrapper>
    </>
  )
}

export default Main