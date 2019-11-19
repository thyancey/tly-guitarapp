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
      "region": "western"
    },
    "natural-minor": {
      "title": "Minor (Natural)",
      "triad": "minor",
      "sequence":[0,2,3,5,7,8,10,12],
      "region": "western"
    },
    "harmonic-minor": {
      "title": "Minor (Harmonic)",
      "triad": "minor",
      "sequence":[0,2,3,5,7,8,11,12],
      "region": ""
    },
    "pentatonic-major":{
      "title": "Pentatonic (Major)",
      "sequence":[0,2,4,7,9,12],
      "region": "western"
    },
    "pentatonic-minor":{
      "title": "Pentatonic (Minor)",
      "sequence":[0,3,5,7,10,12],
      "region": "western"
    },
    "pentatonic-blues-minor": {
      "title": "Pentatonic (Blues Minor)",
      "sequence":[0,3,5,6,7,10,12],
      "region": ""
    },
    "hirajoshi":{
      "title": "Hirajoshi",
      "triad": "minor",
      "sequence":[0,2,3,7,8,12],
      "region": ""
    },
    "kumoi":{
      "title": "Kumoi",
      "triad": "minor",
      "sequence":[0,2,3,7,12],
      "region": ""
    },
    "chinese":{
      "title": "Chinese",
      "triad": "major",
      "sequence":[0,4,6,7,11,12],
      "region": ""
    },
    "egyptian":{
      "title": "Egyptian",
      "triad": "suspended-2",
      "sequence":[0,2,5,7,10,12],
      "region": ""
    },
    "hungarian-gypsy":{
      "title": "Hungarian Gypsy",
      "sequence":[0,1,4,7,9,10],
      "region": ""
    },
    "prometheus":{
      "title": "Prometheus",
      "sequence":[0,2,4,6,10,12],
      "region": ""
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
      "region": ""
    },
    "major-7": {
      "title": "Major Triad",
      "sequence":[0,4,7,12],
      "region": ""
    },
    "minor-7": {
      "title": "Minor Triad",
      "sequence":[0,3,7,12],
      "region": ""
    },
    "major-7-full": {
      "title": "Major Triad Exact Chord",
      "sequence":[0,4,7,12,16,24],
      "region": ""
    }
  },
  "scaleTriads":{
    "major":["major","minor","minor","major","major","minor","diminished", "major"],
    "minor":["minor","diminished","major","minor","minor","major","major", "minor"]
  }
  // "barreChords":{
  //   "e":{
  //     "title": "Major (6th String)",
  //     "fingering": [0,2,2,1,0,0]
  //   },
  // }
};