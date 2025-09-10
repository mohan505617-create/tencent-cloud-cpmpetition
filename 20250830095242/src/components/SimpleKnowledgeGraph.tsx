import React, { useEffect, useRef } from 'react';
import { Card, Typography, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Note } from '../types/index';

const { Title } = Typography;

interface SimpleKnowledgeGraphProps {
  notes: Note[];
  activeNote: Note | null;
  onClose: () => void;
}

const SimpleKnowledgeGraph: React.FC<SimpleKnowledgeGraphProps> = ({
  notes = [],
  activeNote,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !notes || notes.length === 0) return;

    // 清空容器
    containerRef.current.innerHTML = '';

    // 创建简单的SVG图形
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.style.background = '#f8f9fa';
    svg.style.borderRadius = '8px';

    // 安全处理笔记数据
    const safeNotes = Array.isArray(notes) ? notes : [];
    const maxNodes = Math.min(safeNotes.length, 10); // 限制节点数量

    // 计算节点位置
    const centerX = 300;
    const centerY = 200;
    const radius = 120;

    safeNotes.slice(0, maxNodes).forEach((note, index) => {
      if (!note || !note.id || !note.title) return;

      const angle = (index / maxNodes) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // 创建节点圆圈
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '20');
      circle.setAttribute('fill', activeNote?.id === note.id ? '#1890ff' : '#52c41a');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '2');
      circle.style.cursor = 'pointer';

      // 添加点击事件
      circle.addEventListener('click', () => {
        // 这里暂时不处理点击，避免错误
        console.log('节点被点击:', note.title);
      });

      // 创建文本标签
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x.toString());
      text.setAttribute('y', (y + 35).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#333');
      text.textContent = note.title.length > 8 ? note.title.substring(0, 8) + '...' : note.title;

      svg.appendChild(circle);
      svg.appendChild(text);
    });

    // 添加中心节点
    if (activeNote) {
      const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      centerCircle.setAttribute('cx', centerX.toString());
      centerCircle.setAttribute('cy', centerY.toString());
      centerCircle.setAttribute('r', '25');
      centerCircle.setAttribute('fill', '#ff4d4f');
      centerCircle.setAttribute('stroke', '#fff');
      centerCircle.setAttribute('stroke-width', '3');

      const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      centerText.setAttribute('x', centerX.toString());
      centerText.setAttribute('y', (centerY - 35).toString());
      centerText.setAttribute('text-anchor', 'middle');
      centerText.setAttribute('font-size', '14');
      centerText.setAttribute('font-weight', 'bold');
      centerText.setAttribute('fill', '#333');
      centerText.textContent = '当前笔记';

      svg.appendChild(centerCircle);
      svg.appendChild(centerText);
    }

    containerRef.current.appendChild(svg);
  }, [notes, activeNote]);

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>知识图谱</Title>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose}
            size="small"
          />
        </div>
      }
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        width: '600px',
        height: '500px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
      styles={{
        body: { padding: '16px', height: '400px', overflow: 'hidden' }
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        {(!notes || notes.length === 0) && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#999'
          }}>
            暂无笔记数据
          </div>
        )}
      </div>
    </Card>
  );
};

export default SimpleKnowledgeGraph;