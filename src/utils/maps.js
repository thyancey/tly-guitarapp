

class Maps{

  static toString(){
    return '(Class Tools)';
  }

  static MAP_LAYOUTS = {
    vertical:{
      id: 'vertical',
      groups: [
        'left',
        'center',
        'right'
      ]
    },
    horizontal:{
      id: 'horizontal',
      groups: [
        'top',
        'bottom'
      ]
    }
  }
}

export default Maps;