import {writable, derived} from 'svelte/store';

export const mapState = writable({
  center: [47.3914057,19.03352], // 47.385599,19.036925
  zoom : 16,
  baselayer: "OSM",
  //overlays: ["Taxon", "Geo", "Query"]
  overlays: ["Query", "Temp"]
})

export const currDate = writable(new Date().toISOString().split('T')[0]);

export const currData = writable({
  id: null,
  date: {dat: {currDate}},
  taxon: null,
  attributes: [],
  note: null,
  observer: [],
  files: [],
  reference: [],
  geometry: null
})

export const metersPerPixel = derived([mapState], ([$mapState]) => {
  let mpp = 40075016.686 * Math.abs(Math.cos($mapState.center[0] * Math.PI/180)) / Math.pow(2, $mapState.zoom+8);
  //console.log(mpp.toFixed(3))
  return parseFloat(mpp.toFixed(3));
});


export const selectedShape = writable('point');
export const pointIndex = writable(null);
export const midPointIndex = writable(null);
export const tempIndex = writable(null);

export const controlGeo = writable({
  "type": "FeatureCollection",
  "features": []
});

export const dailyData = writable({
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        data: "próba point",
        type: 1,
        id: 12
      },
      "geometry": {
        "type": "Point",
        "coordinates": [19.035544,47.386432],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "próba ellipse",
        type: 1,
        id: 13
      },
      "geometry": {
        "type": "Point",
        "ellipse": [[19.035916,47.385133],[19.034875,47.385656]],
        "param": [50,12,76],
        "coordinates": [19.035344,47.385832]
      }
    },
    {
      "type": "Feature",
        "properties": {
          data: "próba line",
          type: 2,
          id: 14,
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [19.035662,47.385353],
          [19.036531,47.385534]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "próba Polygon",
        type: 1,
        id: 15
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [19.037107,47.386306],
            [19.036453,47.385548],
            [19.037793,47.384908],
            [19.039150,47.385606],
            [19.038565,47.386379],
            [19.037107,47.386306]
          ],
          [
            [19.037589,47.386099],
            [19.037316,47.385660],
            [19.038195,47.385838],
            [19.037589,47.386099]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "próba multipolygon",
        type: 1,
        id: 16
      },
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [[19.037779,47.383890],
            [19.037672,47.384529],
            [19.036825,47.384529],
            [19.036439,47.383868],
            [19.037265,47.383483],
            [19.037779,47.383890]],
            
            [[19.03707,47.384296],
            [19.036804,47.384006],
            [19.037168,47.383781],
            [19.037554,47.383991],
            [19.037072,47.384296]]
          ],
          [
            [[19.0369,47.384637],
            [19.037640,47.384637],
            [19.037308,47.385102],
            [19.036900,47.384637]]
          ]
        ]
      }
    }
  ]
  
})

export const geoData = writable({
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        data: "K4 kutatóárok",
        type: 2,
        id: 16
      },
      "geometry": {
        "coordinates": [[19.034662,47.384353],[19.03531,47.384534]],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
        "properties": {
          data: "K5 kutatóárok",
          type: 2,
          id: 17
        },
        "geometry": {
          "coordinates": [[19.035046,47.384869],[19.034419,47.384703]],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "K6 kutatóárok",
        type: 2,
        id: 18
      },
      "geometry": {
        "coordinates": [[19.03476,47.385167],[19.034169,47.384968]],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {
          data: "K7 kutatóárok",
          type: 2,
          id: 19
        },
      "geometry": {
        "coordinates": [[19.034518,47.385456],[19.034023,47.385218]],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "K8 kutatóárok",
        type: 2,
        id: 20
      },
      "geometry": {
        "coordinates": [[19.034273,47.385684],[19.03378,47.385526]],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "K9 kutatóárok",
          type: 2,
          id: 21
        },
      "geometry": {
        "coordinates": [[19.033981,47.385967],[19.033467,47.385835]],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "K3 kutatóárok",
        type: 2,
          id: 22
        },
      "geometry": {
        "coordinates": [[19.035512,47.384274],[19.035041,47.38411]],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "K2 kutatóárok",
          type: 2,
          id: 23
        },
        "geometry": {
        "coordinates": [[19.035153,47.383744],[19.035672,47.384]],
        "type": "LineString"
      }
    },
    {
      "type": "Feature",
        "properties": {
          data: "K1 kutatóárok",
          type: 2,
          id: 24
        },
      "geometry": {
        "coordinates": [[19.03579,47.38363],[19.036336,47.383844]],
        "type": "LineString"
      }
    }    
  ]
})

export const queryData = writable({
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        data: "Csajkavirág 1",
        type: 0,
        id: 1,
        ord: 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [19.00452,47.372911],
          [19.004952,47.372837],
          [19.005068,47.37262],
          [19.004977,47.37238],
          [19.004642,47.37235],
          [19.004136,47.372527],
          [19.004111,47.372865],
          [19.00452,47.372911]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Csajkavirág 2",
        type: 0,
        id: 2,
        ord: 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [19.005047,47.373532],
          [19.004935,47.373753],
          [19.005034,47.373929],
          [19.005374,47.373915],
          [19.005622,47.37379],
          [19.005801,47.373564],
          [19.005461,47.373396],
          [19.005047,47.373532]
        ]],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Körtefa",
        type: 0,
        id: 3,
        ord: 2
      },
      "geometry": {
        "type": "Point",
        "param": [17,2,146],
        "coordinates": [19.033752,47.3913200],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Birs",
        type: 0,
        id: 4,
        ord: 3
      },
      "geometry": {
        "type": "Point",
        "param":[17,2,110],
        "coordinates": [19.03322,47.3910257],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Naspolya",
        type: 0,
        id: 5,
        ord: 4
      },
      "geometry": {
        "type": "Point",
        "coordinates": [19.03352,47.3914057],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Meggy",
        type: 0,
        id: 6,
        ord: 2,
      },
      "geometry": {
        "type": "Point",
        "circle": [19.032925,47.3914057],
        "param": [25],
        "coordinates": [19.032521,47.3914057],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Cseresznye",
        type: 0,
        id: 7,
        ord: 2,
      },
      "geometry": {
        "type": "Point",
        "coordinates": [19.032088,47.392698],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Kivi",
        type: 0,
        id: 8,
        ord: 2,
      },
      "geometry": {
        "type": "Point",
        "coordinates": [19.030586,47.391792],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Mangó",
        type: 0,
        id: 9,
        ord: 2,
      },
      "geometry": {
        "type": "Point",
        "coordinates": [19.0289339,47.391005],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Papaya",
        type: 0,
        id: 10,
        ord: 2,
      },
      "geometry": {
        "type": "Point",
        "coordinates": [19.032238,47.390548],
      }
    },
    {
      "type": "Feature",
      "properties": {
        data: "Licsi",
        type: 0,
        id: 11,
      },
      "geometry": {
        "type": "Point",
        "coordinates": [19.132238,47.370548],
      }
    }    
  ]
});

export const tempGeo = writable({
  "type": "FeatureCollection",
  "features": []
});

export const gpsGeo = writable({
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        data: "GPS",
        type: 3,
        id: 'G3000'
      },
      "geometry": {
        "type": "Point",
        "param": [20],
        "coordinates": [19.036195,47.3868],
      }
    }    
  ]
});

export const visibleShapes = derived([mapState, dailyData, geoData, queryData, tempGeo],([$mapState, $dailyData, $geoData, $queryData, $tempGeo]) => {
  let res = $mapState.overlays.map(f=> {
    switch (f) {
      case 'Taxon':
        return $dailyData;
      case 'Geo':
        return $geoData;
      case 'Query':
        return $queryData;
      case 'Temp':
        return $tempGeo;
      default:
        break;
    }
  });
  return res;
});

export const attributes = [
  {id: 1, abr: "x", nam: "taxon", rep: "*", ord: 11},
  {id: 2, abr: "lp", nam: "lepke", rep: null, ord: 22},
  {id: 3, abr: "bog", nam: "bogár", rep: null, ord: 22},
  {id: 4, abr: "lgy", nam: "légy", rep: null, ord: 22},
  {id: 5, abr: "dar", nam: "darázs", rep: null, ord: 22},
  {id: 6, abr: "pol", nam: "poloska", rep: null, ord: 22},
  {id: 7, abr: "pok", nam: "pók", rep: null, ord: 22},
  {id: 8, abr: "rov", nam: "rovar", rep: null, ord: 22},
  {id: 9, abr: "p", nam: "példány", rep: "*pd", ord: 31},
  {id: 10, abr: "h", nam: "hím", rep: "*h", ord: 32},
  {id: 11, abr: "n", nam: "nőstény", rep: "*n", ord: 33},
  {id: 12, abr: "ad", nam: "adult", rep: "*ad", ord: 34},
  {id: 13, abr: "jv", nam: "juvenilis", rep: "*juv", ord: 35},
  {id: 14, abr: "sub", nam: "subadult", rep: "*sub", ord: 36},
  {id: 15, abr: "im", nam: "immature", rep: "*imm", ord: 37},
  {id: 16, abr: "pu", nam: "pullus", rep: "*pull", ord: 38},
  {id: 17, abr: "tj", nam: "tojás", rep: "* tojás", ord: 39},
  {id: 18, abr: "nh", nam: "néhány pd", rep: null, ord: 41},
  {id: 19, abr: "tb", nam: "több pd", rep: null, ord: 42},
  {id: 20, abr: "rk", nam: "ritka", rep: null, ord: 43},
  {id: 21, abr: "sz", nam: "szórványos", rep: null, ord: 44},
  {id: 22, abr: "gy", nam: "gyakori", rep: null, ord: 45},
  {id: 23, abr: "tm", nam: "tömeges", rep: null, ord: 46},
  {id: 24, abr: "tbf", nam: "többfelé", rep: null, ord: 47},
  {id: 25, abr: "mdf", nam: "mindenfelé", rep: null, ord: 48},
  {id: 26, abr: "elf", nam: "előfordul", rep: null, ord: 49},
  {id: 27, abr: "fsz", nam: "fészek", rep: null, ord: 51},
  {id: 28, abr: "nym", nam: "nyom", rep: null, ord: 51},
  {id: 29, abr: "flt", nam: "folt", rep: null, ord: 51},
  {id: 30, abr: "dg", nam: "dög", rep: null, ord: 51},
  {id: 31, abr: "kcs", nam: "közös csapatban", rep: null, ord: 51},
  {id: 32, abr: "tbc", nam: "több csapatban", rep: null, ord: 51},
  {id: 33, abr: "fe", nam: "irány", rep: "*-felé", ord: 51},
  {id: 34, abr: "en", nam: "ének", rep: null, ord: 61},
  {id: 35, abr: "hg", nam: "hang", rep: null, ord: 61},
  {id: 36, abr: "chg", nam: "csak hang", rep: null, ord: 61},
  {id: 37, abr: "ri", nam: "riaszt", rep: null, ord: 61},
  {id: 38, abr: "at", nam: "átrepülő", rep: null, ord: 61},
  {id: 39, abr: "vr", nam: "virágzik", rep: null, ord: 61},
  {id: 40, abr: "ell", nam: "ellenőrizendő", rep: null, ord: 71},
  {id: 41, abr: "kt", nam: "kétes", rep: null, ord: 71},
  {id: 42, abr: "f", nam: "fotó", rep: null, ord: 71},
  {id: 43, abr: "fh", nam: "fotóról határozva", rep: null, ord: 71},
  {id: 44, abr: "idp", nam: "időpont", rep: "*", ord: 71},
  {id: 45, abr: "kez", nam: "kezdés", rep: "*", ord: 71},
  {id: 46, abr: "bef", nam: "befejezés", rep: "*", ord: 71},
  {id: 47, abr: "bir", nam: "birding.hu", rep: "birding.hu/*", ord: 81},
  {id: 48, abr: "ize", nam: "izeltlabuak.hu", rep: "izeltlabuak.hu/*", ord: 81},
  {id: 49, abr: "hdb", nam: "herbárium doboz", rep: "*hdb", ord: 81},
  {id: 50, abr: "hno", nam: "herbárium szám", rep: "*hno", ord: 81},
]