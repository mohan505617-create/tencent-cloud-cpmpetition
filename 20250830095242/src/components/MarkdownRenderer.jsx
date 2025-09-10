import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useDocuments } from '../contexts/DocumentContext';

const MarkdownRenderer = ({ content, onLinkClick }) => {
  const { documents } = useDocuments();

  // 处理双链接 [[文档标题]]
  const processWikiLinks = (text) => {
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = wikiLinkRegex.exec(text)) !== null) {
      // 添加链接前的文本
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const linkText = match[1];
      const linkedDocument = documents.find(doc => 
        doc.title.toLowerCase() === linkText.toLowerCase()
      );

      if (linkedDocument) {
        parts.push(
          <span
            key={match.index}
            className="wiki-link"
            onClick={() => onLinkClick(linkedDocument)}
          >
            {linkText}
          </span>
        );
      } else {
        parts.push(
          <span
            key={match.index}
            className="text-gray-400 cursor-not-allowed"
            title="文档不存在"
          >
            {linkText}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // 添加剩余的文本
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 1 ? parts : text;
  };

  const components = {
    // 自定义文本渲染以支持双链接
    p: ({ children }) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return processWikiLinks(child);
        }
        return child;
      });
      
      return <p className="mb-4 text-gray-700 leading-relaxed">{processedChildren}</p>;
    },
    
    // 自定义标题样式
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium text-gray-700 mb-3 mt-6">
        {children}
      </h3>
    ),
    
    // 自定义代码块样式
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code 
            className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    
    pre: ({ children }) => (
      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),
    
    // 自定义引用样式
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-400 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">
        {children}
      </blockquote>
    ),
    
    // 自定义列表样式
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
        {children}
      </ol>
    ),
    
    // 自定义链接样式
    a: ({ href, children }) => (
      <a 
        href={href}
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    
    // 自定义表格样式
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-200 rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="bg-gray-50 border-b border-gray-200 px-4 py-2 text-left font-semibold text-gray-700">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-gray-100 px-4 py-2 text-gray-700">
        {children}
      </td>
    ),
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;