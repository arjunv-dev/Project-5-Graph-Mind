import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useGraph } from '../context/GraphContext';
import { Node, Edge } from '../types/graph';
import { ZoomIn, ZoomOut, Maximize2, Filter, Eye, EyeOff } from 'lucide-react';

interface GraphVisualizationProps {
  selectedNode: Node | null;
  onNodeSelect: (node: Node | null) => void;
}

export function GraphVisualization({ selectedNode, onNodeSelect }: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { graphData, updateNode, updateEdge } = useGraph();
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (!svgRef.current || !graphData) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll('*').remove();

    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    const container = svg.append('g');

    // Create arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#64748b');

    // Filter nodes and edges
    const filteredNodes = filterType === 'all' ? graphData.nodes : 
      graphData.nodes.filter(node => node.type === filterType);
    const filteredEdges = graphData.edges.filter(edge =>
      filteredNodes.some(n => n.id === edge.source) &&
      filteredNodes.some(n => n.id === edge.target)
    );

    if (filteredNodes.length === 0) {
      // Show empty state
      container.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#6b7280')
        .attr('font-size', '18px')
        .text('No graph data available');
      
      container.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2 + 30)
        .attr('text-anchor', 'middle')
        .attr('fill', '#6b7280')
        .attr('font-size', '14px')
        .text('Process some documents to see the knowledge graph');
      
      return;
    }

    // Create force simulation
    const simulation = d3.forceSimulation(filteredNodes as any)
      .force('link', d3.forceLink(filteredEdges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create edges
    const link = container.selectAll('.link')
      .data(filteredEdges)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .style('opacity', 0.7);

    // Create edge labels
    const edgeLabels = container.selectAll('.edge-label')
      .data(filteredEdges)
      .enter().append('text')
      .attr('class', 'edge-label')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8')
      .style('opacity', showLabels ? 0.8 : 0)
      .text(d => d.relationship);

    // Create nodes
    const node = container.selectAll('.node')
      .data(filteredNodes)
      .enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => Math.max(15, Math.min(30, d.properties.weight * 8)))
      .attr('fill', d => {
        const colors = {
          person: '#3b82f6',
          organization: '#10b981',
          location: '#f59e0b',
          concept: '#8b5cf6',
          event: '#ef4444',
          default: '#6b7280'
        };
        return colors[d.type as keyof typeof colors] || colors.default;
      })
      .attr('stroke', d => selectedNode?.id === d.id ? '#ffffff' : 'none')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.max(18, Math.min(35, d.properties.weight * 8 + 3)));
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.max(15, Math.min(30, d.properties.weight * 8)));
      });

    // Add labels to nodes
    const labels = node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '11px')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .style('opacity', showLabels ? 1 : 0)
      .style('font-weight', '500')
      .text(d => {
        const maxLength = 12;
        return d.label.length > maxLength ? d.label.substring(0, maxLength) + '...' : d.label;
      });

    // Add click handler
    node.on('click', (event, d) => {
      onNodeSelect(selectedNode?.id === d.id ? null : d);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      edgeLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [graphData, selectedNode, showLabels, filterType]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.5
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.67
    );
  };

  const handleFitToScreen = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
  };

  const nodeTypes = ['all', 'person', 'organization', 'location', 'concept', 'event'];

  return (
    <div className="h-full relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 shadow-lg">
          <div className="flex space-x-2">
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleFitToScreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Fit to Screen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 shadow-lg">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {nodeTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 shadow-lg">
          <label className="flex items-center space-x-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <span className="text-sm text-gray-300">Labels</span>
          </label>
        </div>
      </div>

      {/* Status */}
      <div className="absolute top-4 right-4 z-10 bg-gray-800 rounded-lg p-3 border border-gray-600 shadow-lg">
        <div className="text-sm text-gray-300 space-y-1">
          <div>Zoom: {(zoom * 100).toFixed(0)}%</div>
          <div>Nodes: {graphData?.nodes.length || 0}</div>
          <div>Edges: {graphData?.edges.length || 0}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-gray-800 rounded-lg p-3 border border-gray-600 shadow-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Node Types</h4>
        <div className="space-y-1">
          {[
            { type: 'person', color: '#3b82f6', label: 'Person' },
            { type: 'organization', color: '#10b981', label: 'Organization' },
            { type: 'location', color: '#f59e0b', label: 'Location' },
            { type: 'concept', color: '#8b5cf6', label: 'Concept' },
            { type: 'event', color: '#ef4444', label: 'Event' }
          ].map(({ type, color, label }) => (
            <div key={type} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph SVG */}
      <svg
        ref={svgRef}
        className="w-full h-full bg-gray-900"
        style={{ cursor: 'grab' }}
      />

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 bg-gray-800 rounded-lg p-4 border border-gray-600 max-w-xs shadow-lg">
          <h3 className="font-semibold text-white mb-2">{selectedNode.label}</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <div>Type: <span className="text-blue-400 capitalize">{selectedNode.type}</span></div>
            <div>Weight: <span className="text-green-400">{selectedNode.properties.weight.toFixed(1)}</span></div>
            {selectedNode.properties.description && (
              <div>Description: <span className="text-gray-400">{selectedNode.properties.description}</span></div>
            )}
            <div className="pt-2 border-t border-gray-600">
              <button
                onClick={() => onNodeSelect(null)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}