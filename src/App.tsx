import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DocumentPanel } from './components/DocumentPanel';
import { GraphVisualization } from './components/GraphVisualization';
import { QueryPanel } from './components/QueryPanel';
import { ToolPanel } from './components/ToolPanel';
import { GraphProvider } from './context/GraphContext';
import { Node, Edge, GraphData } from './types/graph';

function App() {
  const [activeTab, setActiveTab] = useState<'document' | 'query' | 'tools'>('document');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleNodeSelect = useCallback((node: Node | null) => {
    setSelectedNode(node);
  }, []);

  return (
    <GraphProvider>
      <div className="h-screen bg-gray-900 text-white flex flex-col">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          <div className="w-80 border-r border-gray-700 flex flex-col">
            <div className="border-b border-gray-700">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('document')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'document'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('query')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'query'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Query
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'tools'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Tools
                </button>
              </nav>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {activeTab === 'document' && <DocumentPanel />}
              {activeTab === 'query' && <QueryPanel />}
              {activeTab === 'tools' && <ToolPanel />}
            </div>
          </div>

          {/* Right Panel - Graph Visualization */}
          <div className="flex-1 relative">
            <GraphVisualization 
              selectedNode={selectedNode}
              onNodeSelect={handleNodeSelect}
            />
          </div>
        </div>
      </div>
    </GraphProvider>
  );
}

export default App;