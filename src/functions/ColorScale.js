const linearColorScale = {
  'fill-color': [
    'interpolate',
    ['linear'],
    ['get', 'dem_margin'],
    -0.05,
    '#d6604d',
    -0.01,
    '#f4a582',
    0.0,
    '#f7f7f7',
    0.01,
    '#92c5de',
    0.05,
    '#4393c3',
  ],
  'fill-opacity': 0.7,
};

export default linearColorScale;
