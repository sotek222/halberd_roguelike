function numParse(arr){
  return arr.map(element => parseInt(element));
};

function formatCoords(x, y){
  return x + "," + y;
}

export {
  numParse,
  formatCoords
};