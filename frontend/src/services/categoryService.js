import ApiService from "./api";

class CategoryService {
  // Fetch all categories
  async getCategories() {
    return ApiService.get("/categories");
  }

  // Fetch a single category by ID
  async getCategoryById(id) {
    return ApiService.get(`/categories/${id}`);
  }

  // Create a new category
  async createCategory(data) {
    return ApiService.post("/categories", data);
  }

  // Update a category
  async updateCategory(id, data) {
    return ApiService.put(`/categories/${id}`, data);
  }

  // Delete a category
  async deleteCategory(id) {
    return ApiService.delete(`/categories/${id}`);
  }
}

export default new CategoryService();
