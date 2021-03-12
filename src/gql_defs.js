import { gql } from 'apollo-boost';

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {name}
    genres
    id
  }
`;
export const ALL_GENRES = gql`{allGenres}`;
export const ME = gql`{me{username, favoriteGenre}}`;
export const ALL_AUTHORS = gql`{allAuthors{name born bookCount}}`;
export const ALL_BOOKS = gql`query allBooks($genre: String){allBooks(genre: $genre){title, published, author{name}, genres, id}}`;
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
  `;
export const EDIT_AUTHOR = gql`mutation ($name: String!, $born: Int!){
  editAuthor(
    name: $name,
    setBornTo: $born,
  ){name, born, bookCount}
}`;
export const CREATE_BOOK = gql`mutation createBook($title: String!, $published: Int, $author: String, $genres: [String!]){
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres,
  ){
    title
    published
    author {name}
    genres
    id
  }
}`;
export const CREATE_USER = gql`mutation createUser($username: String!, $favGenre: String!){
  createUser(
    username: $username,
    favoriteGenre: $favGenre,
  ) {
    username
  }
}`;
export const LOGIN = gql`mutation login($username: String!, $password: String!){
  login(
    username: $username,
    password: $password,
  ) {
    value
  }
}`;
