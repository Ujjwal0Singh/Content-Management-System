import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api.js";

export const fetchPages = createAsyncThunk("pages/fetchAll", async () => {
  const { data } = await api.get("/content");
  return data.pages;
});

export const fetchPageById = createAsyncThunk("pages/fetchById", async (id) => {
  const { data } = await api.get(`/content/${id}`);
  return data.page;
});

export const createPage = createAsyncThunk("pages/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/content", payload);
    return data.page;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Create failed");
  }
});

export const updatePage = createAsyncThunk("pages/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/content/${id}`, payload);
    return data.page;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

export const deletePage = createAsyncThunk("pages/delete", async (id) => {
  await api.delete(`/content/${id}`);
  return id;
});

const pagesSlice = createSlice({
  name: "pages",
  initialState: { items: [], current: null, status: "idle", error: null },
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchPageById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.current = action.payload;
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearCurrent } = pagesSlice.actions;
export default pagesSlice.reducer;
