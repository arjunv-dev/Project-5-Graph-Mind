import React, { useState } from 'react';
import { Play, History, BookOpen, Copy, Download } from 'lucide-react';
import { useGraph } from '../context/GraphContext';
import { CypherQueryEngine } from '../utils/cypherQueryEngine';

export function QueryPanel() {
  const { graphData } = useGraph();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryEngine = new CypherQueryEngine();

  const handleRunQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryEngine.executeQuery(query, graphData);
      setResults(result);
      setQueryHistory(prev => [query, ...prev.slice(0, 9)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleRunQuery();
    }
  };

  const copyResults = () => {
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'query-results.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exampleQueries = [
    'MATCH (n) RETURN n LIMIT 10',
    'MATCH (n:person) RETURN n.label, n.properties',
    'MATCH (a)-[r]->(b) RETURN a.label, r.relationship, b.label',
    'MATCH (n) WHERE n.type = "organization" RETURN n',
    'MATCH (n) WHERE n.properties.weight > 1 RETURN n ORDER BY n.properties.weight DESC',
    'MATCH (n:person)-[r:works_for]->(o:organization) RETURN n.label, o.label',
    'MATCH (n) WHERE n.label CONTAINS "John" RETURN n',
    'MATCH (n)-[r]->(m) WHERE r.relationship = "founded" RETURN n.label, m.label'
  ];

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Query Interface</h2>
      
      {/* Query Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Cypher Query
        </label>
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your Cypher query here... (Ctrl+Enter to run)"
            className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          />
          <button
            onClick={handleRunQuery}
            disabled={!query.trim() || isLoading}
            className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            title="Run Query (Ctrl+Enter)"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Example Queries */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          Example Queries
        </h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="w-full text-left p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-mono text-gray-300 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Query History */}
      {queryHistory.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <History className="h-4 w-4 mr-2" />
            Query History
          </h3>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {queryHistory.map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => setQuery(historyQuery)}
                className="w-full text-left p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-mono text-gray-300 transition-colors truncate"
              >
                {historyQuery}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-300">Results</h3>
          {results.length > 0 && (
            <div className="flex space-x-1">
              <button
                onClick={copyResults}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Copy Results"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={exportResults}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Export Results"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="bg-gray-800 rounded-md p-3 min-h-32">
          {isLoading ? (
            <div className="text-center text-gray-400">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Executing query...
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm">
              <div className="font-medium mb-1">Error:</div>
              <div className="bg-red-900/20 p-2 rounded border border-red-800">{error}</div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-400 mb-2">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              {results.map((result, index) => (
                <div key={index} className="p-3 bg-gray-700 rounded text-sm border border-gray-600">
                  <div className="text-xs text-gray-400 mb-1">Result {index + 1}:</div>
                  <pre className="text-gray-300 whitespace-pre-wrap text-xs overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results</p>
              <p className="text-sm">Run a query to see results here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}