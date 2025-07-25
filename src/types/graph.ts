export interface Node {
  id: string;
  label: string;
  type: string;
  properties: {
    weight: number;
    source: string;
    description?: string;
    [key: string]: any;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  properties: {
    weight: number;
    source: string;
    [key: string]: any;
  };
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface Entity {
  name: string;
  type: string;
  confidence?: number;
  description?: string;
}

export interface Relationship {
  source: string;
  target: string;
  relationship: string;
  confidence?: number;
}

export interface ProcessedDocument {
  id: string;
  title: string;
  content: string;
  processedAt: Date;
  entities: Entity[];
  relationships: Relationship[];
}