import libros from "../data/libros";
import exposiciones from "../data/exposiciones";
import { apiRequest } from "./api/client";
import { normalizeBooks, normalizeCategories } from "../utils/normalizers";

const fallbackCatalog = [...libros, ...exposiciones];

export const booksService = {
  async getBooks() {
    try {
      const data = await apiRequest("/books/");
      const books = normalizeBooks(data);
      return books.length ? books : fallbackCatalog;
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      return fallbackCatalog;
    }
  },

  async getCategories() {
    try {
      const data = await apiRequest("/categories/");
      return normalizeCategories(data);
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      return [...new Set(fallbackCatalog.map((item) => item.categoria))].map((nombre) => ({
        id: nombre,
        nombre,
        total: fallbackCatalog.filter((item) => item.categoria === nombre).length
      }));
    }
  },

  async getBook(bookId) {
    const data = await apiRequest(`/books/${bookId}`);
    return normalizeBooks([data])[0];
  },

  async createBook(book) {
    const data = await apiRequest("/books/", {
      method: "POST",
      body: {
        title: book.titulo ?? book.title,
        author: book.autor ?? book.author,
        pages: Number(book.pages ?? book.paginas ?? 0),
        category_id: Number(book.category_id ?? book.categoryId)
      }
    });
    return normalizeBooks([data])[0];
  },

  async updateBook(bookId, book) {
    const data = await apiRequest(`/books/${bookId}`, {
      method: "PUT",
      body: {
        title: book.titulo ?? book.title,
        author: book.autor ?? book.author,
        pages: Number(book.pages ?? book.paginas ?? 0),
        category_id: Number(book.category_id ?? book.categoryId)
      }
    });
    return normalizeBooks([data])[0];
  },

  async deleteBook(bookId) {
    await apiRequest(`/books/${bookId}`, { method: "DELETE" });
  },

  async getCategory(categoryId) {
    const data = await apiRequest(`/categories/${categoryId}`);
    return normalizeCategories([data])[0];
  },

  async createCategory(category) {
    const data = await apiRequest("/categories/", {
      method: "POST",
      body: { name: category.nombre ?? category.name }
    });
    return normalizeCategories([data])[0];
  },

  async updateCategory(categoryId, category) {
    const data = await apiRequest(`/categories/${categoryId}`, {
      method: "PUT",
      body: { name: category.nombre ?? category.name }
    });
    return normalizeCategories([data])[0];
  },

  async deleteCategory(categoryId) {
    await apiRequest(`/categories/${categoryId}`, { method: "DELETE" });
  }
};
