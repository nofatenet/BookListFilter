/*jshint esversion: 6 */
// Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/
// Book Class:
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {

        const StoredBooks = [
            {
                title: "Do Androids Dream of Electric Sheep?",
                author: "Philip K Dick",
                isbn: "9780345404473"
            },
            {
                title: "1984",
                author: "George Orwell",
                isbn: "9780452284234"
            },
            {
                title: "Crime and Punishment",
                author: "Fyodor Dostoyevsky",
                isbn: "9780143107637"
            }
        ];
        const dummyBooks = StoredBooks;
        dummyBooks.forEach((book) => UI.addBookToList(book));

        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById("book-list");
        const row = document.createElement("tr");
        row.className = "rowie";
        row.innerHTML = `
            <td class="titles-item"><a href="https://isbnsearch.org/search?s=${book.title}" target="_blank">${book.title}</a></td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-warning btn-sm delete">
            x
            </a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        // Selectriere über contains methode. Class "delete" wurde festgelegt:
        if(el.classList.contains("delete")){
            el.parentElement.parentElement.remove();
            // 2 mal parent, also nach oben, um zum tr-tag zu gelangen, welches removed werden soll.
        }
    }

    static inputMsg(message, className, timer){
        //document.getElementById("errorMsg").innerText = "Fail";
        const errMsg = document.createElement("button");
        errMsg.id = "errMsg";
        errMsg.style.fontSize = "2em";
        errMsg.className = className;
        errMsg.innerHTML = `
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-exclamation-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        </svg>` + " " + message;
        const bookform = document.getElementById("book-form");
        const errorMsg = document.getElementById("errorMsg");
        errorMsg.appendChild(errMsg);
        //Make it disappear:
        setTimeout(() => document.getElementById("errMsg").remove(), timer);
    }

    static clear() {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem("books") === null ) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
            // String zu JSON verwandelt
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add Book
document.getElementById("book-form").addEventListener('submit', (e) =>
    {
        // Form Values:
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const isbn = document.getElementById("isbn").value;

        // Validate Input:
        if(title === "" || author === "" || isbn === "") {
            UI.inputMsg("Failed To Add!", 'btn btn-danger', 2500);
        } else {
            // Book Construction for new Book-Instance:
            const book = new Book(title, author, isbn);
            console.log(book);

            // Add Book to UI
            UI.addBookToList(book);
            //Add Book to Store
            Store.addBook(book);

            // Adding worked
            UI.inputMsg("Book Added!", "btn btn-success", 2500);

            // Clear Form Field
            UI.clear();
        }
});

// Event: Remove Book
document.getElementById("book-list").addEventListener('click', (e) => {
    // Remove Book from UI
    UI.deleteBook(e.target);
    // Remove from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.innerText);
    
    // Removing worked
    UI.inputMsg("Book Removed!", "btn btn-dark", 2500);
});

// Little Extra:
// Search with Filtered Text Input

let filterInput = document.getElementById("filterInput");

filterInput.addEventListener("keyup", filterNames);

function filterNames(){
    //get Value of Input in Search
    let filterValue = document.getElementById("filterInput").value.toUpperCase();
    console.log(filterValue);
    
    //get table
    let titles = document.getElementById("titles");
    //get items
    let items = titles.querySelectorAll("tr.rowie");
    // let items = titles.querySelectorAll("td.titles-item"); //ONLY the CELL 

    //Loop through items collection
    for (let i = 0; i < items.length; i++) {
        let a = items[i].getElementsByTagName("a")[0];
        // if matched
        if(a.outerHTML.toUpperCase().indexOf(filterValue) > -1 ) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}