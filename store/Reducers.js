import { GET_POSTS, GET_USER_LOGIN, SET_CURRENT_ID } from "./Actions";

const reducers = (state, action) => {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    case GET_USER_LOGIN:
      return {
        ...state,
        userLogin: action.payload,
      };
    case SET_CURRENT_ID:
      return {
        ...state,
        currentEdit: action.payload,
      };

    default:
      return state;
  }
};

export default reducers;
