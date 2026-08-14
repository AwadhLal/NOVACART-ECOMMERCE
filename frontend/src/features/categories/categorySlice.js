import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../api/categoryService';

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await categoryService.getAll();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await categoryService.create(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await categoryService.update(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await categoryService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchCategories.pending, pending)
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, rejected)

      .addCase(createCategory.pending, pending)
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, rejected)

      .addCase(updateCategory.pending, pending)
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.categories.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.categories[idx] = action.payload;
      })
      .addCase(updateCategory.rejected, rejected)

      .addCase(deleteCategory.pending, pending)
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, rejected);
  },
});

export const { clearCategoryError } = categorySlice.actions;

export const selectAllCategories = (state) => state.categories.categories;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;

export default categorySlice.reducer;
