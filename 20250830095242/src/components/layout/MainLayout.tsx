import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Tooltip } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BookOutlined,
  ExperimentOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  SearchOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import GlobalSearch from '../GlobalSearch';
import AIInspirationButton from '../AIInspirationButton';
import PDFExport from '../PDFExport';
const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [已折叠, 设置已折叠] = useState(false);
  const [搜索可见, 设置搜索可见] = useState(false);
  const 导航 = useNavigate();
  const 位置 = useLocation();

  const 菜单项: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '首页概览',
    },
    {
      key: '/knowledge',
      icon: <BookOutlined />,
      label: '知识管理',
    },
    {
      key: '/research',
      icon: <ExperimentOutlined />,
      label: '数字谱系',
    },
    {
      key: '/teaching',
      icon: <UserOutlined />,
      label: 'AI园丁',
    },
  ];

  const 用户菜单项: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => 导航('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => 导航('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => 导航('/welcome'),
    },
  ];

  const 处理菜单点击 = ({ key }: { key: string }) => {
    导航(key);
  };

  return (
    <div className="main-layout-container">
      <style>{`
        .light-sidebar {
          background: #ffffff !important;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
          border-right: 1px solid #e0e6ed;
        }
        
        .light-menu {
          background: transparent !important;
          border: none !important;
        }
        
        .light-menu .ant-menu-item {
          margin: 6px 8px !important;
          padding: 12px 16px !important;
          border-radius: 10px !important;
          transition: all 0.3s ease !important;
          color: #1f2937 !important;
          background: transparent !important;
          border: 1px solid transparent !important;
          height: auto !important;
          line-height: 1.4 !important;
          font-weight: 500 !important;
        }
        
        .light-menu .ant-menu-item-selected {
          background-color: #dbeafe !important;
          border-color: #3b82f6 !important;
          color: #1e40af !important;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15) !important;
        }
        
        .light-menu .ant-menu-item:hover {
          background-color: #f3f4f6 !important;
          border-color: #10b981 !important;
          color: #059669 !important;
          transform: translateX(2px);
        }
        
        .light-menu .ant-menu-item .ant-menu-item-icon,
        .light-menu .ant-menu-item span {
          color: inherit !important;
          font-weight: inherit !important;
        }
        
        .light-menu .ant-menu-item-selected .ant-menu-item-icon,
        .light-menu .ant-menu-item-selected span {
          color: #1e40af !important;
          font-weight: 600 !important;
        }
        
        .light-menu .ant-menu-item:hover .ant-menu-item-icon,
        .light-menu .ant-menu-item:hover span {
          color: #059669 !important;
          font-weight: 500 !important;
        }
        
        /* 深色模式下的菜单样式 */
        .dark .light-menu .ant-menu-item {
          color: #e5e7eb !important;
          background: transparent !important;
        }
        
        .dark .light-menu .ant-menu-item .ant-menu-item-icon,
        .dark .light-menu .ant-menu-item span {
          color: #e5e7eb !important;
        }
        
        .dark .light-menu .ant-menu-item-selected {
          background-color: #1e40af !important;
          border-color: #3b82f6 !important;
          color: #ffffff !important;
        }
        
        .dark .light-menu .ant-menu-item-selected .ant-menu-item-icon,
        .dark .light-menu .ant-menu-item-selected span {
          color: #ffffff !important;
          font-weight: 600 !important;
        }
        
        .dark .light-menu .ant-menu-item:hover {
          background-color: #374151 !important;
          border-color: #10b981 !important;
          color: #ffffff !important;
        }
        
        .dark .light-menu .ant-menu-item:hover .ant-menu-item-icon,
        .dark .light-menu .ant-menu-item:hover span {
          color: #ffffff !important;
        }
        
        /* 深色模式下的侧边栏整体样式 */
        .dark .layout-sider {
          background-color: #1f2937 !important;
        }
        
        .dark .layout-sider .ant-layout-sider-children {
          background-color: #1f2937 !important;
        }
        
        /* 用户按钮响应式样式 */
        @media (max-width: 768px) {
          .user-profile-button {
            padding: 2px 6px !important;
            gap: 4px !important;
          }
          
          .user-profile-button .user-text {
            font-size: 12px !important;
          }
          
          .user-profile-button .ant-avatar {
            width: 28px !important;
            height: 28px !important;
            font-size: 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          .user-profile-button .user-text {
            display: none;
          }
          
          .user-profile-button {
            padding: 3px !important;
            min-width: 36px;
            justify-content: center;
          }
        }
      `}</style>
      
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={已折叠}
        className={`layout-sider light-sidebar bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl ${已折叠 ? 'collapsed' : ''}`}
        width={240}
        collapsedWidth={80}
        style={{
          height: '100vh',
          overflow: 'auto',
          backgroundColor: 'var(--bg-color)'
        }}
      >
        <div className="h-16 mx-5 mt-5 mb-4 flex items-center font-bold border-b-2 border-gray-200 dark:border-gray-600 pb-4"
             style={{
               justifyContent: 已折叠 ? 'center' : 'flex-start',
               fontSize: 已折叠 ? 16 : 18,
               color: 'var(--text-color)' // 使用CSS变量确保深色模式兼容
             }}>
          {已折叠 ? '🎓' : '🎓 教育AI中心'}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[位置.pathname]}
          items={菜单项}
          onClick={处理菜单点击}
          className="light-menu"
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: 12,
            padding: '0 8px'
          }}
        />
      </Sider>
      
      {/* 主内容区域 */}
      <div className="layout-content">
        {/* Header */}
        <Header className="layout-header px-6 bg-white dark:bg-dark-bg-primary flex items-center justify-between shadow-md dark:shadow-lg border-b border-gray-200 dark:border-dark-border-primary h-16">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={已折叠 ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => 设置已折叠(!已折叠)}
              className="text-base w-16 h-16 text-gray-800 dark:text-dark-text-primary hover:text-blue-600 dark:hover:text-blue-400"
            />
            <h1 className="m-0 text-xl text-blue-600 dark:text-blue-400 font-semibold">
              香港城市大学 - 教育AI中心
            </h1>
          </div>
          
          <Space size="middle" className="stagger-fade-in">
            <Tooltip title="全局搜索">
              <Button 
                type="text" 
                icon={<SearchOutlined className="icon-spin-hover" />} 
                onClick={() => 设置搜索可见(true)}
                className="hover-lift text-base text-gray-800 dark:text-dark-text-primary bg-gray-100 dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-border-primary rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              />
            </Tooltip>
            
            <AIInspirationButton />
            
            <Button 
              type="text" 
              icon={<FilePdfOutlined />} 
              className="hover-lift text-base text-gray-800 dark:text-dark-text-primary bg-gray-100 dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-border-primary rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />
            
            <Button 
              type="text" 
              icon={<BellOutlined />} 
              className="hover-lift text-base text-gray-800 dark:text-dark-text-primary bg-gray-100 dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-border-primary rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            />
            
            <Dropdown menu={{ items: 用户菜单项 }} placement="bottomRight">
              <div className="user-profile-button cursor-pointer flex items-center gap-1.5 text-gray-800 dark:text-dark-text-primary bg-gray-100 dark:bg-dark-bg-secondary px-2 py-1 rounded-md border border-gray-200 dark:border-dark-border-primary transition-all duration-200 text-sm font-normal hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Avatar 
                  icon={<UserOutlined />} 
                  size={32}
                  className="bg-blue-600 dark:bg-blue-500 text-white text-sm"
                />
                <span className="user-text text-sm leading-none whitespace-nowrap">
                  学生用户
                </span>
              </div>
            </Dropdown>
          </Space>
        </Header>
        
        {/* 内容区域 */}
        <div className="content-wrapper min-h-screen bg-white dark:bg-dark-bg-primary">
          <Outlet />
        </div>
        
        <GlobalSearch 
          visible={搜索可见} 
          onClose={() => 设置搜索可见(false)} 
        />
      </div>
    </div>
  );
};

export default MainLayout;