<?php
/** Handle DELETE Request to Delete records from the DB */
require_once "config.php";
require_once "helpers.php";

function mainDelete()
{
    // Read id from the JSON received
    $json_data = get_json_request();
    $id = isset($json_data["id"]) ? $json_data["id"] : "";

    // First check the id received is a whole number
    $valid_id = is_valid_id_param($id);

    // Return an early error if the id is invalid
    if (!$valid_id)
    {
        send_json_error_response(["error" => "The given id: \"$id\" is invalid"], 400);
        return; 
    }

    // Delete the book
    $assoc_res = delete_book_by_id($id);

    // Return error response if appropiate
    if (array_key_exists("error", $assoc_res))
    {
        send_json_error_response($assoc_res, 400);
        return;
    }

    // Return a successful JSON response
    send_json_response($assoc_res);
}

mainDelete();
?>