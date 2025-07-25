import React, { useState } from 'react';
import { Database, Trash2, RefreshCw, BarChart3, Network, Settings, Download, Upload } from 'lucide-react';
import { useGraph } from '../context/GraphContext';

export function ToolPanel() {
  const { graphData, clearGraph, optimizeGraph, exportGraph, importGraph } = useGraph();
  const [showStats, setShowStats] = useState(true);
  const [layoutAlgorithm, setLayoutAlgorithm] = useState('force');
  const [chargeStrength, setChargeStrength] = useState(-300);
  const [linkDistance, setLinkDistance] = useState(100);

  const handleClearGraph = () => {
    if (confirm('Are you sure you want to clear the entire graph? This action cannot be undone.')) {
      clearGraph();
    }
  };

  const handleOptimizeGraph = () => {
    optimizeGraph();
  };

  const handleImportGraph = () => {
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

  const getGraphStats = () => {
    if (!graphData) return null;

    const nodesByType = graphData.nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const relationshipsByType = graphData.edges.reduce((acc, edge) => {
      acc[edge.relationship] = (acc[edge.relationship] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgWeight = graphData.nodes.length > 0 
      ? graphData.nodes.reduce((sum, node) => sum + node.properties.weight, 0) / graphData.nodes.length
      : 0;

    const maxWeight = graphData.nodes.length > 0
      ? Math.max(...graphData.nodes.map(node => node.properties.weight))
      : 0;

    return {
      totalNodes: graphData.nodes.length,
      totalEdges: graphData.edges.length,
      nodesByType,
      relationshipsByType,
      avgWeight,
      maxWeight
    };
  };

  const stats = getGraphStats();

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Tools & Analytics</h2>
      
      {/* Graph Management */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Database className="h-4 w-4 mr-2" />
          Graph Management
        </h3>
        <div className="space-y-2">
          <button
            onClick={handleOptimizeGraph}
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Optimize Graph</span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleImportGraph}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
            <button
              onClick={exportGraph}
              className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
          <button
            onClick={handleClearGraph}
            className="w-full p-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Graph</span>
          </button>
        </div>
      </div>

      {/* Graph Statistics */}
      {showStats && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Graph Statistics
          </h3>
          {stats ? (
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-md p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{stats.totalNodes}</div>
                    <div className="text-xs text-gray-400">Nodes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.totalEdges}</div>
                    <div className="text-xs text-gray-400">Edges</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-600">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{stats.avgWeight.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Avg Weight</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{stats.maxWeight.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Max Weight</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-md p-3">
                <div className="text-sm font-medium text-gray-300 mb-2">Node Types</div>
                <div className="space-y-1">
                  {Object.entries(stats.nodesByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{
                            backgroundColor: 
                              type === 'person' ? '#3b82f6' :
                              type === 'organization' ? '#10b981' :
                              type === 'location' ? '#f59e0b' :
                              type === 'concept' ? '#8b5cf6' :
                              type === 'event' ? '#ef4444' :
                              '#6b7280'
                          }}
                        ></div>
                        {type}
                      </span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-md p-3">
                <div className="text-sm font-medium text-gray-300 mb-2">Top Relationships</div>
                <div className="space-y-1">
                  {Object.entries(stats.relationshipsByType)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-gray-400">{type.replace(/_/g, ' ')}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <Network className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No graph data available</p>
              <p className="text-sm">Process documents to see statistics</p>
            </div>
          )}
        </div>
      )}

      {/* Graph Settings */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </h3>
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-md p-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showStats}
                onChange={(e) => setShowStats(e.target.checked)}
                className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Show Statistics</span>
            </label>
          </div>
          
          <div className="bg-gray-800 rounded-md p-3">
            <div className="text-sm font-medium text-gray-300 mb-2">Layout Algorithm</div>
            <select 
              value={layoutAlgorithm}
              onChange={(e) => setLayoutAlgorithm(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="force">Force-directed</option>
              <option value="hierarchical">Hierarchical</option>
              <option value="circular">Circular</option>
            </select>
          </div>
          
          <div className="bg-gray-800 rounded-md p-3">
            <div className="text-sm font-medium text-gray-300 mb-3">Physics Settings</div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Charge Strength: {chargeStrength}
                </label>
                <input
                  type="range"
                  min="-1000"
                  max="0"
                  value={chargeStrength}
                  onChange={(e) => setChargeStrength(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Link Distance: {linkDistance}px
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={linkDistance}
                  onChange={(e) => setLinkDistance(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}