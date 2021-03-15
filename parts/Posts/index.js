import Post from "./Post";
import Router from "next/router";
import { deletePost } from "utils/fetchData";

const Posts = ({ posts, handleNext, handlePrevious, setCurrentId }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {posts?.data?.map((post, idx) => (
          <Post
            item={post}
            key={idx}
            onClick={() => deletePost(`/posts/${post?._id}`, Router)}
          />
        ))}
      </div>
      <div className="flex justify-center items-center mt-12">
        <button
          className="disabled:opacity-50 px-4 py-2 mr-4 bg-gray-700 hover:bg-gray-600 text-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-600 transition-all duration-200 focus:ring-opacity-75"
          onClick={handlePrevious}
          disabled={parseInt(posts?.page) === 1 ? true : false}
        >
          {/* <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>{" "} */}
          Previous
        </button>
        <p className="text-2xl">
          {parseInt(posts?.page)} / {posts?.max_page}
        </p>
        <button
          className="disabled:opacity-50 px-4 py-2 ml-4 bg-gray-700 hover:bg-gray-600 text-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-600 transition-all duration-200 focus:ring-opacity-75"
          onClick={handleNext}
          disabled={parseInt(posts?.page) === posts?.max_page ? true : false}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Posts;
