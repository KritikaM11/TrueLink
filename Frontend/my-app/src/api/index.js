const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const getToken = () => {
    try {
        return JSON.parse(localStorage.getItem("tl_user") || "{}")?.token ?? null;
    } catch {
        return null;
    }
};

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw Object.assign(new Error(data.message || "Request failed"), { status: res.status, data });
    return data;
}

//  Auth 
export const authApi = {
    login:   (body) => request("/auth/login",    { method: "POST", body: JSON.stringify(body) }),
    register:(body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    verify:  ()    => request("/auth/verify",    { headers: authHeaders() }),
};

//  Meetings
export const meetingApi = {
    join:        (meeting_code) => request("/meeting/join",              { method: "POST", headers: authHeaders(), body: JSON.stringify({ meeting_code }) }),
    history:     ()             => request("/meeting/history",           { headers: authHeaders() }),
    messages:    (code)         => request(`/meeting/${code}/messages`,  { headers: authHeaders() }),
    checkExists: (code)         => request(`/meeting/${code}/exists`),
};