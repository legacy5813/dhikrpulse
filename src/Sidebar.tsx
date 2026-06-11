import React, { useState } from 'react'
import { Button, Menu } from 'antd'
import {
  PieChartOutlined,
  DesktopOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      style={{
        width: open ? 256 : 60,
        height: '100vh',
        background: '#001529',
        transition: '0.2s ease',
        paddingTop: 12,
      }}
    >
      {/* ALWAYS visible toggle button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: 'white' }} />}
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* MENU ONLY SHOWS WHEN OPEN */}
      {open && (
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <PieChartOutlined />,
              label: 'Dhikr Counter',
            },
            {
              key: '2',
              icon: <DesktopOutlined />,
              label: 'About',
            },
          ]}
          onClick={(e) => {
            if (e.key === '1') navigate('/')
            if (e.key === '2') navigate('/about')
          }}
        />
      )}
    </div>
  )
}

export default Sidebar