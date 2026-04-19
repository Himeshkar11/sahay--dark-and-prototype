import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──
export const authAPI = {
  login:  (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/signup", data),
};

// ── ISSUES ──
export const issuesAPI = {
  getAll:       (params) => api.get("/issues", { params }),
  getById:      (id)     => api.get(`/issues/${id}`),
  create:       (data)   => api.post("/issues", data),
  update:       (id, data) => api.patch(`/issues/${id}`, data),
  delete:       (id)     => api.delete(`/issues/${id}`),
  matchAndAssign: (id)   => api.post(`/issues/${id}/match`),
};

// ── ASSIGNMENTS ──
export const assignmentsAPI = {
  getMine:         ()   => api.get("/assignments/my"),
  getAll:          ()   => api.get("/assignments"),
  getForIssue:     (id) => api.get(`/assignments/issue/${id}`),
  markComplete:    (id) => api.patch(`/assignments/${id}/complete`),
  verifyAndCredit: (id, data) => api.patch(`/assignments/${id}/verify`, data),
};

// ── USERS ──
export const usersAPI = {
  getProfile:      ()     => api.get("/users/profile"),
  updateProfile:   (data) => api.patch("/users/profile", data),
  getAllVolunteers: ()     => api.get("/users/volunteers"),
};

// ── DONATIONS ──
export const donationsAPI = {
  create:    (data) => api.post("/donations", data),
  getMine:   ()     => api.get("/donations/my"),
  getAll:    ()     => api.get("/donations"),
};

export default api;