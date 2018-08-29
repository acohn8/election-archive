const StateColorScale = {
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

const CountyColorScale = {
  'fill-color': [
    'interpolate',
    ['linear'],
    ['get', 'dem_margin'],
    -0.3,
    '#d6604d',
    -0.2,
    '#f4a582',
    -0.1,
    '#fddbc7',
    0.0,
    '#f7f7f7',
    0.1,
    '#d1e5f0',
    0.2,
    '#92c5de',
    0.3,
    '#4393c3',
  ],
  'fill-opacity': 0.7,
};

const PrecinctColorScale = {
  'fill-outline-color': '#696969',
  'fill-color': [
    'interpolate',
    ['linear'],
    [
      '-',
      ['/', ['get', 'G16PREDCli'], ['+', ['get', 'G16PREDCli'], ['get', 'G16PRERTru']]],
      ['/', ['get', 'G16PRERTru'], ['+', ['get', 'G16PREDCli'], ['get', 'G16PRERTru']]],
    ],
    -0.3,
    '#d6604d',
    -0.2,
    '#f4a582',
    -0.1,
    '#fddbc7',
    0.0,
    '#f7f7f7',
    0.1,
    '#d1e5f0',
    0.2,
    '#92c5de',
    0.3,
    '#4393c3',
  ],
  'fill-opacity': 0.7,
};

export { PrecinctColorScale, StateColorScale, CountyColorScale };
