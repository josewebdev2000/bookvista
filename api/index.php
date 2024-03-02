<?php 
require_once "helpers.php";

function main()
{
    // Check the HTTP Method is a POST Request
    $is_post= is_post_request();

    // Send method not allowed in case it is not
    if (!$is_post)
    {
        return send_json_error_response(["error" => "Method Not Allowed"], 405);
    }

    // Define allowed actions
    $actions = ["GET", "POST", "PUT", "DELETE"];

    // Check the JSON object has a valid action
    $req_assoc = get_json_request();

    // Return error when client action is not in the list of actions
    if (!isset($req_assoc["action"]) || !in_array($req_assoc["action"], $actions))
    {
        return send_json_error_response(["error" => "Invalid value for \"action\" field: " . $req_assoc["action"] . ""], 400);
    }

    // Otherwise switch according to the action to be made
    switch (strtoupper($req_assoc["action"]))
    {
        case "GET":
            require "handle_get.php";
            break;
        
        case "POST":
            require "handle_post.php";
            break;
        
        case "PUT":
            require "handle_put.php";
            break;
        
        default:
            require "handle_delete.php";
    }
}

main();
?>