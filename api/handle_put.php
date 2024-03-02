<?php
/** Handle PATCH Request to Alter values of a record in the DB */
require_once "config.php";
require_once "helpers.php";

function mainPut()
{
    // Grab JSON from the user
    $book_data = get_json_request();

    // Check data received is right
    // Use the insert check since it's all we need for now
    $check_assoc = check_book_to_put_update($book_data);

    // If the error key exists in the check_assoc, return an error JSON response
    if (array_key_exists("error", $check_assoc))
    {
        send_json_error_response($check_assoc, 400);
        return;
    }

    // Update the book
    $book_updated = update_book_by_put_id($book_data);

    // Return error response if there was a DB error
    if (array_key_exists("error", $book_updated))
    {
        send_json_error_response($book_updated, 400);
        return;
    }

    // Return data about the book that was inserted
    send_json_response($book_updated);

}

mainPut();
?>