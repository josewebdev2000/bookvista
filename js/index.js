"use strict";

function mainIndex()
{
    // Invoke the two main Theme Changers
    const lightThemeChanger = new ThemeChanger("#light-theme-btn", "#theme-stylesheet", "css/light.css");
    const darkThemeChanger = new ThemeChanger("#dark-theme-btn", "#theme-stylesheet", "css/dark.css");

    // Hide error content class at the beginning
    hideErrorContentByDefault();

    // Show books by title when required
    grabBooksTitleToSend();

    // Call the sidebar shower
    sidebarShowOnClick();

    // Add event listener to try again button to hide error and show default content of modal
    tryAgainShowDefaultModalOnClick();

    // The same for when the edit modal is clicked
    tryAgainEditShowDefaultModalOnClick();

    // Add event listener for close button to show default modal content
    newBookShowDefaultModalOnClick();

    // Manage all operations to grab all books data
    getAllBooksHandler();

    // Manage all operations to add a new book
    postNewBookHandler();

    // Fade Out and Fade In Helper Widgets
    fadeOutHelperWidgetsOnModalShow();

    // Fade In Helper Widgets
    fadeInHelperWidgetsOnModalHidden();
}

function grabBooksTitleToSend()
{
    $("#search-book-btn").on("click", function () {
        const title = $("#search-book-title").val();
        $("#sidebar-shower").click();
        $("#search-book-title").val("");
        getAllBooksHandler(title);
    });
}

function getAllBooksHandler(title = "")
{
    // Grab all Books from the API
    (title.length == 0) ? getAllBooks({action: "GET"},getAllBooksCallback) : getBookByParam({action: "GET", title}, getAllBooksCallback);
}

function getAllBooksCallback (status, data) 
{
    // Empty the book container in case it is not empty
    if ($("#books-container").children().length > 0)
    {
        removeAllChildrenFromParent("#books-container");
    }
    
    switch (status)
    {
        case "pending": 
        {
            // Append the spinner to the book container
            appendOneChildToParent("#books-container", bSpinnerHTMLString);
            break;
        }

        case "success":
        {
            let bookCardsHTML = [];

            // Form BookCards in base of those objects
            for (let book_id in data)
            {
                const currentBookObj = data[book_id];
                const bookCardHTML = bBookCard(
                    currentBookObj["id"],
                    currentBookObj["title"],
                    currentBookObj["author"],
                    currentBookObj["description"],
                    currentBookObj["image_url"]
                );

                // Append them to the array
                bookCardsHTML.push(bookCardHTML);
            }

            // Remove the spinner from the books-container
            removeAllChildrenFromParent("#books-container");

            if (bookCardsHTML.length > 0)
            {
                // Display the cards in the main page
                appendManyChildToParent("#books-container", bookCardsHTML);

                // Manage all operations to view a book
                viewBookHandler();

                // Manage all operations to edit a book
                editBookHandler();

                // Manage all operations to delete a book
                deleteBookHandler();
            }

            else
            {
                // Add an info alert that says no books were found
                appendOneChildToParent("#books-container", bInfoAlert("Info Message", "No books were found"));
            }

            break;
        }
        
        case "error":
        {
            // Remove the spinner
            removeAllChildrenFromParent("#books-container");

            // Add the error alert
            appendOneChildToParent("#books-container", bErrorAlert("Error Message", "Could not load web content"));
            break;
        }

        default:
        {

        }
    }
}

function postNewBookHandler()
{
    // Grab relevant HTML elements
    // const postBookModalId = "#post-book-modal";
    const submitBtn = $("#btn-new-book-submit");

    // Convert the pages number input into a NumInput
    const pagesNumInput = new NumInput("#new-book-pages");

    // resizeTextArea("#new-book-description");

    // Grab an event listener for when the #btn-new-book
    submitBtn.on("click", function (e) {
        
        // Grab form data
        const title = $("#new-book-title").val();
        const author = $("#new-book-author").val();
        const image_url = $("#new-book-cover").val();
        const pages = parseInt($("#new-book-pages").val());
        const read = $("#new-book-yes").is(":checked");
        const description = $("#new-book-description").val();

        // Make a JS object to send the data to the API
        const newBookData = {
            action: "POST",
            title,
            author,
            description,
            image_url,
            pages,
            read
        };

        // Send the AJAX POST request to add the book to the DB
        postNewBook(newBookData, postNewBookCallback);

        // Nullify the NumInput for garbage collection
        //const pagesNumInput = null;

        // Clear out the value of all input elements
        resetPostForm();
    });
}

function postNewBookCallback(status, data)
{
    // Grab the submit btn
    const postSubmitBtn = $("#btn-new-book-submit");
    const postCloseBtn = $("#btn-new-book-close");

    switch (status)
    {
        case "pending":
        {
            // Add a spinner to the button
            postSubmitBtn.html(bSpinnerBtnHTMLString);

            // Disable the button
            postSubmitBtn.prop("disabled", true);
            break;
        }

        case "success":
        {
            // Enable the button
            postSubmitBtn.html("Submit");

            // Enable the button
            postSubmitBtn.prop("disabled", false);

            // Close the modal
            postCloseBtn.trigger("click");

            // Get all books again
            getAllBooksHandler();
            break;
        }

        case "error":
        {
            // Enable the button
            postSubmitBtn.html("Submit");

            // Enable the button
            postSubmitBtn.prop("disabled", false);

            // Grab Error Message
            const errorMessage = data.responseJSON["error"];

            // Hide Default Content and Show Error Message
            showErrorPostModalContent();

            // Feed Values to Error Message
            feedTextToErrorPostModalContent("Error Message", errorMessage);
            break;
        }

        default:
        {
            
        }
    }
}

function viewBookHandler()
{
    // Have an event listener to extract the id of the book to view
    $("button.btn-view").on("click", function (e) {
        // Get DB Id of the book card clicked
        const bookCardNumId = getIdNumberFromBookCardButtonId(e.target.id);

        // Feed the id to the modal title
        $("#view-book-modal .modal-title").text(`Details Book ${bookCardNumId}`);

        // Prepare a JS Object whose key is the extracted id
        const bookIdData = {
            action: "GET",
            id: bookCardNumId
        };

        // Grab the info from this book
        getBookByParam(bookIdData, viewBookCallback);
    });
}

function viewBookCallback(status, data)
{
    switch (status)
    {
        case "pending":
        {
            $("#view-book-modal .modal-body").html(`<div class="text-center">${bSpinnerNormalHTMLString}</div>`);
            break;
        }

        case "success":
        {
            // Grab specific book data
            const {title, author, description, image_url, pages, read} = data;
            $("#view-book-modal .modal-body").html(bCompleteBookCard(title, author, description, image_url, pages, read));
            break;
        }

        case "error":
        {
            $("#view-book-modal .modal-body").html(bErrorAlert("Error Message", data.responseJSON["error"]));
            break;
        }
    }
}

function editBookHandler()
{
    // Grab relevant HTML elements
    const modalTitleHeader = $("#edit-modal-title");
    const bookTitleInput = $("#edit-book-title");
    const bookAuthorInput = $("#edit-book-author");
    const bookCoverInput = $("#edit-book-cover");
    const bookPagesInput = $("#edit-book-pages");
    const bookReadYesInput = $("#edit-book-yes");
    const bookReadNoInput = $("#edit-book-no");
    const bookDescriptionTextArea = $("#edit-book-description");
    const editBookSubmitBtn = $("#btn-edit-book-submit");

    // Make the pages input a NumInput
    new NumInput(bookPagesInput.attr("id"));

    let bookId = null;

    // Add event listener for when the edit button is clicked
    $(".btn-edit").on("click", function (e) {

        // Show Default Content
        showDefaultPostModalContent();

        // resizeTextArea("#edit-book-description");

        // Grab the id of the book to edit
        bookId = getIdNumberFromBookCardButtonId(e.target.id);

        // Form JS Object with id
        const bookIdData = {
            action: "GET",
            id: bookId
        };

        // Perform an AJAX GET request with the provided id
        getBookByParam(bookIdData, function (status, data) {
            switch (status)
            {
                case "pending":
                {
                    modalTitleHeader.text("Loading...");
                    break;
                }

                case "success":
                {
                    const {id, title, author, description, image_url, pages, read} = data;

                    // Feed values already given so user may change them
                    modalTitleHeader.text(`Edit Book ${id}`);
                    bookTitleInput.val(title);
                    bookAuthorInput.val(author);
                    bookCoverInput.val(image_url);
                    bookPagesInput.val(pages);
                    bookDescriptionTextArea.val(description).trigger("input");
                    (read) ? bookReadYesInput.click() : bookReadNoInput.click();
                    break;
                }

                case "error":
                {
                    showErrorPostModalContent();
                    feedTextToErrorEditModalContent("Error Message", "Can't edit book whose data can't be accessed");
                    break;
                }
            }
        });
    });

    // Add event listener for when the Edit Submit Button is clicked
    editBookSubmitBtn.on("click", function () {
        
        // Grab the actual value of all input and text area elements
        const id = bookId;
        const title = bookTitleInput.val();
        const author = bookAuthorInput.val();
        const image_url = bookCoverInput.val();
        const description = bookDescriptionTextArea.val();
        const read = bookReadYesInput.is(":checked");
        const pages = parseInt(bookPagesInput.val());

        // Form a JS Object with all the grabbed data
        const editBookData = {
            action: "PUT",
            id,
            title,
            author,
            image_url,
            description,
            read,
            pages
        };
        // Perform an AJAX HTTP Request to change the data on the DB
        editBook(editBookData, editBookCallback);
    });
}

function editBookCallback(status, data)
{

    switch (status)
    {
        case "pending":
        {
            // Disable Submit Button
            $("#btn-edit-book-submit").prop("disabled", true);

            // Add Spinner to Button
            $("#btn-edit-book-submit").html(bSpinnerBtnHTMLString);
            break;   
        }

        case "success":
        {
            // Enable Submit Button Again
            $("#btn-edit-book-submit").prop("disabled", false);

            // Reset original text for submit button
            $("#btn-edit-book-submit").html("Submit");

            // Close the modal
            $("#btn-edit-book-close").click();

            // Get all books again to see modified data
            getAllBooksHandler();
            break;
        }

        case "error":
        {
            // Enable Submit Button Again
            $("#btn-edit-book-submit").prop("disabled", false);

            // Reset original text for submit button
            $("#btn-edit-book-submit").html("Submit");

            // Grab Error Message
            const errorMessage = data.responseJSON["error"];

            // Hide Default Content and Show Error Message
            showErrorPostModalContent();

            // Feed Values to Error Message
            feedTextToErrorEditModalContent("Error Message", errorMessage);
            break;
        }
    }
}

function deleteBookHandler()
{
    // Have a place to store the id of the current book
    let bookData = null;

    // Have an event listener to extract the id of the book to delete
    $("button.btn-delete").on("click", function (e) {

        // Get DB Id of the book clicked
        const bookCardNumId = getIdNumberFromBookCardButtonId(e.target.id);

        // Prepare a JS object with the key id whose value is the number we extracted
        const bookIdData = {
            action: "GET",
            id: bookCardNumId
        };

        // Grab the title of this book for the modal to add as a message
        getBookByParam(bookIdData, function (status, data) {
            switch (status)
            {
                case "pending":
                {
                    $("#delete-book-modal .modal-body").html(`<div class="text-center">${bSpinnerNormalHTMLString}</div>`);
                    $("#delete-book-modal .modal-footer btn").prop("disabled", true);
                    break;
                }

                case "success":
                {
                    $("#delete-book-modal .modal-body").html(`<p id="confirm-deletion-message">Please confirm to delete the book "${data["title"]}"</p>`);
                    $("#delete-book-modal .modal-footer btn").prop("disabled", false);
                    break;
                }

                case "error":
                {
                    $("#delete-book-modal .modal-body").html(bErrorAlert("Error Message", data.responseJSON["error"]));
                    $("#delete-book-modal .modal-footer btn").prop("disabled", false); 
                    break;
                }
            }
        });

        bookData = bookIdData;
      
    });

    $("#btn-confirm-delete").on("click", function (e) {
        // Send an AJAX to delete the book
        deleteBook({action: "DELETE", id: bookData["id"]}, deleteBookCallback);

        // Close this modal
        $("#delete-book-modal .btn-close").click();
    });

    // 
}

function deleteBookCallback(status, data)
{
    
    switch (status)
    {
        case "pending": 
        {
            break;
        }

        case "success":
        {
            getAllBooksHandler();
            break;
        }
        
        case "error":
        {
            console.log(data);
            break;
        }
    }   
}

$(document).ready(mainIndex);