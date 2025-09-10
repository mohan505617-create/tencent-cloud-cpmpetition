import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Preview = ({ content, onWikiLinkClick, isMobile }) => {
  // 处理Wiki链接
  const processWikiLinks = (text) => {
    if (!text) return text;
    return text.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
      return `<span class="wiki-link" data-link="${linkText}">${linkText}</span>`;
    });
  };

  // 处理Wiki链接点击
  const handleClick = (e) => {
    if (e.target.classList.contains('wiki-link')) {
      const linkText = e.target.getAttribute('data-link');
      if (onWikiLinkClick) {
        onWikiLinkClick(linkText);
      }
    }
  };

  if (!content) {
    return (
      <div className="preview-empty">
        <EyeOutlined className="empty-icon" />
        <Title level={4} className="empty-title">预览区域</Title>
        <p className="empty-description">
          在左侧编辑器中输入内容，这里会实时显示 Markdown 渲染效果。
          <br />
          使用 [[笔记标题]] 创建双向链接。
        </p>
      </div>
    );
  }

  const processedContent = processWikiLinks(content);

  return (
    <div className={`preview ${isMobile ? 'mobile' : ''}`} onClick={handleClick}>
      <div className="preview-header">
        <Title level={5} className="preview-title">
          <EyeOutlined /> 预览
        </Title>
      </div>
      
      <div className="preview-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
            h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
            h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
            h4: ({ children }) => <h4 className="markdown-h4">{children}</h4>,
            h5: ({ children }) => <h5 className="markdown-h5">{children}</h5>,
            h6: ({ children }) => <h6 className="markdown-h6">{children}</h6>,
            p: ({ children }) => <p className="markdown-p">{children}</p>,
            ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
            ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
            li: ({ children }) => <li className="markdown-li">{children}</li>,
            blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
            code: ({ inline, children }) => 
              inline ? 
                <code className="markdown-code-inline">{children}</code> : 
                <code className="markdown-code-block">{children}</code>,
            pre: ({ children }) => <pre className="markdown-pre">{children}</pre>,
            table: ({ children }) => <table className="markdown-table">{children}</table>,
            thead: ({ children }) => <thead className="markdown-thead">{children}</thead>,
            tbody: ({ children }) => <tbody className="markdown-tbody">{children}</tbody>,
            tr: ({ children }) => <tr className="markdown-tr">{children}</tr>,
            th: ({ children }) => <th className="markdown-th">{children}</th>,
            td: ({ children }) => <td className="markdown-td">{children}</td>,
            a: ({ href, children }) => <a href={href} className="markdown-link" target="_blank" rel="noopener noreferrer">{children}</a>,
            img: ({ src, alt }) => <img src={src} alt={alt} className="markdown-img" />,
            hr: () => <hr className="markdown-hr" />,
            strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
            em: ({ children }) => <em className="markdown-em">{children}</em>,
            del: ({ children }) => <del className="markdown-del">{children}</del>
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Preview;