import React from 'react';
import { Brain, Download, Upload, Settings } from 'lucide-react';
import { useGraph } from '../context/GraphContext';

export function Header() {
  const { exportGraph, importGraph } = useGraph();

  const handleExport = () => {
    exportGraph();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            importGraph(data);
          } catch (error) {
            console.error('Failed to import graph:', error);
            alert('Failed to import graph. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <Brain className="h-8 w-8 text-blue-400" />
        <h1 className="text-xl font-bold text-white">GraphMind</h1>
        <span className="text-sm text-gray-400">Knowledge Graph Builder</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={handleImport}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          title="Import Graph"
        >
          <Upload className="h-5 w-5" />
        </button>
        <button
          onClick={handleExport}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          title="Export Graph"
        >
          <Download className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}