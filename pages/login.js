import React, { useState } from "react";
import Link from "next/link";
import axios from "configs/axios";
import { useRouter } from "next/router";
import { setCookie, parseCookies } from "nookies";
import { ButtonForm } from "components/Button";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [isPassword, setIsPassword] = useState(true);
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const submit = (e) => {
    e.preventDefault();
    axios
      .post("/auth/login", data)
      .then((res) => {
        setCookie(null, "token", res?.token, {
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
        localStorage.setItem("user", JSON.stringify(res?.user));

        router.push("/");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <img
        src="/data-analysis.svg"
        alt=""
        className=" w-52
       h-52
      "
      />
      <form
        onSubmit={submit}
        className="bg-gray-50 py-4 px-8 mt-4 rounded shadow-md"
      >
        <h3 className="text-gray-800 font-semibold mb-5 text-center text-2xl">
          Login to your account
        </h3>
        <div className="input-wrapper bg-indigo-100 flex justify-between items-center py-2 px-6  rounded-full w-full mt-2 mb-4">
          <div className="">
            <i className="fa fa-user mr-4 text-blue-500" aria-hidden="true"></i>
            <input
              type="text"
              className="focus:outline-none bg-transparent focus:bg-transparent placeholder-gray-400"
              placeholder="Your username or email"
              name="username"
              value={data.username}
              onChange={handleChange}
            />
          </div>
          <div></div>
        </div>
        <div className="input-wrapper bg-indigo-100 flex justify-between items-center py-2 px-6  rounded-full w-full mb-2">
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
        <p className="text-blue-500 text-center my-4">Forgot your password ?</p>
        <ButtonForm>Login</ButtonForm>
      </form>
      <p className="mt-6 text-gray-800">
        Need an account?{" "}
        <Link href="/register">
          <a className="text-blue-500 underline">Register</a>
        </Link>
      </p>
    </div>
  );
};

export default Login;

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
