import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api.js";

export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

const storedToken = localStorage.getItem("cms_token");
const storedAdmin = localStorage.getItem("cms_admin");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: storedAdmin ? JSON.parse(storedAdmin) : null,
    token: storedToken || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("cms_token");
      localStorage.removeItem("cms_admin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        localStorage.setItem("cms_token", action.payload.token);
        localStorage.setItem("cms_admin", JSON.stringify(action.payload.admin));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
