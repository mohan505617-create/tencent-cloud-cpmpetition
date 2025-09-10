import React from 'react';
import { Layout, Space, Typography, Switch, Divider } from 'antd';
import { GithubOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

interface FooterProps {
  darkMode?: boolean;
  onThemeChange?: (dark: boolean) => void;
}

const Footer: React.FC<FooterProps> = ({ darkMode = false, onThemeChange }) => {
  return (
    <AntFooter className="app-footer">
      <div className="footer-content">
        {/* 香港城市大学信息 */}
        <div className="university-section">
          <div className="university-logo">
            <img 
              src="https://www.cityu.edu.hk/sites/g/files/asqsls4856/files/2021-09/CityU_HK_Logo_2015_Eng.png" 
              alt="香港城市大学"
              className="cityu-logo"
              onError={(e) => {
                // 如果图片加载失败，显示文字
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="logo-text">香港城市大学<br/>City University of Hong Kong</div>';
                }
              }}
            />
          </div>
          <div className="university-info">
            <Text strong>个人学术档案管理系统</Text>
            <br />
            <Text type="secondary">Personal Academic Portfolio Management</Text>
            <br />
            <Text type="secondary">香港城市大学 | City University of Hong Kong</Text>
          </div>
        </div>

        <Divider />

        {/* 功能链接 */}
        <div className="footer-links">
          <Space size="large" wrap>
            <Link href="#" onClick={(e) => e.preventDefault()}>
              <GlobalOutlined /> 学术资源
            </Link>
            <Link href="#" onClick={(e) => e.preventDefault()}>
              <MailOutlined /> 联系支持
            </Link>
            <Link href="https://github.com" target="_blank">
              <GithubOutlined /> 开源项目
            </Link>
          </Space>
        </div>

        {/* 主题切换 */}
        <div className="theme-section">
          <Space>
            <Text>深色模式:</Text>
            <Switch 
              checked={darkMode}
              onChange={onThemeChange}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
          </Space>
        </div>

        <Divider />

        {/* 版权信息 */}
        <div className="copyright">
          <Text type="secondary">
            © 2024 香港城市大学个人知识管理系统 | 
            为学术研究和知识管理而设计 | 
            版本 1.0.0
          </Text>
        </div>
      </div>

      <style>{`
        .app-footer {
          background: ${darkMode ? '#001529' : '#f0f2f5'};
          border-top: 1px solid ${darkMode ? '#303030' : '#d9d9d9'};
          margin-top: auto;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }
        
        .university-section {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .cityu-logo {
          height: 60px;
          width: auto;
        }
        
        .logo-text {
          font-weight: bold;
          color: ${darkMode ? '#fff' : '#1890ff'};
          text-align: center;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .footer-links {
          display: flex;
          justify-content: center;
          margin: 16px 0;
        }
        
        .theme-section {
          display: flex;
          justify-content: center;
          margin: 16px 0;
        }
        
        .copyright {
          text-align: center;
          margin-top: 16px;
        }
        
        @media (max-width: 768px) {
          .university-section {
            flex-direction: column;
            text-align: center;
          }
          
          .footer-links {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </AntFooter>
  );
};

export default Footer;