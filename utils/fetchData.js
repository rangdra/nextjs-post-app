import axios from "configs/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const deletePost = (id, router) => {
  axios
    .delete(`/posts/${id}`, {
      headers: { Authorization: Cookies.get("token") },
    })
    .then((res) => {
      toast.success(res?.message);
      router.push("/");
    });
};

export const likePost = (id, router) => {
  axios
    .put(
      `/posts/${id}/likes`,
      {},
      { headers: { Authorization: Cookies.get("token") } }
    )
    .then((res) => {
      {
        router.pathname === "/posts/[id]"
          ? router.push(`/posts/${id}`)
          : router.push("/");
      }
    });
};
