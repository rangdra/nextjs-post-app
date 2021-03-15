import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { parseCookies, destroyCookie } from "nookies";
import { CSSTransition } from "react-transition-group";
import Router from "next/router";

const Navbar = () => {
  const [isDropwown, setIsDropwown] = useState(false);
  const [userLogin, setUserLogin] = useState(null);
  const { token } = parseCookies();
  const dropdowMenuRef = useRef(null);

  let user = null;
  if (token) {
    user = true;
  } else {
    user = false;
  }

  const clickOutside = (e) => {
    if (dropdowMenuRef && !dropdowMenuRef.current?.contains(e.target)) {
      setIsDropwown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", clickOutside);
    return () => {
      window.removeEventListener("mousedown", clickOutside);
    };
  }, []);
  useEffect(() => {
    setUserLogin(JSON.parse(localStorage.getItem("user")));
  }, []);

  const logout = () => {
    destroyCookie(null, "token");

    localStorage.removeItem("user");

    Router.push("/");
  };
  return (
    <nav className="bg-gray-100 py-5 shadow-lg">
      <div className="container flex justify-between items-center px-16">
        <div className="logo">
          <Link href="/">
            <a className="text-3xl text-indigo-500 font-bold">
              SOSMED <i className="fa fa-paper-plane" aria-hidden="true"></i>
            </a>
          </Link>
        </div>
        <div className="">
          {user ? (
            <div className="flex items-center">
              <figure className="border border-gray-400 p-0.5 rounded-full">
                <img
                  src={userLogin?.avatar ?? "/login2.jpg"}
                  alt={userLogin?.username}
                  className="h-10 w-10 rounded-full"
                />
              </figure>
              <div
                className="ml-2 flex items-center cursor-pointer text-gray-800 hover:text-gray-500 relative"
                onClick={() => setIsDropwown(!isDropwown)}
                ref={dropdowMenuRef}
              >
                <p className="mr-4">{userLogin?.fullname}</p>
                <i
                  className={`fa fa-chevron-down text-lg transition-all duration-300 ${
                    isDropwown ? "transform -rotate-180" : ""
                  }`}
                  aria-hidden="true"
                ></i>
                <CSSTransition
                  in={isDropwown}
                  timeout={500}
                  classNames="my-dropdown"
                  unmountOnExit
                >
                  <div className="absolute w-full bg-gray-50 top-10 shadow-lg rounded-md">
                    <div className="py-2 px-4 border-b border-gray-600 relative hover:bg-gray-200 transition-all duration-200">
                      <Link href="/profile">
                        <a className="text-gray-800 link-wrapped">
                          {" "}
                          <i
                            class="fa fa-address-card mr-2"
                            aria-hidden="true"
                          ></i>{" "}
                          Profile
                        </a>
                      </Link>
                    </div>
                    <div className="py-2 px-4 hover:bg-gray-200 transition-all duration-200">
                      <p className="text-gray-800" onClick={logout}>
                        <i className="fas fa-sign-out-alt text-gray-600 mr-2"></i>{" "}
                        Logout
                      </p>
                    </div>
                  </div>
                </CSSTransition>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login">
                <a className="bg-indigo-600 text-gray-50 transition-all duration-200 py-2 px-4 mr-2 focus:outline-none hover:bg-gray-50 hover:text-indigo-600 transform active:translate-y-1 border hover:border-indigo-600">
                  SIGN IN
                </a>
              </Link>
              <Link href="/register">
                <a className="bg-gray-50 border border-indigo-600 text-indigo-600 transition-all duration-200 py-2 px-4 focus:outline-none hover:bg-indigo-500 hover:text-gray-50 transform active:translate-y-1">
                  SIGN UP
                </a>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
