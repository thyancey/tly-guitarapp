import { initStore } from 'react-waterfall';

const store = {
  initialState: {
    loaded:false
  },
  actions: {
    toggleLoaded: ({ loaded }) => ({ loaded: !loaded })
  }
};
 
export const { Provider, connect } = initStore(store);