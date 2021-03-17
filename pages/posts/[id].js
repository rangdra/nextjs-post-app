import React from "react";
import axios from "configs/axios";
import Navbar from "parts/Navbar";
import Post from "parts/Posts/Post";

const DetailPost = ({ data }) => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-32 mt-12">
        <Post item={data} />
      </div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const res = await axios.get(`/posts/${context.params.id}`);

  return {
    props: {
      data: res.data,
    },
  };
};
export default DetailPost;
