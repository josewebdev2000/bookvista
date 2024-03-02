/** Helper functions for the front-end to interact with the API */
function getAllBooks(data, callback)
{
    // Perfom AJAX Request to GET all books from the DB
    $.ajax({
        url: apiURL,
        type: "POST",
        data: JSON.stringify(data),
        beforeSend: function () {
            callback("pending", null);
        },
        success : function (data) {
            callback("success", data);
        },
        error: function (xhr, status, error) {
            callback("error", xhr);
        }
    });
}

function getBookByParam(data, callback)
{
    // Perform AJAX Request to GET one book by its id or by its title
    $.ajax({
        url: apiURL,
        type: "POST",
        data: JSON.stringify(data),
        beforeSend: function () {
            callback("pending", null);
        },
        success: function(data) {
            callback("success", data);
        },
        error: function (xhr, status, error) {
            callback("error", xhr);
        }
    });
}

function postNewBook(data, callback)
{
    // Perform AJAX Request to POST a new book to the DB
    $.ajax({
        url: apiURL,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function () {
            callback("pending", null);
        },
        success: function (data) {
            callback("success", data);
        },
        error: function (xhr, status, error) {
            callback("error", xhr);
        }
    });
}

function editBook(data, callback)
{
    // Perform AJAX Request to UPDATE a book FROM the API
    $.ajax({
        url: apiURL,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function () {
            callback("pending", null);
        },
        success: function (data) {
            callback("success", data);
        },
        error: function (xhr, status, error) {
            callback("error", xhr);
        }
    });
}

function deleteBook(data, callback)
{
    // Perform AJAX Request to DELETE a book from a DB
    $.ajax({
        url: apiURL,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function() {
            callback("pending", null);
        },
        success: function (data) {
            callback("success", data);
        },
        error: function (xhr, status, error) {
            callback("error", xhr);
        }
    });
}