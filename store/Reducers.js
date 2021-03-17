import { SET_CURRENT_ID, GET_POSTS, SET_COMMENT } from "./Actions";

const reducers = (state, action) => {
  switch (action.type) {
    case SET_CURRENT_ID:
      return {
        ...state,
        currentEdit: action.payload,
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    case SET_COMMENT:
      return {
        ...state,
        textComment: action.payload,
      };

    default:
      return state;
  }
};

export default reducers;
