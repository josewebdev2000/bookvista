<?php
/** Handle GET Request to Grab information from the DB */
require_once "config.php";
require_once "helpers.php";

function mainGet()
{
    // Try to grab GET parameters to determine what to do
    // If there are no GET parameters, grab all books

    // GET the JSON Request
    $req_assoc = get_json_request();

    if (isset($req_assoc["id"]))
    {
        $books = get_book_by_id($req_assoc["id"]);
    }

    else if (isset($req_assoc["title"]))
    {
        $books = get_books_like_title($req_assoc["title"]);
    }

    else
    {
        $books = get_all_books();
    }

    // Send an error response if there is an error
    if (array_key_exists("error", $books))
    {
        // Otherwise send the books
        send_json_error_response($books, 400);
        return;
    }

    send_json_response($books);
    return;
}

mainGet();
?>