import { ButtonForm } from "components/Button";
import Sidebar from "parts/Sidebar";
import React, { useState, useEffect } from "react";
import FileBase64 from "react-file-base64";
import Link from "next/link";
import axios from "configs/axios";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import Router from "next/router";
import Loading from "components/Loading";
import Cookies from "js-cookie";

const Settings = ({ profile }) => {
  const [isPassword, setIsPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    fullname: "",
    username: "",
    email: "",
    avatar: "",
    password: "",
  });

  useEffect(() => {
    window.scroll(0, 0);

    if (profile) {
      setData({
        ...data,
        fullname: profile?.fullname,
        username: profile?.username,
        email: profile?.email,
        avatar: profile?.avatar,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .put(`/users/${profile._id}`, data, {
        headers: { Authorization: Cookies.get("token") },
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res?.data));
        setData({ ...data, password: "" });
        toast.success(res?.message);
        setIsLoading(false);
        setIsPassword(true);
        Router.push("/profile/settings");
      })
      .catch((err) => {
        setIsLoading(false);
        setIsPassword(true);
        toast.error(err?.response?.data?.message || err?.response?.data?.err);
      });
  };

  return (
    <>
      <Sidebar data={profile} />
      {isLoading && <Loading />}
      <section className="my-8 w-9/12 absolute top-0 right-8">
        <Link href="/">
          <a className="hover:opacity-50">
            <i className="fa fa-arrow-left mr-1"></i> Go Back
          </a>
        </Link>
        <h1 className="text-3xl font-semibold text-gray-800">Settings</h1>

        <div className="flex items-center mt-5">
          <figure className="rounded-full overflow-hidden w-24 h-24 mr-6">
            <img
              src={data?.avatar}
              alt="test"
              className="object-cover w-full h-full"
            />
          </figure>

          <div className="">
            <span className="text-gray-600">Add your picture...</span>
            <div className="mt-2">
              {/* <input
                type="file"
                className="hidden"
                name="avatar"
                ref={addPicture}
                // onChange={previewImage}
              /> */}
              <FileBase64
                multiple={false}
                onDone={({ base64 }) => setData({ ...data, avatar: base64 })}
              />
              {/* <button
                onClick={() => addPicture.current.click()}
                className="bg-gray-300 hover:bg-gray-400 transition-all duration-200 focus:outline-none shadow-inner text-white px-4 py-2 whitespace-no-wrap mt-3"
              >
                Browse
              </button> */}
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="bg-gray-50 px-8 py-4 mt-6 rounded shadow-md w-5/12"
        >
          <h3 className="text-gray-800 font-semibold mb-4 text-2xl">
            Edit account
          </h3>
          <div className="input-wrapper bg-indigo-100 flex justify-between items-center py-2 px-6  rounded-full w-full mb-4">
            <div className="">
              <i className="fa fa-user mr-4 text-blue-500"></i>
              <input
                type="text"
                className="focus:outline-none bg-transparent placeholder-gray-400"
                placeholder="Your fullname"
                name="fullname"
                value={data.fullname}
                onChange={handleChange}
              />
            </div>
            <div></div>
          </div>
          <div className="input-wrapper bg-indigo-100 flex justify-between items-center py-2 px-6  rounded-full w-full mb-4">
            <div className="">
              <i className="fas fa-user-shield text-teal-500 mr-4"></i>
              <input
                type="text"
                className="focus:outline-none bg-transparent placeholder-gray-400"
                placeholder="Your username"
                name="username"
                value={data.username}
                onChange={handleChange}
              />
            </div>
            <div></div>
          </div>
          <div className="input-wrapper bg-indigo-100 flex justify-between items-center py-2 px-6  rounded-full w-full mb-4">
            <div className="">
              <i className="fa fa-envelope text-red-500 mr-4"></i>
              <input
                type="email"
                className="focus:outline-none bg-transparent placeholder-gray-400"
                placeholder="Your email address"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
            </div>
            <div></div>
          </div>
          <div className="input-wrapper bg-indigo-100 flex justify-between items-center py-2 px-6  rounded-full w-full mb-8">
            <div className="">
              <i className="fa fa-lock mr-4 text-yellow-500"></i>
              <input
                type={isPassword ? "password" : "text"}
                className="focus:outline-none bg-transparent placeholder-gray-400"
                placeholder="Your password"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
            </div>
            <div onClick={() => setIsPassword(!isPassword)}>
              {isPassword ? (
                <i className="fa fa-eye transition-all text-gray-600 duration-200 cursor-pointer hover:text-gray-700"></i>
              ) : (
                <i className="fa fa-eye-slash transition-all text-gray-600 duration-200 cursor-pointer hover:text-gray-700"></i>
              )}
            </div>
          </div>
          <ButtonForm>Simpan</ButtonForm>
        </form>
      </section>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { token } = parseCookies(context);
  if (!token) {
    const { res } = context;
    res.writeHead(302, { Location: "/" });
    res.end();
  }
  const profile = await axios.get("/users/myprofile", {
    headers: { Authorization: token },
  });

  return {
    props: {
      profile: profile.data,
    },
  };
};
export default Settings;
