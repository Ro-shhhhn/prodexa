import ApiService from "./api";

class ProductService {
  // Fetch all products
  async getProducts() {
    return ApiService.get("/products");
  }

  // Fetch a single product by ID
  async getProductById(id) {
    return ApiService.get(`/products/${id}`);
  }

  // Create a new product
  async createProduct(data) {
    return ApiService.post("/products", data);
  }

  // Update a product
  async updateProduct(id, data) {
    return ApiService.put(`/products/${id}`, data);
  }

  // Delete a product
  async deleteProduct(id) {
    return ApiService.delete(`/products/${id}`);
  }
}

export default new ProductService();
