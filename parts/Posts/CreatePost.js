import React, { useState, useContext, useEffect } from "react";
import axios from "configs/axios";
import { parseCookies } from "nookies";
import Router from "next/router";
import { toast } from "react-toastify";
import { ButtonSquare } from "components/Button";
import { DataContext } from "store/GlobalState";

const CreatePost = () => {
  const { token } = parseCookies();
  const [data, setData] = useState({
    body: "",
    tags: "",
  });

  const { state, dispatch } = useContext(DataContext);
  const { currentEdit } = state;

  const post = currentEdit
    ? state.posts.find((p) => p._id === currentEdit)
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const clear = () => {
    dispatch({ type: "SET_CURRENT_ID", payload: 0 });
  };

  useEffect(() => {
    if (post) {
      setData(post);
    }
  }, [post]);

  const createEditPost = () => {
    if (currentEdit === 0) {
      // create
      axios
        .post("/posts", data, { headers: { Authorization: token } })
        .then((res) => {
          setData({ ...data, body: "", tags: "" });
          toast.success(`🤩 ${res?.message}`);
          Router.push("/");
        })
        .catch((err) => {
          toast.error(`😥 ${err?.response?.data?.message}`);
        });
      clear();
    } else {
      // update
      axios
        .put(`/posts/${currentEdit}`, data, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setData({ ...data, body: "", tags: "" });
          toast.success(`🤩 ${res?.message}`);
          Router.push("/");
        })
        .catch((err) => {
          toast.error(`😥 ${err?.response?.data?.message}`);
        });
      clear();
    }
  };
  return (
    <div className="w-1/2 mb-12 mt-14">
      <label htmlFor="body" className="text-2xl text-gray-800 font-semibold">
        Create Post
      </label>
      <textarea
        name="body"
        id="body"
        rows="4"
        value={data.body}
        onChange={handleChange}
        placeholder="Posting sesuatu..."
        className="w-full p-4 mt-2 rounded text-sm transition-all duration-200  shadow focus:border-indigo-700 border focus:ring focus:ring-indigo-600 focus:ring-opacity-40 focus:outline-none"
      ></textarea>
      <label htmlFor="tags" className="block text-gray-800 font-semibold">
        Tag
      </label>
      <input
        type="text"
        name="tags"
        id="tags"
        value={data.tags}
        onChange={handleChange}
        placeholder="tag,tag,tag"
        className="px-3 py-2 mt-1 text-sm inline transition-all duration-200  rounded shadow focus:border-indigo-700 border focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-opacity-40 "
      />
      <span className="text-sm text-gray-400 italic ml-4">Optional tag!!!</span>{" "}
      <br />
      <ButtonSquare onClick={createEditPost}>Posting</ButtonSquare>
    </div>
  );
};

export default CreatePost;
