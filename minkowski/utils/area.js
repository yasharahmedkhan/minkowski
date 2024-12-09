// utils/area.js
export function polygonArea(vertices) {
    if (vertices.length < 3) return 0;
    let area = 0;
    for (let i=0; i<vertices.length; i++){
      const j = (i+1)%vertices.length;
      const x_i = vertices[i].coord2;
      const y_i = vertices[i].coord1;
      const x_j = vertices[j].coord2;
      const y_j = vertices[j].coord1;
      area += x_i*y_j - x_j*y_i;
    }
    return Math.abs(area)/2;
  }
  
  
  