import Post from "./Post";

const Posts = ({ posts, handleNext, handlePrevious }) => {
  return (
    <>
      <div className="grid grid-cols-1 px-24 gap-6">
        {posts?.data?.length > 0 ? (
          posts?.data?.map((post, idx) => <Post item={post} key={idx} />)
        ) : (
          <h1>No Post</h1>
        )}
      </div>
      <div className="flex justify-center items-center mt-12">
        <button
          className="disabled:opacity-50 px-4 py-2 mr-4 bg-gray-700 hover:bg-gray-600 text-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-600 transition-all duration-200 focus:ring-opacity-75"
          onClick={handlePrevious}
          disabled={parseInt(posts?.page) === 1 ? true : false}
        >
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
