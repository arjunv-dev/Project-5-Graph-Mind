import { GraphData, Node, Edge } from '../types/graph';

export class CypherQueryEngine {
  async executeQuery(query: string, graphData: GraphData): Promise<any[]> {
    const normalizedQuery = query.trim().toLowerCase();
    
    try {
      if (normalizedQuery.startsWith('match')) {
        return this.executeMatchQuery(normalizedQuery, graphData);
      }
      
      throw new Error('Unsupported query type. Only MATCH queries are supported.');
    } catch (error) {
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private executeMatchQuery(query: string, graphData: GraphData): any[] {
    // Parse simple MATCH queries
    if (query.includes('match (n)')) {
      // MATCH (n) RETURN n - return all nodes
      if (query.includes('return n')) {
        const limitMatch = query.match(/limit\s+(\d+)/);
        const limit = limitMatch ? parseInt(limitMatch[1]) : undefined;
        
        let nodes = graphData.nodes;
        if (limit) {
          nodes = nodes.slice(0, limit);
        }
        
        return nodes.map(node => ({ n: node }));
      }
    }
    
    // MATCH (n:type) - match nodes by type
    const typeMatch = query.match(/match\s+\(n:(\w+)\)/);
    if (typeMatch) {
      const nodeType = typeMatch[1];
      const matchingNodes = graphData.nodes.filter(node => 
        node.type.toLowerCase() === nodeType.toLowerCase()
      );
      
      if (query.includes('return n.label')) {
        return matchingNodes.map(node => ({ 
          'n.label': node.label,
          'n.properties': node.properties 
        }));
      }
      
      return matchingNodes.map(node => ({ n: node }));
    }
    
    // MATCH (a)-[r]->(b) - match relationships
    if (query.includes('(a)-[r]->(b)')) {
      const relationships = graphData.edges.map(edge => {
        const sourceNode = graphData.nodes.find(n => n.id === edge.source);
        const targetNode = graphData.nodes.find(n => n.id === edge.target);
        
        return {
          'a.label': sourceNode?.label || 'Unknown',
          'r.relationship': edge.relationship,
          'b.label': targetNode?.label || 'Unknown'
        };
      });
      
      return relationships;
    }

    // MATCH (n:person)-[r:relationship]->(o:organization)
    const specificRelationMatch = query.match(/match\s+\((\w+):(\w+)\)-\[(\w+):(\w+)\]->\((\w+):(\w+)\)/);
    if (specificRelationMatch) {
      const [, sourceVar, sourceType, relVar, relType, targetVar, targetType] = specificRelationMatch;
      
      const results: any[] = [];
      
      graphData.edges.forEach(edge => {
        if (edge.relationship === relType) {
          const sourceNode = graphData.nodes.find(n => n.id === edge.source && n.type === sourceType);
          const targetNode = graphData.nodes.find(n => n.id === edge.target && n.type === targetType);
          
          if (sourceNode && targetNode) {
            const result: any = {};
            result[`${sourceVar}.label`] = sourceNode.label;
            result[`${targetVar}.label`] = targetNode.label;
            results.push(result);
          }
        }
      });
      
      return results;
    }
    
    // WHERE clauses
    if (query.includes('where')) {
      const whereMatch = query.match(/where\s+([^)]+?)(?:\s+return|\s+order|\s+limit|$)/);
      if (whereMatch) {
        const condition = whereMatch[1];
        
        // n.type = "value"
        const typeCondition = condition.match(/n\.type\s*=\s*"([^"]+)"/);
        if (typeCondition) {
          const targetType = typeCondition[1];
          let filteredNodes = graphData.nodes.filter(node => 
            node.type.toLowerCase() === targetType.toLowerCase()
          );
          
          // ORDER BY
          if (query.includes('order by n.properties.weight desc')) {
            filteredNodes.sort((a, b) => b.properties.weight - a.properties.weight);
          }
          
          return filteredNodes.map(node => ({ n: node }));
        }
        
        // n.properties.weight > value
        const weightCondition = condition.match(/n\.properties\.weight\s*>\s*(\d+(?:\.\d+)?)/);
        if (weightCondition) {
          const minWeight = parseFloat(weightCondition[1]);
          let filteredNodes = graphData.nodes.filter(node => 
            node.properties.weight > minWeight
          );
          
          // ORDER BY
          if (query.includes('order by n.properties.weight desc')) {
            filteredNodes.sort((a, b) => b.properties.weight - a.properties.weight);
          }
          
          return filteredNodes.map(node => ({ n: node }));
        }

        // n.label CONTAINS "value"
        const containsCondition = condition.match(/n\.label\s+contains\s+"([^"]+)"/i);
        if (containsCondition) {
          const searchTerm = containsCondition[1].toLowerCase();
          const filteredNodes = graphData.nodes.filter(node => 
            node.label.toLowerCase().includes(searchTerm)
          );
          
          return filteredNodes.map(node => ({ n: node }));
        }
      }
    }

    // MATCH (n)-[r]->(m) WHERE r.relationship = "value"
    if (query.includes('(n)-[r]->(m)') && query.includes('where')) {
      const relationshipCondition = query.match(/r\.relationship\s*=\s*"([^"]+)"/);
      if (relationshipCondition) {
        const targetRelationship = relationshipCondition[1];
        const results: any[] = [];
        
        graphData.edges.forEach(edge => {
          if (edge.relationship === targetRelationship) {
            const sourceNode = graphData.nodes.find(n => n.id === edge.source);
            const targetNode = graphData.nodes.find(n => n.id === edge.target);
            
            if (sourceNode && targetNode) {
              results.push({
                'n.label': sourceNode.label,
                'm.label': targetNode.label
              });
            }
          }
        });
        
        return results;
      }
    }
    
    // Default fallback
    return [];
  }
}