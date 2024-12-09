import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { gamma } from '../utils/lorentz';

export default function EnergyDensityTab() {
  const [velocity, setVelocity] = useState(0);
  const [diagramMode, setDiagramMode] = useState('eb');

  const svgRef = useRef(null);

  const coord1Label = diagramMode === 'tx' ? 't' : 'E';
  const coord2Label = diagramMode === 'tx' ? 'x' : 'B';

  const width = 600;
  const height = 400;
  const margin = { top:20, right:20, bottom:40, left:40 };
  const domain = [-5,5];
  const c = 1;
  const g = gamma(velocity);

  const radii = [1,2,3,4];

  function generateCirclePoints(r) {
    const points = [];
    const numPoints = 100;
    for (let i=0; i<numPoints; i++){
      const angle = (2*Math.PI*i)/numPoints;
      const coord1 = r*Math.sin(angle);
      const coord2 = r*Math.cos(angle);

      let coord1Prime, coord2Prime;
      if(diagramMode==='tx'){
        const t = coord1;
        const x = coord2;
        const tPrime = g*(t - velocity*x/(c*c));
        const xPrime = g*(x - velocity*t);
        coord1Prime = tPrime;
        coord2Prime = xPrime;
      } else {
        const E = coord1;
        const B = coord2;
        const Eprime = g*(E - velocity*B);
        const Bprime = g*(B - velocity*E);
        coord1Prime = Eprime;
        coord2Prime = Bprime;
      }
      points.push({coord1, coord2, coord1Prime, coord2Prime});
    }
    return points;
  }

  const circleData = radii.map(r => generateCirclePoints(r));

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = d3.scaleLinear().domain(domain).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain(domain.slice().reverse()).range([margin.top, height - margin.bottom]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform',`translate(0,${yScale(0)})`)
      .call(xAxis)
      .append('text')
      .attr('x', width-30)
      .attr('y', -6)
      .text(coord2Label);

    svg.append('g')
      .attr('transform',`translate(${xScale(0)},0)`)
      .call(yAxis)
      .append('text')
      .attr('transform','rotate(-90)')
      .attr('x',-20)
      .attr('y',20)
      .text(coord1Label);

    const origLine = d3.line()
      .x(d => xScale(d.coord2))
      .y(d => yScale(d.coord1))
      .curve(d3.curveLinearClosed);

    const transLine = d3.line()
      .x(d => xScale(d.coord2Prime))
      .y(d => yScale(d.coord1Prime))
      .curve(d3.curveLinearClosed);

    circleData.forEach(circle => {
      svg.append('path')
        .datum(circle)
        .attr('d', origLine)
        .attr('fill','none')
        .attr('stroke','blue')
        .attr('stroke-width',1);

      svg.append('path')
        .datum(circle)
        .attr('d', transLine)
        .attr('fill','none')
        .attr('stroke','red')
        .attr('stroke-width',1);
    });

  }, [velocity, diagramMode]);

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
        <p>This tab shows conceptual "energy density" levels as concentric shapes (blue = rest frame, red = transformed frame).</p>
      </div>
      <svg ref={svgRef} width={600} height={400}></svg>
    </div>
  );
}

