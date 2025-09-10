import React from 'react';
import { Empty, Typography } from 'antd';
import { BookOpenIcon, CalendarIcon, TagIcon } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

const { Title, Text } = Typography;

const DocumentViewer = ({ document, onDocumentSelect }) => {
  if (!document) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                欢迎使用知识管理工具
              </h3>
              <p className="text-gray-400">
                从左侧选择一个文档开始阅读
              </p>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 文档头部 */}
      <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpenIcon className="w-5 h-5 text-blue-500" />
              <Title level={2} className="!mb-0 !text-gray-800">
                {document.title}
              </Title>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>创建于 {document.createdAt}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>更新于 {document.updatedAt}</span>
              </div>
            </div>

            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center space-x-2 mt-3">
                <TagIcon className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 文档内容 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <MarkdownRenderer 
            content={document.content} 
            onLinkClick={onDocumentSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;