import * as d3 from 'd3';

export function drawAxes(svg, xScale, yScale, width, height, coord2Label='x', coord1Label='t') {
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append('g')
    .attr('transform', `translate(0,${yScale(0)})`)
    .call(xAxis)
    .append('text')
    .attr('x', width - 30)
    .attr('y', -6)
    .text(coord2Label);

  svg.append('g')
    .attr('transform', `translate(${xScale(0)},0)`)
    .call(yAxis)
    .append('text')
    .attr('transform','rotate(-90)')
    .attr('x', -20)
    .attr('y', 20)
    .text(coord1Label);
}

export function drawLightCone(svg, xScale, yScale, c) {
  svg.append('line')
    .attr('x1', xScale(-5*c)).attr('y1', yScale(-5))
    .attr('x2', xScale(5*c)).attr('y2', yScale(5))
    .attr('stroke', '#aaa')
    .attr('stroke-dasharray','3,3');

  svg.append('line')
    .attr('x1', xScale(5*c)).attr('y1', yScale(-5))
    .attr('x2', xScale(-5*c)).attr('y2', yScale(5))
    .attr('stroke', '#aaa')
    .attr('stroke-dasharray','3,3');
}

export function drawPoints(svg, original, transformed, xScale, yScale, mode) {
  const origColor = '#007bff';
  const transColor = '#ff0000';

  svg.selectAll('.pointOriginal')
    .data(original)
    .enter()
    .append('circle')
    .attr('class', 'pointOriginal')
    .attr('cx', d=>xScale(d.coord2))
    .attr('cy', d=>yScale(d.coord1))
    .attr('r',4)
    .attr('fill',origColor);

  svg.selectAll('.pointTransformed')
    .data(transformed)
    .enter()
    .append('circle')
    .attr('class', 'pointTransformed')
    .attr('cx', d=>xScale(d.coord2Prime))
    .attr('cy', d=>yScale(d.coord1Prime))
    .attr('r',4)
    .attr('fill',transColor);

  svg.selectAll('.pointLink')
    .data(original)
    .enter()
    .append('line')
    .attr('x1', d=>xScale(d.coord2))
    .attr('y1', d=>yScale(d.coord1))
    .attr('x2', d=>{
      const t = transformed.find(e=>e.id===d.id);
      return xScale(t.coord2Prime);
    })
    .attr('y2', d=>{
      const t=transformed.find(e=>e.id===d.id);
      return yScale(t.coord1Prime);
    })
    .attr('stroke','#555')
    .attr('stroke-dasharray','2,2');
}

export function drawPolygon(svg, originalVertices, transformedVertices, xScale, yScale, mode) {
  if(originalVertices.length<3)return;

  const origColor='blue';
  const transColor='green';

  const origLine = d3.line()
    .x(d=>xScale(d.coord2))
    .y(d=>yScale(d.coord1))
    .curve(d3.curveLinearClosed);

  svg.append('path')
    .datum(originalVertices)
    .attr('fill','none')
    .attr('stroke',origColor)
    .attr('stroke-width',2)
    .attr('d',origLine);

  const transLine = d3.line()
    .x(d=>xScale(d.coord2Prime))
    .y(d=>yScale(d.coord1Prime))
    .curve(d3.curveLinearClosed);

  svg.append('path')
    .datum(transformedVertices)
    .attr('fill','none')
    .attr('stroke',transColor)
    .attr('stroke-width',2)
    .attr('d',transLine);
}


