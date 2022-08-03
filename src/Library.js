import styles from "./Library.module.css";
import { LoadingIcon, UpButton, DownButton } from "./Icons";
import { useEffect, useState } from "react";

// * You are provided with an incomplete <Library /> component.
// * You are not allowed to add any additional HTML elements.
// * You are not allowed to use refs.

// * Once the <Library /> component is mounted, wait 2 seconds and then fetch the book JSON data
//   from http://localhost:3000/books.json using `fetch`.
// * Once the data is successfully fetched, hide the loading icon.
// * Take the "books" array from the fetched data and render each object in it as a <Book/> component.
// * Pass in the necessary props to each <Book/> component.
// * Typing into the search field should filter books by title and author.
// * That means a book is only shown if either its "title" and/or "author" field contains the search query.
// * The search should be case insensitive.
//   For example, "Da Vinci Code" is shown if you search for "da vinci", "Da Vinci" or "DA VincI", etc.
// * If the search field is empty, show all books.
// * Clicking the up arrow should change the book order to show the oldest books first.
// * Clicking the down arrow should change the book order to show the newest books first.

const BOOK_URL = "http://localhost:3000/books.json";

const Book = ({ title, author, publicationYear }) => {
  return (
    <div className={styles.book}>
      <h2 className={styles.bookTitle}>{title}</h2>
      <p className={styles.bookDescription}>
        Published by <strong>{author}</strong> in <em>{publicationYear}</em>
      </p>
    </div>
  );
};

const Library = () => {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  //* Handle search change
  const handleChange = (e) => {
    let lowerCaseSearch = e.target.value.toLowerCase();
    setSearch(lowerCaseSearch);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      fetch(BOOK_URL)
        .then((res) => res.json())
        .then((data) => {
          setBooks(data.books);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }, 2000);
  }, []);

  //* Sort books by publication year
  const handleSort = () => {
    if (sortOrder === "asc") {
      setBooks(books?.sort((a, b) => a.publicationYear - b.publicationYear));
      setSortOrder("desc");
    } else {
      setBooks(books?.sort((a, b) => b.publicationYear - a.publicationYear));
      setSortOrder("asc");
    }
  };

  //* Filter books by search query
  const filteredBooks = books?.filter((book) => {
    return (
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search)
    );
  });

  //* Render loading icon if data is not yet feteched
  if (loading) return <LoadingIcon />;

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.sort}>
          <span className={styles.sortLabel}>Sort by publication year</span>
          <span>
            <UpButton onClick={handleSort} className={styles.arrow} />
            <DownButton onClick={handleSort} className={styles.arrow} />
          </span>
        </div>

        <input
          type='search'
          id='search'
          placeholder='Search books...'
          className={styles.search}
          onChange={handleChange}
        />
      </header>
      <main>
        <h1>React Library</h1>

        {/* Books should be rendered here */}
        {filteredBooks && (
          <div>
            {filteredBooks.map((book, index) => (
              <Book
                title={book.title}
                author={book.author}
                publicationYear={book.publicationYear}
                key={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Library;
