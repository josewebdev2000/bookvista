<?php 
/** Handle POST Request to Create a new Record in the DB */
require_once "config.php";
require_once "helpers.php";

function mainPost()
{
    // Grab JSON from the user
    $book_data = get_json_request();

    // Check data received is right
    $check_assoc = check_book_to_insert($book_data);

    // If the error key exists in the check_assoc, return an error JSON response
    if (array_key_exists("error", $check_assoc))
    {
        send_json_error_response($check_assoc, 400);
        return;
    }

    // By this point insert the data to the DB
    $book_inserted = insert_book($book_data);

    // Return error response if there was a DB error
    if (array_key_exists("error", $book_inserted))
    {
        send_json_error_response($book_inserted, 400);
        return;
    }

    // Return data about the book that was inserted
    send_json_response($book_inserted);
}

mainPost();
?>