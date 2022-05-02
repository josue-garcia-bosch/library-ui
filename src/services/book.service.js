import axios from 'axios';
import authHeader from './auth.header';
import config from '../config';

const API_URL = `${config.BE_URI}/api/v1/books`;

class BookService {
    getBooks(sort, limit, page, search) {
        return axios.get(API_URL + '/', { params: { sort: sort, limit: limit, page: page, search: search || null }, headers: authHeader() });
    }

    getBookById(bookId) {
        return axios.get(API_URL + `/${bookId}`, { headers: authHeader() });
    }

    deleteBookById(bookId) {
        return axios.delete(API_URL + `/${bookId}`, { headers: authHeader() });
    }

    createBook(book) {
        return axios.post(API_URL + '/', {
            imageURL: book.imageURL,
            title: book.title,
            yearOfPublication: book.yearOfPublication,
            author: book.author,
            category: book.category
        }, { headers: authHeader() });
    }

    updateBook(bookId, book) {
        return axios.patch(API_URL + `/${bookId}`, book, { headers: authHeader() });
    }

    assignBook(bookId, assignId) {
        return axios.patch(API_URL + `/${bookId}/assign/${assignId}`,{} ,{ headers: authHeader() });
    }

    borrowBook(bookId) {
        return axios.patch(API_URL + `/${bookId}/borrow`,{}, { headers: authHeader() });
    }

    returnBook(bookId) {
        return axios.patch(API_URL + `/${bookId}/return`, {},{ headers: authHeader() });
    }


}
export default new BookService();