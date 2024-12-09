import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { transformPoints } from '../utils/lorentz';
import { drawAxes, drawLightCone, drawPoints } from '../utils/draw';

export default function LorentzTab() {
  const [velocity, setVelocity] = useState(0);
  const [diagramMode, setDiagramMode] = useState('tx');
  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState({coord1:0, coord2:0});

  const svgRef = useRef(null);

  const coord1Label = diagramMode === 'tx' ? 't' : 'E';
  const coord2Label = diagramMode === 'tx' ? 'x' : 'B';

  const addPoint = () => {
    setPoints([...points, { ...newPoint, id: points.length + 1 }]);
  };

  const clearPoints = () => {
    setPoints([]);
  };

  // Drawing logic in useEffect
  useEffect(() => {
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const domain = [-5,5];
    const c = 1;

    const xScale = d3.scaleLinear().domain(domain).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain(domain.slice().reverse()).range([margin.top, height - margin.bottom]);

    const transformedPoints = transformPoints(points, velocity, c, diagramMode);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    drawAxes(svg, xScale, yScale, width, height, diagramMode==='tx'?'x':'B', diagramMode==='tx'?'t':'E');
    if (diagramMode === 'tx') {
      drawLightCone(svg, xScale, yScale, c);
    }
    drawPoints(svg, points, transformedPoints, xScale, yScale, diagramMode);

  }, [points, velocity, diagramMode]);

  return (
    <div>
      <div className="controls">
        <div style={{marginBottom:'10px'}}>
          <label>
            Diagram Mode:
            <select value={diagramMode} onChange={e => setDiagramMode(e.target.value)} style={{marginLeft:'10px'}}>
              <option value="tx">t–x</option>
              <option value="eb">E–B</option>
            </select>
          </label>
        </div>
        <div style={{marginBottom:'10px'}}>
          <label>
            Relative Velocity: {velocity.toFixed(2)}
            <input type="range" min="-0.99" max="0.99" step="0.01" value={velocity} onChange={e => setVelocity(parseFloat(e.target.value))}/>
          </label>
        </div>
        <div style={{marginBottom:'10px'}}>
          <p>Add Points ({coord1Label}, {coord2Label}):</p>
          <input type="number" placeholder={coord1Label} value={newPoint.coord1} onChange={e=>setNewPoint({...newPoint, coord1:parseFloat(e.target.value)})} style={{marginRight:'5px'}} />
          <input type="number" placeholder={coord2Label} value={newPoint.coord2} onChange={e=>setNewPoint({...newPoint, coord2:parseFloat(e.target.value)})} style={{marginRight:'5px'}} />
          <button onClick={addPoint}>Add Point</button>
          <button onClick={clearPoints} style={{marginLeft:'10px'}}>Clear Points</button>
        </div>
      </div>
      <svg ref={svgRef} width={600} height={400}></svg>
    </div>
  );
}

