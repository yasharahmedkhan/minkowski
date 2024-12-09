export function gamma(v) {
    return 1/Math.sqrt(1-v*v);
  }
  
  export function transformPoints(points, v, c=1, mode='tx'){
    const g = gamma(v);
    return points.map(p=>{
      if(mode==='tx'){
        const t = p.coord1; 
        const x = p.coord2;
        const tPrime = g*(t - v*x/(c*c));
        const xPrime = g*(x - v*t);
        return {...p, coord1Prime:tPrime, coord2Prime:xPrime};
      } else {
        const E = p.coord1;
        const B = p.coord2;
        const Eprime = g*(E - v*B);
        const Bprime = g*(B - v*E);
        return {...p, coord1Prime:Eprime, coord2Prime:Bprime};
      }
    });
  }
  
  export function transformPolygon(vertices, v, c=1, mode='tx'){
    return transformPoints(vertices, v, c, mode);
  }
  
  
  
  
  