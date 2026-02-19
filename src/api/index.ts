import { Api } from "./api";

// Instantiate API client
const http = new Api();

// ✅ Set baseURL from Next.js env
http.instance.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Attach token interceptor for browser-side requests
if (typeof window !== "undefined") {
  http.instance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ Global response interceptor: redirect to login if token expired/unauthorized
  http.instance.interceptors.response.use(
    (response) => response,
    (error) => {
      try {
        const status = error?.response?.status;
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message || "";

        const isTokenExpired =
          status === 401 ||
          status === 403 ||
          /token.*expired/i.test(String(message));

        if (isTokenExpired) {
          // Clear local auth state and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Use hard redirect to avoid stale state
          window.location.replace("/login");
        }
      } catch (e) {
        // Ignore errors in interceptor; fall through to rejection
      }
      return Promise.reject(error);
    }
  );
}

export default http;
