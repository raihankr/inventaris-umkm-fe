export default function ObjectReducer(state, action) {
  switch (action.type) {
    case "put": {
      return { ...action.data };
    }
    case "patch": {
      return {
        ...state,
        ...action.data,
      };
    }
    case "remove": {
      let result = { ...state };
      for (let key of action.keys)
        delete result[key];
      return result;
    }
  }
}
