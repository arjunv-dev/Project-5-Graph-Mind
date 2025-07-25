import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { GraphData, Node, Edge, ProcessedDocument } from '../types/graph';

interface GraphState {
  graphData: GraphData;
  documents: ProcessedDocument[];
}

interface GraphContextType extends GraphState {
  addDocument: (doc: ProcessedDocument) => void;
  removeDocument: (docId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  clearGraph: () => void;
  optimizeGraph: () => void;
  exportGraph: () => void;
  importGraph: (data: GraphData) => void;
}

const GraphContext = createContext<GraphContextType | null>(null);

type GraphAction = 
  | { type: 'ADD_DOCUMENT'; payload: ProcessedDocument }
  | { type: 'REMOVE_DOCUMENT'; payload: string }
  | { type: 'UPDATE_NODE'; payload: { nodeId: string; updates: Partial<Node> } }
  | { type: 'UPDATE_EDGE'; payload: { edgeId: string; updates: Partial<Edge> } }
  | { type: 'CLEAR_GRAPH' }
  | { type: 'OPTIMIZE_GRAPH' }
  | { type: 'IMPORT_GRAPH'; payload: GraphData };

const initialState: GraphState = {
  graphData: { nodes: [], edges: [] },
  documents: []
};

function graphReducer(state: GraphState, action: GraphAction): GraphState {
  switch (action.type) {
    case 'ADD_DOCUMENT': {
      const doc = action.payload;
      const existingNodeMap = new Map(state.graphData.nodes.map(n => [n.label.toLowerCase(), n]));
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      // Process entities
      doc.entities.forEach(entity => {
        const nodeId = `${doc.id}-${entity.name}`;
        const existingNode = existingNodeMap.get(entity.name.toLowerCase());
        
        if (existingNode) {
          // Update existing node weight
          existingNode.properties.weight += entity.confidence || 1;
        } else {
          // Create new node
          const newNode: Node = {
            id: nodeId,
            label: entity.name,
            type: entity.type,
            properties: {
              weight: entity.confidence || 1,
              source: doc.id,
              description: entity.description || ''
            }
          };
          newNodes.push(newNode);
          existingNodeMap.set(entity.name.toLowerCase(), newNode);
        }
      });

      // Process relationships
      doc.relationships.forEach(rel => {
        const sourceNode = existingNodeMap.get(rel.source.toLowerCase());
        const targetNode = existingNodeMap.get(rel.target.toLowerCase());
        
        if (sourceNode && targetNode) {
          newEdges.push({
            id: `${doc.id}-${rel.source}-${rel.target}-${rel.relationship}`,
            source: sourceNode.id,
            target: targetNode.id,
            relationship: rel.relationship,
            properties: {
              weight: rel.confidence || 1,
              source: doc.id
            }
          });
        }
      });

      return {
        ...state,
        documents: [...state.documents, doc],
        graphData: {
          nodes: [...state.graphData.nodes, ...newNodes],
          edges: [...state.graphData.edges, ...newEdges]
        }
      };
    }

    case 'REMOVE_DOCUMENT': {
      const docId = action.payload;
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== docId),
        graphData: {
          nodes: state.graphData.nodes.filter(node => node.properties.source !== docId),
          edges: state.graphData.edges.filter(edge => edge.properties.source !== docId)
        }
      };
    }

    case 'UPDATE_NODE': {
      const { nodeId, updates } = action.payload;
      return {
        ...state,
        graphData: {
          ...state.graphData,
          nodes: state.graphData.nodes.map(node =>
            node.id === nodeId ? { ...node, ...updates } : node
          )
        }
      };
    }

    case 'UPDATE_EDGE': {
      const { edgeId, updates } = action.payload;
      return {
        ...state,
        graphData: {
          ...state.graphData,
          edges: state.graphData.edges.map(edge =>
            edge.id === edgeId ? { ...edge, ...updates } : edge
          )
        }
      };
    }

    case 'CLEAR_GRAPH': {
      return {
        ...state,
        graphData: { nodes: [], edges: [] },
        documents: []
      };
    }

    case 'OPTIMIZE_GRAPH': {
      // Remove nodes with very low weight and isolated nodes
      const connectedNodeIds = new Set([
        ...state.graphData.edges.map(e => e.source),
        ...state.graphData.edges.map(e => e.target)
      ]);
      
      const optimizedNodes = state.graphData.nodes.filter(node => 
        node.properties.weight > 0.5 && connectedNodeIds.has(node.id)
      );
      
      const optimizedEdges = state.graphData.edges.filter(edge =>
        optimizedNodes.some(n => n.id === edge.source) &&
        optimizedNodes.some(n => n.id === edge.target)
      );

      return {
        ...state,
        graphData: {
          nodes: optimizedNodes,
          edges: optimizedEdges
        }
      };
    }

    case 'IMPORT_GRAPH': {
      return {
        ...state,
        graphData: action.payload
      };
    }

    default:
      return state;
  }
}

export function GraphProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(graphReducer, initialState);

  const addDocument = useCallback((doc: ProcessedDocument) => {
    dispatch({ type: 'ADD_DOCUMENT', payload: doc });
  }, []);

  const removeDocument = useCallback((docId: string) => {
    dispatch({ type: 'REMOVE_DOCUMENT', payload: docId });
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
    dispatch({ type: 'UPDATE_NODE', payload: { nodeId, updates } });
  }, []);

  const updateEdge = useCallback((edgeId: string, updates: Partial<Edge>) => {
    dispatch({ type: 'UPDATE_EDGE', payload: { edgeId, updates } });
  }, []);

  const clearGraph = useCallback(() => {
    dispatch({ type: 'CLEAR_GRAPH' });
  }, []);

  const optimizeGraph = useCallback(() => {
    dispatch({ type: 'OPTIMIZE_GRAPH' });
  }, []);

  const exportGraph = useCallback(() => {
    const dataStr = JSON.stringify(state.graphData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'graphmind-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [state.graphData]);

  const importGraph = useCallback((data: GraphData) => {
    dispatch({ type: 'IMPORT_GRAPH', payload: data });
  }, []);

  return (
    <GraphContext.Provider value={{
      ...state,
      addDocument,
      removeDocument,
      updateNode,
      updateEdge,
      clearGraph,
      optimizeGraph,
      exportGraph,
      importGraph
    }}>
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}