import React, { useEffect, useState, useRef, useContext } from "react";
import formatDate from "utils/formatDate";
import { CSSTransition } from "react-transition-group";
import { DataContext } from "store/GlobalState";

import Link from "next/link";
import axios from "configs/axios";
import { useRouter } from "next/router";
import { deletePost, likePost } from "utils/fetchData";
import Cookies from "js-cookie";

const Post = ({ item }) => {
  const [user, setUser] = useState(null);
  const [menuPost, setMenuPost] = useState(false);
  const menuPostRef = useRef(null);
  const { dispatch } = useContext(DataContext);
  const [textComment, setTextComment] = useState("");
  const router = useRouter();
  console.log(router.pathname);

  const handleComment = () => {
    axios
      .put(
        `/posts/${item._id}/comments`,
        { text: textComment },
        { headers: { Authorization: Cookies.get("token") } }
      )
      .then((res) => {
        {
          router.pathname === "/posts/[id]"
            ? router.push(`/posts/${item._id}`)
            : router.push("/");
        }
        setTextComment("");
      });
  };

  const clickOutside = (e) => {
    if (menuPostRef && !menuPostRef.current?.contains(e.target)) {
      setMenuPost(false);
    }
  };

  function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));

    window.addEventListener("mousedown", clickOutside);
    return () => {
      window.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  return (
    <div className="w-full p-4 shadow-md rounded-md bg-gray-50 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={item?.postedBy?.avatar}
            alt={item?.username}
            className="h-12 w-12 rounded-full"
          />
          <div className="ml-4">
            <p className="text-lg leading-none text-gray-800">
              {item?.postedBy?.fullname ?? "Full name"}
            </p>
            <p className="text-gray-400 text-sm">
              @{item?.postedBy?.username ?? "Username"}
            </p>
          </div>
        </div>
        {!Cookies.get("token") ? null : user?._id === item?.postedBy?._id ? (
          <div className="" ref={menuPostRef}>
            <i
              className="fa fa-ellipsis-h text-gray-800 cursor-pointer hover:text-gray-500"
              aria-hidden="true"
              onClick={() => setMenuPost(!menuPost)}
            ></i>
            <CSSTransition
              in={menuPost}
              timeout={200}
              classNames="my-dropdown"
              unmountOnExit
            >
              <div className="bg-gray-50 rounded-lg shadow-lg  absolute right-4">
                <div
                  className="text-gray-800 text-sm pl-4 pr-8 py-2 border-b border-gray-400 hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-tl-lg rounded-tr-lg"
                  onClick={() =>
                    dispatch({ type: "SET_CURRENT_ID", payload: item?._id })
                  }
                >
                  <i className="fas fa-edit text-blue-500 mr-1"></i> Edit
                </div>
                <div
                  className="text-gray-800 text-sm pl-4 pr-8 py-2 hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-bl-lg rounded-br-lg"
                  onClick={() => deletePost(item._id, router)}
                >
                  <i
                    className="fa fa-trash mr-1 text-red-500"
                    aria-hidden="true"
                  ></i>{" "}
                  Delete
                </div>
              </div>
            </CSSTransition>
          </div>
        ) : null}
      </div>
      <p className="text-gray-800 mt-4 mb-1">{item?.body}</p>
      <p className="text-sm text-gray-400 mb-2">
        {formatDate(item?.createdAt)}
      </p>

      {!isEmptyOrSpaces(item?.tags[0])
        ? item?.tags[0]?.split(",")?.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-1 mr-2 text-sm text-gray-50 mt-2 mb-4 rounded bg-blue-500"
            >
              {t}
            </span>
          ))
        : null}
      <div className="like-coment flex items-center">
        <div
          className="like flex items-center mr-4"
          onClick={() => likePost(item._id, router)}
        >
          {item?.likes?.indexOf(user?._id) === 0 ? (
            <i
              className="fas fa-heart cursor-pointer text-red-500"
              aria-hidden="true"
            ></i>
          ) : (
            <i
              className="far fa-heart cursor-pointer text-red-500"
              aria-hidden="true"
            ></i>
          )}
          <p className="text-sm text-gray-800 ml-2">
            {item?.likes?.length} likes
          </p>
        </div>
        <div className="comment cursor-pointer">
          <i className="fas fa-comment-dots text-gray-800 mr-2"></i>
          <span className="text-sm text-gray-800">
            {item?.comments.length} komentar
          </span>
        </div>
      </div>

      <div className="mt-4 bg-gray-300 px-2 py-2">
        {item?.comments?.length > 0 && router.pathname !== "/posts/[id]" ? (
          <Link href={`/posts/${item._id}`}>
            <a className="cursor-pointer hover:underline hover:text-gray-600 transition-all duration-200">
              Lihat semua komentar ...
            </a>
          </Link>
        ) : router.pathname === "/" ? (
          <p>No komentar</p>
        ) : (
          <p>Komentar</p>
        )}

        {router.pathname !== "/posts/[id]"
          ? item?.comments.slice(0, 3).map((comment, idx) => (
              <div key={idx}>
                <div className="avatar flex items-center mt-2">
                  <img
                    src={comment?.commentBy?.avatar}
                    className="w-6 h-6 rounded-full mr-1"
                  />
                  <p className="text-sm text-gray-100">
                    {comment?.commentBy?.fullname}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{comment?.text}</p>
              </div>
            ))
          : item?.comments.map((comment, idx) => (
              <div key={idx}>
                <div className="avatar flex items-center mt-2">
                  <img
                    src={comment?.commentBy?.avatar}
                    className="w-6 h-6 rounded-full mr-1"
                  />
                  <p className="text-sm text-gray-100">
                    {comment?.commentBy?.fullname}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{comment?.text}</p>
              </div>
            ))}
      </div>
      <div className="mt-4 bg-gray-200 flex items-center justify-between py-2 px-6 rounded-full">
        <input
          type="text"
          className="w-11/12 bg-transparent focus:outline-none text-sm placeholder-gray-500"
          placeholder="Tulis komentar..."
          onChange={(e) => setTextComment(e.target.value)}
          value={textComment}
        />
        <i
          className="fa fa-paper-plane text-gray-800 cursor-pointer hover:text-gray-500"
          aria-hidden="true"
          onClick={handleComment}
        ></i>
      </div>
    </div>
  );
};

export default Post;
