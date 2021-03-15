import axios from "configs/axios";

export const GET_POSTS = "GET_POSTS";
export const SET_CURRENT_ID = "SET_CURRENT_ID";
export const GET_USER_LOGIN = "GET_USER_LOGIN";

export const getPosts = async () => {
  const res = await axios.get("/posts");

  return { type: "GET_POSTS", payload: res };
};
