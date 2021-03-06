import React, { useState, useImperativeHandle } from 'react';
import { useQuery } from 'react-apollo';

const Books = React.forwardRef(({ show, genresResult, ALL_BOOKS }, ref) => {
  const [genre, setGenre] = useState('');

  const resetGenre = () => {
    setGenre('');
  };

  useImperativeHandle(ref, () => ({ resetGenre }));

  const booksResult = useQuery(ALL_BOOKS, { variables: { genre } });

  if (!show) {
    return null;
  }

  if (booksResult.loading || genresResult.loading) {
    return <div>loading...</div>;
  }

  const books = booksResult && booksResult.data ? booksResult.data.allBooks : null;
  const genres = genresResult && genresResult.data ? genresResult.data.allGenres : null;

  const Genres = () => (
    <div>
      {genres ? genres.map((x) => <button key={x} type="button" onClick={async () => { setGenre(x); }}>{x}</button>) : null}
      <button type="button" onClick={() => resetGenre()}>all genres</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: genre === '' ? 'none' : '' }}>in genre <b>{genre}</b></div><p />
      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: 'left' }}>
              <b>name</b>
            </th>
            <th style={{ textAlign: 'left' }}>
              <b>author</b>
            </th>
            <th style={{ textAlign: 'left' }}>
              <b>published</b>
            </th>
          </tr>
          {books ? books.map((x, y) => (
            <tr key={x.title.concat(y)}>
              <td>{x.title}</td>
              <td>{x.author.name}</td>
              <td>{x.published}</td>
            </tr>
          )) : null}
        </tbody>
      </table>
      <Genres />
    </div>
  );
});

export default Books;
