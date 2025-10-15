import axios from "axios";
import https from "https";

export async function geocode(address) {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "StayzyApp/1.0 (sidhicircle@gmail.com)",
      },
      httpsAgent: new https.Agent({ family: 4 }),
      timeout: 15000,
    });

    if (res.data.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lon: parseFloat(res.data[0].lon),
        display_name: res.data[0].display_name,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Geocoding request failed:", err.message);
    return null;
  }
}
