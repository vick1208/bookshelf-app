const BOOK_STORAGE_KEY = "book-storage-key";
const RENDER_SHELF = "render-shelf";

const generateObjectBook = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};


const generateBookId = () => +new Date();

function findABookIndex(books, bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return -1;
}

function getAllBooks() {
  if (typeof Storage !== "undefined") {
    const books = localStorage.getItem(BOOK_STORAGE_KEY);
    if (books !== null) {
      return JSON.parse(books);
    }
  }
  return [];
}

function updateShelf(books) {
  if (typeof Storage !== "undefined") {
    localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(books));
  }
}

const markBookAsFinished = (bookId) => {
  const books = getAllBooks();
  const bookIndex = findABookIndex(books, bookId);
  if (bookIndex == -1) return null;
  books[bookIndex].isCompleted = true;
  updateShelf(books);
  reloadAllBooks();
};

const undoFinishedBook = (bookId) => {
  const books = getAllBooks();
  const bookIndex = findABookIndex(books, bookId);
  if (bookIndex == -1) return null;
  books[bookIndex].isCompleted = false;
  updateShelf(books);
  reloadAllBooks();
};

// Sementara belum menggunakan sistem update buku karena perlu menggunakan dua fungsi untuk prosesnya 
// const editBook = (bookId) => {

//   const books = getAllBooks();
//   const bookIndex = findABookIndex(books, bookId);
//   if (bookIndex == -1) return null;
//   let existBookTitle = books[bookIndex].title;
//   let existBookAuthor = books[bookIndex].author;
//   let existBookYP = books[bookIndex].year;
//   let existBookAR = books[bookIndex].isCompleted

//   document.getElementById("bookTitle").value = existBookTitle;
//   document.getElementById("bookAuthor").value = existBookAuthor;
//   document.getElementById("bookYP").value = existBookYP;
//   document.getElementById("inputAR").checked = existBookAR;

//   const editNameButton = document.getElementById("bookSubButton");
//   editNameButton.innerText = 'Edit Buku';

// }


const deleteBook = (bookId) => {
  const confirmTitle = "Hapus Buku";
  const confirmMsg = "Anda yakin untuk menghapus data buku ini?";
  Swal.fire({
    title: confirmTitle,
    text: confirmMsg,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3B82F6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus datanya",


  }).then((result) => {
    if (result.isConfirmed) {
      const books = getAllBooks();
      const bookIndex = findABookIndex(books, bookId);
      if (bookIndex == -1) return null;

      books.splice(bookIndex, 1);
      updateShelf(books);
      reloadAllBooks();
      Swal.fire({
        title: "Data Buku Dihapus",
        icon: "success",
      });
    }
  });
};

function addNewBook() {
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const year = parseInt(document.getElementById("bookYP").value);
  const isCompleted = document.getElementById("inputAR").checked;

  const bookId = generateBookId();
  const bookObject = generateObjectBook(
    bookId,
    title,
    author,
    year,
    isCompleted
  );

  const books = getAllBooks();
  books.push(bookObject);

  updateShelf(books);
  reloadAllBooks();
}

function makeBooks(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const newCard = document.createElement("div");
  newCard.classList.add("book-card");

  const newTitle = document.createElement("h4");
  newTitle.innerText = title;
  newCard.append(newTitle);

  const newAuthor = document.createElement("p");
  newAuthor.innerText = author;
  newCard.append(newAuthor);

  const newBYP = document.createElement("p");
  newBYP.innerText = year;
  newCard.append(newBYP);

  const actionButtons = document.createElement("div");
  actionButtons.classList.add("buttons");


  const btnReadNotRead = document.createElement("button");
  btnReadNotRead.classList.add("btn-read-not-read");
  if (isCompleted) {
    btnReadNotRead.innerHTML =
      "<i class='fa-solid fa-book-open'></i> Belum Selesai";
    btnReadNotRead.addEventListener("click", function () {
      undoFinishedBook(id);
    });
  } else {
    btnReadNotRead.innerHTML =
      "<i class='fa-solid fa-check'></i> Selesai Membaca";
    btnReadNotRead.addEventListener("click", function () {
      markBookAsFinished(id);
    });
  }
  actionButtons.append(btnReadNotRead);


  // const btnEditBook = document.createElement("button");
  // btnEditBook.classList.add("btn-edit-book");
  // btnEditBook.innerHTML = "<i class='fa-regular fa-pen-to-square'></i> Edit Judul Buku";
  // btnEditBook.addEventListener("click", () => {
  //   editBook(id);
  // });
  // actionButtons.append(btnEditBook);


  const btnRemBook = document.createElement("button");
  btnRemBook.classList.add("btn-remove-book");
  btnRemBook.innerHTML = "<i class='fa-solid fa-trash-can'></i> Hapus Buku";
  btnRemBook.addEventListener("click", function () {
    deleteBook(id);
  });

  actionButtons.append(btnRemBook);

  newCard.append(actionButtons);

  return newCard;
}

const clearForm = () => {
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookYP").value = "";
  document.getElementById("inputAR").value = "";
};

const reloadAllBooks = () => {
  document.dispatchEvent(new Event(RENDER_SHELF));
};

const searchBooks = (keyword) => {
  const books = getAllBooks();
  const searchedResult = [];
  for (const book of books) {
    const { title } = book;
    if (title.toLowerCase().includes(keyword)) {
      searchedResult.push(book);
    }
  }

  return searchedResult;
};

document.addEventListener("load", () => {
  if (typeof Storage !== "undefined") {
    if (localStorage.getItem(BOOK_STORAGE_KEY === null)) {
      localStorage.setItem(BOOK_STORAGE_KEY, "{}");
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBookForm");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addNewBook();
    clearForm();
  });

  const searchBookForm = document.getElementById("searchBookForm");
  searchBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = document.getElementById("searchBookKeyword").value;
    const foundBook = searchBooks(keyword);
    renderBookShelf(foundBook);
  });

  reloadAllBooks();
});

function renderBookShelf(bookShelfParam) {
  const unfinishedBookList = document.getElementById("list-unfinished-book");
  unfinishedBookList.innerHTML = "";
  const finishedBookList = document.getElementById("list-finished-book");
  finishedBookList.innerHTML = "";

  let books;
  if (bookShelfParam) {
    books = bookShelfParam;
  } else {
    books = getAllBooks();
  }

  for (const book of books) {
    const bookElement = makeBooks(book);
    if (!book.isCompleted) {
      unfinishedBookList.append(bookElement);
    } else {
      finishedBookList.append(bookElement);
    }
  }
}

document.addEventListener(RENDER_SHELF, () => {
  renderBookShelf();
});
