import axios from "configs/axios";
import Router from "next/router";
import Post from "parts/Posts/Post";
import Sidebar from "parts/Sidebar";
import Link from "next/link";
import Cookies from "js-cookie";
import { parseCookies } from "nookies";

const Profile = ({ data, profile }) => {
  const deletePost = (id) => {
    axios
      .delete(`/posts/${id}`, {
        headers: { Authorization: Cookies.get("token") },
      })
      .then((res) => {
        Router.push("/profile");
      });
  };
  return (
    <div className="">
      <Sidebar data={profile} />
      <section className="my-8 w-9/12 absolute top-0 right-8">
        <Link href="/">
          <a className="hover:opacity-50">
            <i className="fa fa-arrow-left mr-1"></i> Go Back
          </a>
        </Link>
        <h1 className="text-3xl font-semibold text-gray-800">MyPosts</h1>
        <div className="grid grid-cols-2 gap-4 mt-8">
          {data.length > 0 ? (
            data?.map((post) => (
              <Post item={post} onClick={() => deletePost(post._id)} />
            ))
          ) : (
            <p>User not have post</p>
          )}
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);
  if (!token) {
    const { res } = context;
    res.writeHead(302, { Location: "/" });
    res.end();
  }
  const myposts = await axios.get("/posts/myposts", {
    headers: { Authorization: token },
  });
  const profile = await axios.get("/users/myprofile", {
    headers: { Authorization: token },
  });

  return {
    props: {
      data: myposts.data,
      profile: profile.data,
    },
  };
}
export default Profile;
