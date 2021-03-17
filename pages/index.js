import { useState, useEffect, useContext } from "react";
import Navbar from "parts/Navbar";
import Posts from "parts/Posts";
import CreatePost from "parts/Posts/CreatePost";
import axios from "configs/axios";
import filterData from "utils/filterData";
import { useRouter } from "next/router";
import { DataContext } from "store/GlobalState";

const Home = ({ data }) => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState(data);
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);

  useEffect(() => {
    setPosts(data);
    dispatch({ type: "GET_POSTS", payload: data });
  }, [data]);

  const handleNext = () => {
    setPage(page === data?.max_page ? data?.max_page : page + 1);
    filterData({
      router,
      page: page === data?.max_page ? data?.max_page : page + 1,
    });
  };

  const handlePrevious = () => {
    setPage(page <= 1 ? 1 : page - 1);
    filterData({ router, page: page - 1 });
  };

  return (
    <>
      <Navbar />
      <section className="container px-16 mt-8 mb-12">
        <CreatePost />
        <div className="w-full bg-gray-800 h-0.5 mb-12"></div>
        <Posts
          posts={posts}
          handleNext={() => handleNext()}
          handlePrevious={() => handlePrevious()}
        />
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  const page = context.query.page || 1;

  const data = await axios.get(`/posts?page=${page}`);

  return {
    props: {
      data,
    },
  };
}

export default Home;
