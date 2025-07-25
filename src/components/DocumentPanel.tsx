import React, { useState } from 'react';
import { FileText, Upload, Trash2, Eye, Plus } from 'lucide-react';
import { useGraph } from '../context/GraphContext';
import { DocumentProcessor } from '../utils/documentProcessor';

export function DocumentPanel() {
  const { addDocument, documents, removeDocument } = useGraph();
  const [processingText, setProcessingText] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTextProcess = async () => {
    if (!processingText.trim()) return;

    setIsProcessing(true);
    try {
      const processor = new DocumentProcessor();
      const result = await processor.processText(processingText);
      
      addDocument({
        id: Date.now().toString(),
        title: `Document ${documents.length + 1}`,
        content: processingText,
        processedAt: new Date(),
        entities: result.entities,
        relationships: result.relationships
      });
      
      setProcessingText('');
    } catch (error) {
      console.error('Failed to process document:', error);
      alert('Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setProcessingText(content);
      };
      reader.readAsText(file);
    }
  };

  const sampleTexts = [
    "John Smith works at Microsoft Corporation in Seattle. He founded a startup called TechVenture Inc. Microsoft acquired TechVenture in 2023. John graduated from Stanford University and knows Sarah Johnson who works at Google.",
    "Apple Inc. is headquartered in Cupertino, California. Tim Cook is the CEO of Apple. The company was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne. Apple competes with Samsung and Google in the smartphone market.",
    "The World Economic Forum meeting took place in Davos, Switzerland. Leaders from various organizations attended including representatives from Goldman Sachs, JPMorgan Chase, and Tesla. Elon Musk presented on sustainable energy solutions."
  ];

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Document Processing</h2>
      
      {/* Sample Texts */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Sample Texts
        </label>
        <div className="space-y-2">
          {sampleTexts.map((sample, index) => (
            <button
              key={index}
              onClick={() => setProcessingText(sample)}
              className="w-full text-left p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
            >
              Sample {index + 1}: {sample.substring(0, 60)}...
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Text Input
        </label>
        <textarea
          value={processingText}
          onChange={(e) => setProcessingText(e.target.value)}
          placeholder="Paste your text here to extract entities and relationships..."
          className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="mt-2 flex space-x-2">
          <button
            onClick={handleTextProcess}
            disabled={!processingText.trim() || isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Process Text</span>
              </>
            )}
          </button>
          <label className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 cursor-pointer transition-colors">
            <Upload className="h-4 w-4 inline mr-2" />
            Upload File
            <input
              type="file"
              accept=".txt,.md,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Processed Documents ({documents.length})</h3>
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`p-3 bg-gray-800 rounded-md border transition-colors ${
                selectedDocId === doc.id ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'
              } cursor-pointer`}
              onClick={() => setSelectedDocId(selectedDocId === doc.id ? null : doc.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{doc.title}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDocId(doc.id);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to remove this document?')) {
                        removeDocument(doc.id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {doc.entities.length} entities, {doc.relationships.length} relationships
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {new Date(doc.processedAt).toLocaleString()}
              </div>
              
              {selectedDocId === doc.id && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="mb-3">
                    <span className="text-xs font-medium text-gray-300">Content Preview:</span>
                    <div className="mt-1 p-2 bg-gray-700 rounded text-xs text-gray-300 max-h-20 overflow-y-auto">
                      {doc.content.substring(0, 200)}...
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-300">Entities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doc.entities.map((entity, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            entity.type === 'person' ? 'bg-blue-600' :
                            entity.type === 'organization' ? 'bg-green-600' :
                            entity.type === 'location' ? 'bg-yellow-600' :
                            entity.type === 'event' ? 'bg-red-600' :
                            entity.type === 'concept' ? 'bg-purple-600' :
                            'bg-gray-600'
                          }`}
                        >
                          {entity.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-300">Relationships:</span>
                    <div className="mt-1 space-y-1">
                      {doc.relationships.map((rel, index) => (
                        <div key={index} className="text-xs text-gray-400">
                          <span className="text-blue-400">{rel.source}</span> → 
                          <span className="text-gray-300 mx-1">{rel.relationship}</span> → 
                          <span className="text-green-400">{rel.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {documents.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No documents processed yet</p>
              <p className="text-sm">Add text above to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}