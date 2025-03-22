import { Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/retrieve_token";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function Home() {
  const [iframeUrl, setIframeUrl] = useState("about:blank");

  const fetchDashboard = async () => {
    const [token, isError] = await getAccessToken();

    if (isError) {
      cookies.remove("access_token", { path: "/" });
      window.location.reload();
      throw new Error("Ocurrió un error al intentar obtener los datos");
    }

    const ba_url = import.meta.env.VITE_BA_URL;
    const response = await axios.get(`${ba_url}/dashboard/show`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setIframeUrl(response.data);
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchDashboard();
    };

    fetch();
  }, []);

  return (
    <iframe
      src={iframeUrl}
      style={{ border: "none", borderRadius: 20 }}
      width="100%"
      height="700"
      allowTransparency
    />
  );
}
