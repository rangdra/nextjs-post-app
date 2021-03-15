import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "configs/axios";
import { parseCookies } from "nookies";
import { ButtonForm } from "components/Button";
import { toast } from "react-toastify";

const Register = () => {
  const [isPassword, setIsPassword] = useState(true);
  const [isCfPassword, setIsCfPassword] = useState(true);
  const [data, setData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    cf_password: "",
  });

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submit = (e) => {
    e.preventDefault();

    axios
      .post("/auth/register", data)
      .then((res) => {
        if (res) {
          setData({
            ...data,
            fullname: "",
            username: "",
            email: "",
            password: "",
            cf_password: "",
          });
          setIsPassword(true);
          setIsCfPassword(true);
          toast.success(res?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? "error");
      });
  };
  return (
    <div className="h-screen flex justify-center items-center flex-col mt-8 mb-12">
      <img
        src="/airplane.svg"
        alt=""
        className="w-48
       h-48
      "
      />

      <form
        onSubmit={submit}
        className="bg-gray-50 px-8 py-4 mt-4 rounded shadow-md"
      >
        <h3 className="text-gray-800 font-semibold mb-4 text-center text-2xl">
          Register an account
        </h3>
        <div className="input-wrapper bg-indigo-100 flex justify-between items-center py-2 px-6  rounded-full w-full mb-4">
          <div className="">
            <i className="fa fa-user mr-4 text-blue-500" aria-hidden="true"></i>
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
            <i class="fas fa-user-shield text-teal-500 mr-4"></i>
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
            <i
              className="fa fa-envelope text-red-500 mr-4"
              aria-hidden="true"
            ></i>
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
        <div className="input-wrapper bg-indigo-100 flex justify-between items-center py-2 px-6  rounded-full w-full mb-4">
          <div className="">
            <i
              className="fa fa-lock mr-4 text-yellow-500"
              aria-hidden="true"
            ></i>
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
              <i
                className="fa fa-eye transition-all text-gray-600 duration-200 cursor-pointer hover:text-gray-700"
                aria-hidden="true"
              ></i>
            ) : (
              <i
                className="fa fa-eye-slash transition-all text-gray-600 duration-200 cursor-pointer hover:text-gray-700"
                aria-hidden="true"
              ></i>
            )}
          </div>
        </div>
        <div className="input-wrapper bg-indigo-100 flex justify-between items-center py-2 px-6  rounded-full w-full mb-8">
          <div className="">
            <i
              className="fa fa-lock mr-4 text-yellow-500"
              aria-hidden="true"
            ></i>
            <input
              type={isCfPassword ? "password" : "text"}
              className="focus:outline-none bg-transparent placeholder-gray-400"
              placeholder="Confirm password"
              name="cf_password"
              value={data.cf_password}
              onChange={handleChange}
            />
          </div>
          <div onClick={() => setIsCfPassword(!isCfPassword)}>
            {isCfPassword ? (
              <i
                className="fa fa-eye transition-all duration-200 text-gray-600 cursor-pointer hover:text-gray-700"
                aria-hidden="true"
              ></i>
            ) : (
              <i
                className="fa fa-eye-slash transition-all text-gray-600 duration-200 cursor-pointer hover:text-gray-700"
                aria-hidden="true"
              ></i>
            )}
          </div>
        </div>
        <ButtonForm>Register</ButtonForm>
      </form>
      <p className="mt-6 text-gray-800">
        have an account?{" "}
        <Link href="/login">
          <a className="text-blue-500 underline">Login</a>
        </Link>
      </p>
    </div>
  );
};

export default Register;

export async function getServerSideProps(ctx) {
  const { token } = parseCookies(ctx);

  if (token) {
    const { res } = ctx;
    res.writeHead(302, { Location: "/" });
    res.end();
  }

  return {
    props: {},
  };
}
