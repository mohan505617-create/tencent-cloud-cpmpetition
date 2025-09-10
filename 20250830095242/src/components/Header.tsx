import React, { useState } from 'react';
import { Layout, Button, Space, Avatar, Dropdown, Badge, Tooltip, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import GlobalSearch from './GlobalSearch';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface 头部属性 {
  collapsed: boolean;
  onToggle: () => void;
}

const 头部: React.FC<头部属性> = ({ collapsed, onToggle }) => {
  const [搜索可见, 设置搜索可见] = useState(false);
  const { 是否深色模式 } = useTheme();
  const 导航 = useNavigate();

  // 用户菜单项
  const 用户菜单项 = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => 导航('/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => 导航('/settings')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: '帮助中心',
      onClick: () => 导航('/guide')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        // 这里可以添加退出登录逻辑
        console.log('退出登录');
      }
    }
  ];

  return (
    <>
      <AntHeader 
        className={`site-layout-background ${是否暗色模式 ? 'dark' : ''}`}
        style={{
          padding: '0 24px',
          background: 是否暗色模式 ? '#001529' : '#fff',
          borderBottom: `1px solid ${是否暗色模式 ? '#303030' : '#f0f0f0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          lineHeight: '64px'
        }}
      >
        {/* 左侧：折叠按钮和标题 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggle}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: 是否暗色模式 ? '#fff' : '#000'
            }}
          />
          
          <div style={{ marginLeft: 16 }}>
            <Text 
              strong 
              style={{ 
                fontSize: 18,
                color: 是否暗色模式 ? '#fff' : '#000'
              }}
            >
              EduAI Hub
            </Text>
            <Text 
              type="secondary" 
              style={{ 
                marginLeft: 8,
                fontSize: 12,
                color: 是否暗色模式 ? '#8c8c8c' : '#666'
              }}
            >
              智能教育平台
            </Text>
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <Space size="middle">
          {/* 全局搜索 */}
          <Tooltip title="全局搜索 (Ctrl+K)">
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => 设置搜索可见(true)}
              style={{
                color: 是否暗色模式 ? '#fff' : '#000'
              }}
            />
          </Tooltip>

          {/* 通知 */}
          <Tooltip title="通知">
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  color: 是否暗色模式 ? '#fff' : '#000'
                }}
              />
            </Badge>
          </Tooltip>

          {/* 用户头像和菜单 */}
          <Dropdown
            menu={{ items: 用户菜单项 }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                size="small" 
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#1890ff'
                }}
              />
              <Text 
                style={{ 
                  color: 是否暗色模式 ? '#fff' : '#000',
                  fontSize: 14
                }}
              >
                用户
              </Text>
            </Space>
          </Dropdown>
        </Space>
      </AntHeader>

      {/* 全局搜索模态框 */}
      <全局搜索
        visible={搜索可见}
        onClose={() => 设置搜索可见(false)}
      />
    </>
  );
};

// 添加键盘快捷键支持
React.useEffect(() => {
  const 处理键盘事件 = (事件: KeyboardEvent) => {
    if ((事件.ctrlKey || 事件.metaKey) && 事件.key === 'k') {
      事件.preventDefault();
      // 这里可以触发全局搜索
      console.log('触发全局搜索快捷键');
    }
  };

  document.addEventListener('keydown', 处理键盘事件);
  return () => {
    document.removeEventListener('keydown', 处理键盘事件);
  };
}, []);

export default 头部;