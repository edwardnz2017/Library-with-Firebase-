// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCKi53YH7YSn7poBpQJZySG91TPreioHxk',
  authDomain: 'library-7c519.firebaseapp.com',
  databaseURL: 'https://library-7c519.firebaseio.com',
  projectId: 'library-7c519',
  storageBucket: 'library-7c519.appspot.com',
  messagingSenderId: '596323438358',
  appId: '1:596323438358:web:f1ff76e90cbf7334d8ca37',
  measurementId: 'G-91L2ZV7RC1',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//firebase functions
const saveBookFirestore = (name, author, pages, status) => {
  return firebase
    .firestore()
    .collection('books')
    .add({
      name: name,
      author: author,
      pages: pages,
      status: status,
    })
    .catch(function (error) {
      console.error('Error adding new book to database', error);
    });
};

const loadBook = () => {
  const query = firebase.firestore().collection('books');
  query.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const book = change.doc.data();
      if (change.type === 'removed') {
        deleteBookFirestone(change.doc.id);
      } else if (change.type === 'modified') {
        let changedDiv = document.querySelector(`.${change.doc.id}`);
        query
          .doc(change.doc.id)
          .get()
          .then((doc) => {
            changedDiv.innerText = doc.data().status;
          });
      } else {
        displayBook(
          book.name,
          book.author,
          book.pages,
          book.status,
          change.doc.id
        );
      }
    });
  });
};

const displayBook = (name, author, pages, status, id) => {
  let bookDiv = document.createElement('div');
  let bookTitle = document.createElement('div');
  let bookAuthor = document.createElement('div');
  let bookPages = document.createElement('div');
  let bookStatus = document.createElement('div');
  let bookFoot = document.createElement('div');
  bookDiv.setAttribute('id', id);
  let deleteButton = document.createElement('button');
  let toggleButton = document.createElement('button');
  deleteButton.classList.add('delete-btn', 'divButton');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
    firebase.firestore().collection('books').doc(id).delete();
  });
  toggleButton.classList.add('toggle-btn', 'divButton');
  toggleButton.innerText = 'Toggle Read';
  toggleButton.addEventListener('click', () => {
    toggleReadFirestore(id);
  });
  bookDiv.classList.add('bookDiv');
  bookTitle.innerText = name + ' ';
  bookAuthor.innerText += author + ' ';
  bookPages.innerText += pages + ' pages';
  bookStatus.innerText += status + ' ';
  bookStatus.classList.add(id);
  bookTitle.classList.add('bookTitle');
  bookAuthor.classList.add('bookAuthor');
  bookStatus.classList.add('bookStatus');
  bookFoot.classList.add('bookFoot');
  catalogue.appendChild(bookDiv);
  bookDiv.appendChild(bookTitle);
  bookDiv.appendChild(bookAuthor);
  bookDiv.appendChild(bookPages);
  bookDiv.appendChild(bookStatus);
  bookDiv.appendChild(bookFoot);
  bookFoot.appendChild(deleteButton);
  bookFoot.appendChild(toggleButton);
};

const deleteBookFirestone = (id) => {
  const div = document.getElementById(id);
  if (div) {
    div.parentNode.removeChild(div);
  }
};

const toggleReadFirestore = (id) => {
  firebase
    .firestore()
    .collection('books')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.data().status === 'Read') {
        firebase.firestore().collection('books').doc(id).update({
          status: 'Not read yet',
        });
      } else if (doc.data().status === 'Not read yet') {
        firebase.firestore().collection('books').doc(id).update({
          status: 'Read',
        });
      }
    });
};
let myLibrary = []; //This will store the book information that is added by the user.

function Book(name, author, pages, status) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.status = status;
}

//Event listener for submit button, which will transfer inputted information to addBookToLibrary
const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  addBookToLibrary();
  document.getElementById('book-name').value = '';
  document.getElementById('author-name').value = '';
  document.getElementById('pages').value = '';
  document.getElementById('read').checked = false;
  document.getElementById('not-read-yet').checked = false;
});

//This will add a new Book object to the myLibrary[] array.
function addBookToLibrary() {
  let bookName = document.getElementById('book-name').value;
  let authorName = document.getElementById('author-name').value;
  let pages = document.getElementById('pages').value;
  let readOrNot;
  if (document.getElementById('read').checked) {
    readOrNot = 'Read';
  } else {
    readOrNot = 'Not read yet';
  }
  if (bookName === '' || authorName === '' || pages === 0) {
    return alert('Enter details of the book!');
  }
  saveBookFirestore(bookName, authorName, pages, readOrNot);
}

const catalogue = document.querySelector('.catalogue');

//This adds an event to the Toggle Read button, which will change the read status
function togRead() {
  let toggle = document.querySelectorAll('.toggle-btn');
  toggle.forEach((button) => {
    if (button.classList.contains('eventOn')) {
      return;
    }
    button.classList.add('eventOn');
    button.addEventListener('click', (e) => {
      Book.prototype.changeReadStatus = function () {
        this.status = this.status === 'Read' ? 'Not read yet' : 'Read';
      };
      myLibrary[e.srcElement.id].changeReadStatus();
      render();
    });
  });
}

loadBook();
