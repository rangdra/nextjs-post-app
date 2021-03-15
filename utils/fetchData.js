import axios from "configs/axios";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";

const { token } = parseCookies();

export const deletePost = (url, router) => {
  axios.delete(url, { headers: { Authorization: token } }).then((res) => {
    toast.success(res?.message);
    router.push("/");
  });
};
