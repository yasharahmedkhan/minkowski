import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { transformPolygon } from '../utils/lorentz';
import { drawAxes, drawLightCone, drawPolygon } from '../utils/draw';
import { polygonArea } from '../utils/area';

export default function AreaTab() {
  const [velocity, setVelocity] = useState(0);
  const [diagramMode, setDiagramMode] = useState('tx');
  const [polygonVertices, setPolygonVertices] = useState([]);
  const [newVertex, setNewVertex] = useState({coord1:0, coord2:0});

  const svgRef = useRef(null);

  const coord1Label = diagramMode === 'tx' ? 't' : 'E';
  const coord2Label = diagramMode === 'tx' ? 'x' : 'B';

  const addVertex = () => {
    setPolygonVertices([...polygonVertices, {...newVertex, id: polygonVertices.length+1}]);
  };

  const clearPolygon = () => {
    setPolygonVertices([]);
  };

  const c = 1;
  const transformedPolygon = transformPolygon(polygonVertices, velocity, c, diagramMode);
  const origArea = polygonArea(polygonVertices);
  const transArea = polygonArea(transformedPolygon);

  useEffect(() => {
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const domain = [-5,5];
    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    const xScale = d3.scaleLinear().domain(domain).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain(domain.slice().reverse()).range([margin.top, height - margin.bottom]);

    drawAxes(svg, xScale, yScale, width, height, diagramMode==='tx'?'x':'B', diagramMode==='tx'?'t':'E');
    if(diagramMode==='tx'){
      drawLightCone(svg, xScale, yScale, c);
    }
    if(polygonVertices.length>2){
      drawPolygon(svg, polygonVertices, transformedPolygon, xScale, yScale, diagramMode);
    }

  }, [polygonVertices, transformedPolygon, diagramMode, velocity]);

  return (
    <div>
      <div className="controls">
        <div style={{marginBottom:'10px'}}>
          <label>
            Diagram Mode:
            <select value={diagramMode} onChange={e=>setDiagramMode(e.target.value)} style={{marginLeft:'10px'}}>
              <option value="tx">t–x</option>
              <option value="eb">E–B</option>
            </select>
          </label>
        </div>
        <div style={{marginBottom:'10px'}}>
          <label>
            Relative Velocity: {velocity.toFixed(2)}
            <input type="range" min="-0.99" max="0.99" step="0.01" value={velocity} onChange={e=>setVelocity(parseFloat(e.target.value))}/>
          </label>
        </div>
        <div style={{marginBottom:'10px'}}>
          <p>Add Polygon Vertex ({coord1Label}, {coord2Label}):</p>
          <input type="number" placeholder={coord1Label} value={newVertex.coord1} onChange={e=>setNewVertex({...newVertex, coord1:parseFloat(e.target.value)})} style={{marginRight:'5px'}}/>
          <input type="number" placeholder={coord2Label} value={newVertex.coord2} onChange={e=>setNewVertex({...newVertex, coord2:parseFloat(e.target.value)})} style={{marginRight:'5px'}}/>
          <button onClick={addVertex}>Add Vertex</button>
          <button onClick={clearPolygon} style={{marginLeft:'10px'}}>Clear Polygon</button>
        </div>
      </div>
      <svg ref={svgRef} width={600} height={400}></svg>
      {polygonVertices.length>2 && (
        <div style={{marginTop:'10px'}}>
          <strong>Polygon Area:</strong><br/>
          Original Area: {origArea.toFixed(4)}<br/>
          Transformed Area: {transArea.toFixed(4)}<br/>
          (They should be the same)
        </div>
      )}
    </div>
  );
}

