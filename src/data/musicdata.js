export default {
  "numFrets":23,
  "notes":[
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#"
  ],
  "westernScaleFlips":{
    "major":{
      scale: "natural-minor",
      diff: -2
    },
    "pentatonic-major":{
      scale: "pentatonic-minor",
      diff: -1
    },
    "natural-minor":{
      scale: "major",
      diff: 2
    },
    "pentatonic-minor":{
      scale: "pentatonic-major",
      diff: 1
    }
  },
  "scales":{
    "major": {
      "title": "Major",
      "triad": "major",
      "sequence":[0,2,4,5,7,9,11,12],
      "region": "western",
      "type":"scale"
    },
    "natural-minor": {
      "title": "Minor (Natural)",
      "triad": "minor",
      "sequence":[0,2,3,5,7,8,10,12],
      "region": "western",
      "type":"scale"
    },
    "harmonic-minor": {
      "title": "Minor (Harmonic)",
      "triad": "minor",
      "sequence":[0,2,3,5,7,8,11,12],
      "region": "",
      "type":"scale"
    },
    "pentatonic-major":{
      "title": "Pentatonic (Major)",
      "sequence":[0,2,4,7,9,12],
      "region": "western",
      "type":"scale"
    },
    "pentatonic-minor":{
      "title": "Pentatonic (Minor)",
      "sequence":[0,3,5,7,10,12],
      "region": "western",
      "type":"scale"
    },
    "pentatonic-blues-minor": {
      "title": "Pentatonic (Blues Minor)",
      "sequence":[0,3,5,6,7,10,12],
      "region": "",
      "type":"scale"
    },
    "hirajoshi":{
      "title": "Hirajoshi",
      "triad": "minor",
      "sequence":[0,2,3,7,8,12],
      "region": "",
      "type":"scale"
    },
    "kumoi":{
      "title": "Kumoi",
      "triad": "minor",
      "sequence":[0,2,3,7,12],
      "region": "",
      "type":"scale"
    },
    "chinese":{
      "title": "Chinese",
      "triad": "major",
      "sequence":[0,4,6,7,11,12],
      "region": "",
      "type":"scale"
    },
    "egyptian":{
      "title": "Egyptian",
      "triad": "suspended-2",
      "sequence":[0,2,5,7,10,12],
      "region": "",
      "type":"scale"
    },
    "hungarian-gypsy":{
      "title": "Hungarian Gypsy",
      "sequence":[0,1,4,7,9,10],
      "region": "",
      "type":"scale"
    },
    "prometheus":{
      "title": "Prometheus",
      "sequence":[0,2,4,6,10,12],
      "region": "",
      "type":"scale"
    },
    /*
    "pentatonic-minor":{
      "title": "Pentatonic (Minor)",
      "sequence":[0,3,5,7,10,12]
    },
    "melodic-minor-up": {
      "title": "Minor (Melodic Up)",
      "sequence":[0,2,3,5,7,9,11,12,]
    },
    "melodic-minor-down": {
      "title": "Minor (Melodic Down)",
      "sequence":[0,2,4,5,7,9,10,12]
    },
    "dorian-mode": {
      "title": "Dorian Mode",
      "sequence":[0,2,3,5,7,9,10,12]
    },
    "mixolydian-mode": {
      "title": "Mixolydian Mode",
      "sequence":[0,2,4,5,7,9,10,12]
    },*/
    "ahava-raba-mode": {
      "title": "Ahava Raba Mode",
      "sequence":[0,1,4,5,7,8,10,12],
      "region": "",
      "type":"scale"
    },
    "major-7": {
      "title": "Major Triad",
      "sequence":[0,4,7,12],
      "region": "",
      "type":"chord"
    },
    "minor-7": {
      "title": "Minor Triad",
      "sequence":[0,3,7,12],
      "region": "",
      "type":"chord"
    },
    "major-7-full": {
      "title": "Major Triad Exact Chord",
      "sequence":[0,4,7,12,16,24],
      "region": "",
      "type":"chord"
    }
  },
  "scaleTriads":{
    "major":["major","minor","minor","major","major","minor","diminished", "major"],
    "minor":["minor","diminished","major","minor","minor","major","major", "minor"]
  },
  // "barreChords":{
  //   "e":{
  //     "title": "Major (6th String)",
  //     "fingering": [0,2,2,1,0,0]
  //   },
  // }
  "scalePatterns":[
    {
      "description": "guitar and bass major scales",
      "instruments": [ "guitar-standard", "bass-standard" ],
      "scales": [ "major", "pentatonic-major" ],
      "patterns":[
        {
          "title": "",
          "refString": 0,
          "offsets": [
            [ -1, 2 ],
            [ -1, 2 ],
            [ -1, 2 ],
            [ -1, 2 ],
            [ 0, 2 ],
            [ -1, 2 ]
          ]
        },
        {
          "title": "",
          "refString": 2,
          "offsets": [
            [ 0, 3 ],
            [ 0, 2 ],
            [ -1, 2 ],
            [ -1, 2 ],
            [ 0, 3 ],
            [ 0, 3 ]
          ]
        },
        {
          "title": "",
          "scales": [ 'major' ],
          "refString": 1,
          "offsets": [
            [ -3, 0 ],
            [ -3, 0 ],
            [ -3, 0 ],
            [ -3, -1 ],
            [ -3, 0 ],
            [ -3, 0 ]
          ]
        },
        {
          "title": "",
          "scales": [ 'major' ],
          "refString": 1,
          "offsets": [
            [ -2, 2 ],
            [ -1, 2 ],
            [ -1, 2 ],
            [ -1, 2 ],
            [ 0, 3 ],
            [ 0, 2 ]
          ]
        },
        {
          "title": "",
          "scales": [ 'major' ],
          "refString": 0,
          "offsets": [
            [ -3, 0 ],
            [ -3, 0 ],
            [ -3, -1 ],
            [ -4, -1 ],
            [ -3, 0 ],
            [ -3, 0 ]
          ]
        },
      ]
    },
    {
      "description": "guitar and bass minor scales",
      "instruments": [ "guitar-standard", "bass-standard" ],
      "scales": [ "natural-minor", "pentatonic-minor" ],
      "patterns":[
        {
          "title": "",
          "refString": 0,
          "offsets": [
            [ 0, 3 ],
            [ 0, 3 ],
            [ 0, 2 ],
            [ -1, 2 ],
            [ 0, 3 ],
            [ 0, 3 ]
          ]
        },
        {
          "title": "",
          "refString": 2,
          "offsets": [
            [ 0, 3 ],
            [ 0, 3 ],
            [ 0, 3 ],
            [ 0, 3 ],
            [ 1, 3 ],
            [ 0, 3 ]
          ]
        },
        {
          "title": "",
          "refString": 1,
          "offsets": [
            [ -2, 1 ],
            [ -2, 0 ],
            [ -3, 0 ],
            [ -3, 0 ],
            [ -2, 1 ],
            [ -2, 1 ]
          ]
        },
        {
          "title": "",
          "refString": 1,
          "offsets": [
            [ 0, 3 ],
            [ 0, 3 ],
            [ 0, 3 ],
            [ 0, 2 ],
            [ 0, 3 ],
            [ 0, 3 ]
          ]
        },
        {
          "title": "",
          "refString": 0,
          "offsets": [
            [ -2, 0 ],
            [ -3, 0 ],
            [ -3, 0 ],
            [ -3, 0 ],
            [ -2, 1 ],
            [ -2, 0 ]
          ]
        },
      ]
    }
  ]
};