import axios from "axios";

export const getCredits = () => {
  return axios.get(`${import.meta.env.API_URL}/auth/credits`);
};

export const getGithubAuth = () => {
  return axios.get(`${import.meta.env.API_URL}/auth/github`);
};

export const getGoogleAuth = () => {
  return axios.get(`${import.meta.env.API_URL}/auth/google`);
};

export const logout = () => {
  return axios.get(`http://localhost:5000/api/auth/logout`, {
    withCredentials: true
  });
};

export const login = (data: { email: string; password: string }) => {
  return axios.post(`http://localhost:5000/api/auth/login`, data);
};

export const getMe = () => {
  return axios.get(`http://localhost:5000/api/auth/me`, {
    withCredentials: true
  });
};

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axios.post(`http://localhost:5000/api/auth/register`, data);
};

export const requestPasswordReset = (data: { email: string }) => {
  return axios.post(
    `${import.meta.env.API_URL}/auth/request-password-reset`,
    data
  );
};

export const resetPassword = (
  token: string,
  data: { password: string; passwordConfirm: string }
) => {
  return axios.post(
    `${import.meta.env.API_URL}/auth/reset-password/${token}`,
    data
  );
};

export const verifyEmail = (token: string) => {
  return axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
};

export const resendVerification = (data: { email: string }) => {
  return axios.post(`http://localhost:5000/api/auth/resend-verification`, data);
};

export const createChat = (data: {
  title: string;
  prompt: string;
  image?: string;
}) => {
  return axios.post("http://localhost:5000/api/chat/create", data, {
    withCredentials: true
  });
};

// Modified sendMessage to use FormData if an image is provided
export const sendMessage = (data: {
  chat_id?: string;
  prompt: string;
  image?: File;
}) => {
  if (data.image) {
    const formData = new FormData();
    if (data.chat_id) formData.append("chat_id", data.chat_id);
    formData.append("prompt", data.prompt);
    formData.append("image", data.image);
    return axios.post("http://localhost:5000/api/chat/send", formData, {
      withCredentials: true
    });
  }
  return axios.post("http://localhost:5000/api/chat/send", data, {
    withCredentials: true
  });
};
export const sendCodeMessage = (data: {
  chat_id?: string;
  prompt: string;
  image?: File;
}) => {
  if (data.image) {
    const formData = new FormData();
    if (data.chat_id) formData.append("chat_id", data.chat_id);
    formData.append("prompt", data.prompt);
    formData.append("image", data.image);
    return axios.post("http://localhost:5000/api/chat/send-code", formData, {
      withCredentials: true
    });
  }
  return axios.post("http://localhost:5000/api/chat/send-code", data, {
    withCredentials: true
  });
};

export const getChats = () => {
  return axios.get("http://localhost:5000/api/chat/history", {
    withCredentials: true
  });
};

export const getChat = (chat_id: string) => {
  return axios.get(`http://localhost:5000/api/chat/${chat_id}`, {
    withCredentials: true
  });
};

export const updateChat = (chat_id: string, title: string) => {
  return axios.patch(`http://localhost:5000/api/chat/${chat_id}`, { title });
};

export const deleteChat = (chat_id: string) => {
  return axios.delete(`http://localhost:5000/api/chat/${chat_id}`, {
    withCredentials: true
  });
};

export const getMessages = (chat_id: string) => {
  return axios.get(`http://localhost:5000/api/chat/${chat_id}/messages`, {
    withCredentials: true
  });
};

export const uploadImage = (data: { image: string; mime_type: string }) => {
  return axios.post(`http://localhost:5000/api/chat/upload_image`, data, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" } // explicitly set JSON header for compatibility
  });
};

// New: Fetch the chat to retrieve its associated editor
export const getEditorForChat = (chat_id: string) => {
  return axios.get(`http://localhost:5000/api/chat/${chat_id}`, {
    withCredentials: true
  });
};

// New: Fetch files associated with an editor using its id
export const getFilesForEditor = (editor_id: string) => {
  return axios.get("http://localhost:5000/api/files", {
    params: { editor_id },
    withCredentials: true
  });
};

// New file CRUD functions using the API endpoints from file_ns

export const getFiles = (params: { chat_id?: string }) => {
  return axios.get(`http://localhost:5000/api/files/${params.chat_id}/files`, {
    withCredentials: true
  });
};

export const createFile = (data: {
  name: string;
  code?: string;
  chat_id?: string;
}) => {
  const url = `http://localhost:5000/api/files`;
  return axios.post(url, data, { withCredentials: true });
};

export const getFile = (file_id: string, chat_id?: string) => {
  let url = `http://localhost:5000/api/files/${file_id}`;
  if (chat_id) url += `?chat_id=${chat_id}`;
  return axios.get(url, { withCredentials: true });
};

export const updateFile = (
  file_id: string,
  data: { name: string; code?: string }
) => {
  const url = `http://localhost:5000/api/files/${file_id}`;
  return axios.put(url, data, { withCredentials: true });
};

export const deleteFile = (file_id: string) => {
  const url = `http://localhost:5000/api/files/${file_id}`;
  return axios.delete(url, { withCredentials: true });
};

export const updateEditorMessage = (chat_id: string, data: string) => {
  return axios.patch(
    `http://localhost:5000/api/chat/${chat_id}/editor_message`,
    data,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

export const sendFeedback = (feedback: string) => {
  return axios.post(
    "http://localhost:5000/api/chat/feedback",
    { feedback },
    {
      withCredentials: true
    }
  );
};
