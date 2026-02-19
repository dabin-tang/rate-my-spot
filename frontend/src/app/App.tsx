import { useState } from 'react'
import reactLogo from '@/shared/assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from 'antd';

function App() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Rate My Spot </h1>
      <Button type="primary" size="large">
        Ant Design
      </Button>
    </div>
  )
}

export default App