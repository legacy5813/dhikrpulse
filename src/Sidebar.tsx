import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import { Button, Menu } from 'antd'
import {
  PieChartOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const items: MenuItem[] = [
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
  ]

  return (
    <div style={{ width: collapsed ? 80 : 256 }}>
      <Button
        type="primary"
        onClick={() => setCollapsed(!collapsed)}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>

      <Menu
        defaultSelectedKeys={['1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        onClick={(e) => {
          if (e.key === '1') navigate('/')
          if (e.key === '2') navigate('/about')
        }}
      />
    </div>
  )
}

export default Sidebar