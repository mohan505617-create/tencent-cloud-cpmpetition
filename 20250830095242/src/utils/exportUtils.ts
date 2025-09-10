import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Note } from '../types/index';

// Markdown导出功能
export const exportToMarkdown = (notes: Note[], selectedNotes?: string[]): string => {
  const notesToExport = selectedNotes 
    ? notes.filter(note => selectedNotes.includes(note.id))
    : notes;

  let markdown = `# 个人学术档案导出\n\n`;
  markdown += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
  markdown += `导出笔记数量: ${notesToExport.length}\n\n`;
  markdown += `---\n\n`;

  notesToExport.forEach((note, index) => {
    markdown += `## ${index + 1}. ${note.title}\n\n`;
    markdown += `**创建时间:** ${new Date(note.createdAt).toLocaleString('zh-CN')}\n`;
    markdown += `**更新时间:** ${new Date(note.updatedAt).toLocaleString('zh-CN')}\n`;
    
    if (note.tags && note.tags.length > 0) {
      markdown += `**标签:** ${note.tags.map(tag => `#${tag}`).join(' ')}\n`;
    }
    
    markdown += `\n${note.content}\n\n`;
    markdown += `---\n\n`;
  });

  return markdown;
};

// 下载Markdown文件
export const downloadMarkdown = (notes: Note[], selectedNotes?: string[], filename?: string): void => {
  const markdown = exportToMarkdown(notes, selectedNotes);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  
  const link = window.document.createElement('a');
  link.href = url;
  link.download = filename || `学术档案_${new Date().toISOString().split('T')[0]}.md`;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// PDF导出功能
export const exportToPDF = async (notes: Note[], selectedNotes?: string[], filename?: string): Promise<void> => {
  const notesToExport = selectedNotes 
    ? notes.filter(note => selectedNotes.includes(note.id))
    : notes;

  // 创建临时容器
  const container = window.document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm'; // A4宽度
  container.style.padding = '20mm';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '12px';
  container.style.lineHeight = '1.6';
  
  // 生成HTML内容
  let htmlContent = `
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1890ff; padding-bottom: 20px;">
      <h1 style="color: #1890ff; margin: 0;">个人学术档案</h1>
      <p style="color: #666; margin: 10px 0;">香港城市大学 | City University of Hong Kong</p>
      <p style="color: #999; margin: 5px 0;">导出时间: ${new Date().toLocaleString('zh-CN')}</p>
      <p style="color: #999; margin: 5px 0;">笔记数量: ${notesToExport.length}</p>
    </div>
  `;

  notesToExport.forEach((note, index) => {
    htmlContent += `
      <div style="margin-bottom: 40px; page-break-inside: avoid;">
        <h2 style="color: #1890ff; border-bottom: 1px solid #e8e8e8; padding-bottom: 10px;">
          ${index + 1}. ${note.title}
        </h2>
        <div style="margin: 15px 0; color: #666; font-size: 11px;">
          <span>创建: ${new Date(note.createdAt).toLocaleString('zh-CN')}</span>
          <span style="margin-left: 20px;">更新: ${new Date(note.updatedAt).toLocaleString('zh-CN')}</span>
          ${note.tags && note.tags.length > 0 ? 
            `<span style="margin-left: 20px;">标签: ${note.tags.map(tag => `#${tag}`).join(' ')}</span>` 
            : ''
          }
        </div>
        <div style="white-space: pre-wrap; line-height: 1.8;">
          ${note.content.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  });

  container.innerHTML = htmlContent;
  window.document.body.appendChild(container);

  try {
    // 使用html2canvas生成图片
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // 创建PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4宽度
    const pageHeight = 297; // A4高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // 添加第一页
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，添加更多页面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 下载PDF
    pdf.save(filename || `学术档案_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('PDF导出失败:', error);
    throw new Error('PDF导出失败，请重试');
  } finally {
    // 清理临时容器
    window.document.body.removeChild(container);
  }
};

// JSON备份导出
export const exportToJSON = (notes: Note[], backlinks?: any[], filename?: string): void => {
  const exportData = {
    exportInfo: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      source: '香港城市大学个人学术档案系统'
    },
    notes: notes,
    backlinks: backlinks || [],
    statistics: {
      totalNotes: notes.length,
      totalTags: [...new Set(notes.flatMap(note => note.tags || []))].length,
      totalWords: notes.reduce((sum, note) => sum + note.content.length, 0)
    }
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json;charset=utf-8' 
  });
  const url = window.URL.createObjectURL(blob);
  
  const link = window.document.createElement('a');
  link.href = url;
  link.download = filename || `学术档案备份_${new Date().toISOString().split('T')[0]}.json`;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// 批量导出选项
export interface ExportOptions {
  format: 'markdown' | 'pdf' | 'json';
  selectedNotes?: string[];
  filename?: string;
  includeMetadata?: boolean;
  includeBacklinks?: boolean;
}

export const batchExport = async (
  notes: Note[], 
  options: ExportOptions, 
  backlinks?: any[]
): Promise<void> => {
  try {
    switch (options.format) {
      case 'markdown':
        downloadMarkdown(notes, options.selectedNotes, options.filename);
        break;
      case 'pdf':
        await exportToPDF(notes, options.selectedNotes, options.filename);
        break;
      case 'json':
        exportToJSON(notes, backlinks, options.filename);
        break;
      default:
        throw new Error('不支持的导出格式');
    }
  } catch (error) {
    console.error('导出失败:', error);
    throw error;
  }
};