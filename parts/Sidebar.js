import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Sidebar = ({ data }) => {
  const [userLogin, setUserLogin] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserLogin(user);
  }, []);
  const getNavLinkClass = (path) => {
    return router.pathname === path
      ? " border-r-8 border-teal-500 text-gray-50"
      : " text-gray-300";
  };
  return (
    <aside
      className="max-h-screen h-screen fixed bg-indigo-800 flxe flex-col content-between z-50"
      style={{ width: 280 }}
    >
      <div className="p-4 flex flex-col items-center mt-4">
        <figure className="border border-indigo-300 p-2 h-24 w-24 rounded-full">
          <img
            src={data?.avatar ?? "avatar"}
            alt={data?.username ?? "avatar"}
            className="w-full h-full rounded-full"
          />
        </figure>
        <h3 className="text-2xl text-indigo-300 mt-4 text-center">
          {data?.fullname ?? "fullname"}
        </h3>
        <p className="text-sm text-gray-400">@{data?.username ?? "username"}</p>
      </div>
      <div className="mt-12">
        <Link href="/profile">
          <a
            className={`w-full block mb-4 bg-gradient-to-tl from-indigo-700 font-semibold to-indigo-400  p-4 text-lg ${getNavLinkClass(
              "/profile"
            )}`}
          >
            My Posts
          </a>
        </Link>
        <Link href="/profile/settings">
          <a
            className={`mb-4 block w-full bg-gradient-to-tl from-indigo-700 font-semibold to-indigo-400  p-4 text-lg ${getNavLinkClass(
              "/profile/settings"
            )}`}
          >
            Settings
          </a>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
