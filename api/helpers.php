<?php 
require_once "config.php"; 

function is_post_request()
{
    return $_SERVER["REQUEST_METHOD"] == "POST";
}

function get_json_request()
{
    // Grab a JSON request from the front-end
    // Grab JSON data from the front-end as a file
    $jsonData = file_get_contents("php://input");

    // Decode the JSON data
    $decodedData = json_decode($jsonData, true);

    return $decodedData;
}

function is_valid_id_param($id_param)
{
    // Return true if the given id parameter is valid
    return isset($id_param) && is_numeric($id_param);
}

function send_json_response($json_response)
{
    // Set the header to send a JSON response
    header("Content-Type: application/json");

    // Send it with echo
    echo json_encode($json_response);
}

function send_json_error_response($json_error_response, $error_http_code)
{
    // Send a JSON error to tell the client what went wrong
    http_response_code($error_http_code);

    // Set the header to send a JSON response
    header("Content-Type: application/json");

    echo json_encode($json_error_response);
}

function check_book_to_insert($book_data)
{
    // Check the JSON data got is correct

    // List of attributes a book MUST HAVE
    $must_have_keys = ["title", "read"];

    // Check the MUST HAVE Keys
    foreach ($must_have_keys as $key)
    {
        // If the keys do not exist, return an error
        if (!array_key_exists($key, $book_data))
        {
            return [
                "error" => "Missing key: $key"
            ];
        }
    }

    // If the title value does not contain a string, return an error
    if (!is_string($book_data["title"]))
    {
        return ["error" => "\"title\" value must be a string"];
    }

    // If the title value is empty, return an error
    if (empty($book_data["title"]))
    {
        return ["error" => "\"title\" value is empty"];
    }

    // If the read attribute does not contain a boolean, return an error
    if ($book_data["read"] != 0 && $book_data["read"] != 1)
    {
        return ["error" => "\"read\" value must be either 1 (True) or 0 (False)"];
    }

    // List all attributes the book COULD HAVE
    $could_have_keys = ["author", "description", "image_url","pages"];

    // Check if they are set
    foreach ($could_have_keys as $key)
    {
        // In case they exist
        if (array_key_exists($key, $book_data))
        {
            // Check the "author" and "description" keys are strings
            if ($key == "author" || $key == "description" || $key == "image_url")
            {
                if (!is_string($book_data[$key]))
                {
                    return [
                        "error" => "\"$key\" must be formed by words"
                    ];
                }
            }

            if ($key == "pages")
            {
                if (!is_int($book_data[$key]))
                {
                    return ["error" => "\"$key\" must be a whole number"];
                }
            }
        }
    }

    // By this point all checks have been approved. So return an ASSOC with success key
    return ["success" => "Checks passed successfully"];

}

function insert_book($book_info)
{
    global $conn;

    // Create a copy ASSOC from the assoc received
    $copy_book_info = json_decode(json_encode($book_info), true);

    // List of all keys that could exist in the book
    $book_attrs = ["title", "author", "description", "image_url", "pages", "read"];

    // In case a key does not exist, just add an empty string to it
    foreach ($book_attrs as $attr)
    {
        if (!array_key_exists($attr, $copy_book_info))
        {
            $copy_book_info[$attr] = "";
        }

        // Escape all strings to avoid SQLi as well
        $copy_book_info[$attr] = stripslashes(mysqli_real_escape_string($conn, $copy_book_info[$attr]));
    }

    // Now insert the book to the DB
    $sql = "INSERT INTO book (title, author, description, image_url, pages, `read`) VALUES (?,?,?,?,?,?)";

    // Prepare a SQL Statement
    $stmt = mysqli_prepare($conn, $sql);

    // Bind parameters to the statement
    mysqli_stmt_bind_param(
        $stmt, 
        "ssssii", 
        $copy_book_info["title"],
        $copy_book_info["author"],
        $copy_book_info["description"],
        $copy_book_info["image_url"],
        $copy_book_info["pages"],
        $copy_book_info["read"]
    );

    // Execute the statement
    mysqli_stmt_execute($stmt);

    // Check for errors
    if (mysqli_stmt_errno($stmt) != 0) 
    {
        return ["error" => "DB Error"];
    }

    // In case the insert was successful, return a success response with the copied data
    return $copy_book_info;
}

function get_all_books()
{
    global $conn;

    // Return an ASSOC with all books stored in the DB
    $sql = "SELECT * FROM book ORDER BY id DESC";

    $result_set = mysqli_query($conn, $sql);

    if ($result_set)
    {
        // Store array of all books here
        $books = [];

        // Grab all records from the book DB
        while ($book = mysqli_fetch_assoc($result_set))
        {
            // Add them to the array
            $books[$book["id"]] = [
                "id" => $book["id"],
                "title" => $book["title"],
                "author" => $book["author"],
                "description" => $book["description"],
                "image_url" => $book["image_url"],
                "pages" => $book["pages"],
                "read" => $book["read"]
            ];
        }

        // Return the array
        return $books;
    }

    else
    {
        // Return an error assoc
        return ["error" => "Could not grab books from the DB"];
    }

}

function get_book_by_id($id)
{
    // Retun an ASSOC with a book from the DB by its id
    global $conn;

    // First check the id received is a whole number
    $valid_id = is_valid_id_param($id);

    // Return an early error if the id is invalid
    if (!$valid_id)
    {
        return ["error" => "The given id: \"$id\" is invalid"];
    }

    // Escape the id parameter anyway
    $query_id = mysqli_real_escape_string($conn, $id);

    // Build the SQL query
    $sql = "SELECT * FROM book WHERE id = ?";

    // Build the stmt
    $stmt = mysqli_prepare($conn, $sql);

    // Bind the id parameter
    mysqli_stmt_bind_param(
        $stmt,
        "i",
        $query_id
    );

    // Execute the query
    mysqli_stmt_execute($stmt);

    // Grab the result set from executing the query
    $result_set = mysqli_stmt_get_result($stmt);

    if ($result_set)
    {
        // Grab the book
        $book = mysqli_fetch_assoc($result_set);

        // If there is no book then just return null
        if (!$book)
        {
            return ["error" => "No book of id $id"];
        }

        // Return the book in case it exists
        return [
            "id" => $book["id"],
            "title" => $book["title"],
            "author" => $book["author"],
            "description" => $book["description"],
            "image_url" => $book["image_url"],
            "pages" => $book["pages"],
            "read" => $book["read"] 
        ];
    }

    else
    {
        return ["error" => "Could not grab book from the DB"];
    }
}

function get_books_like_title($title)
{
    // Return an ASSOC of all books whose title is similar to the given title
        // Retun an ASSOC with a book from the DB by its id
        global $conn;
    
        // Escape the title parameter to prevent SQLi
        $query_title = mysqli_real_escape_string($conn, $title);
    
        // Build the SQL query
        $sql = "SELECT * FROM book WHERE title LIKE CONCAT('%',?,'%') ORDER BY id DESC";
    
        // Build the stmt
        $stmt = mysqli_prepare($conn, $sql);
    
        // Bind the id parameter
        mysqli_stmt_bind_param(
            $stmt,
            "s",
            $query_title
        );
    
        // Execute the query
        mysqli_stmt_execute($stmt);
    
        // Grab the result set from executing the query
        $result_set = mysqli_stmt_get_result($stmt);

        if ($result_set)
        {
            // Grab the books
            $books = [];

            // Grab all records 
            while ($book = mysqli_fetch_assoc($result_set))
            {
                // Add them to the array
                $books[$book["id"]] = [
                    "id" => $book["id"],
                    "title" => $book["title"],
                    "author" => $book["author"],
                    "description" => $book["description"],
                    "image_url" => $book["image_url"],
                    "pages" => $book["pages"],
                    "read" => $book["read"]
                ];
            }

            return $books;
        }

        else
        {
            return ["error" => "Could not grab books from the DB"];
        }
}

function delete_book_by_id($id)
{
    // Delete a book from the DB
    global $conn;

    // Escape the id anyway to prevent SQLi
    $query_id = mysqli_real_escape_string($conn, $id);

    // Build the SQL query to delete the book
    $sql = "DELETE FROM book WHERE id = ?";

    // Prepare the statement
    $stmt = mysqli_prepare($conn, $sql);

    // Bind the id
    mysqli_stmt_bind_param(
        $stmt,
        "i",
        $query_id
    );

    // Execute the query
    mysqli_stmt_execute($stmt);

    // Check for errors
    if (mysqli_stmt_errno($stmt) != 0) 
    {
        return ["error" => "Could not delete book of id $id"];
    }

    // Return book was successfully deleted
    return ["message" => "Book of id $id was successfully deleted"];

}

function check_book_to_put_update($book_data)
{
    // Check the book data is right for put update
    // Make sure the given id is valid
    $valid_id = is_valid_id_param($book_data["id"]);

    // Return error if id is invalid
    if (!$valid_id)
    {
        return ["error" => "No valid id key"];
    }

    // Run checks to insert book
    $insert_check_assoc = check_book_to_insert($book_data);

    // Return result of insert check
    return $insert_check_assoc;
}

function update_book_by_put_id($book_data)
{
    global $conn;

    // First, find out if the book exists in the DB
    $book_found = get_book_by_id($book_data["id"]);

    // If there is an error response, then create a new book
    if (array_key_exists("error", $book_found))
    {
        return ["error" => 'Book of id ' . $book_data["id"] . " is not found"];
    }

    // Otherwise, modify the received book
    else
    {
        // Create a new assoc that conserves keys not modifies and changes modified keys
        $id = $book_found["id"];
        $title = either_this_key_or_that("title", $book_data, $book_found);
        $author = either_this_key_or_that("author", $book_data, $book_found);
        $description = either_this_key_or_that("description", $book_data, $book_found);
        $pages = either_this_key_or_that("pages", $book_data, $book_found);
        $read = either_this_key_or_that("read", $book_data, $book_found);
        $image_url = either_this_key_or_that("image_url", $book_data, $book_found);

        // Prepare a SQL Statement to update the book
        $sql = "UPDATE book SET title = ?, author = ?, description = ?, pages = ?, `read` = ?, image_url = ? WHERE id = ?";
        $stmt = mysqli_prepare($conn, $sql);

        // Bind parameters to the query
        mysqli_stmt_bind_param($stmt, "sssiisi", $title, $author, $description, $pages, $read, $image_url, $id);

        // Execute the query
        mysqli_stmt_execute($stmt);

        // Return an object representation of the updated data
        return [
            "id" => $id,
            "title" => $title,
            "author" => $author,
            "description" => $description,
            "image_url" => $image_url,
            "pages" => $pages,
            "read" => $read
        ];
    }

    // Return the book data
    return $book;
}

function either_this_key_or_that($key, $assoc_1, $assoc_2)
{
    /** Grab two assocs that have a common key, if they are equal use one object, otherwise use the other object */
    return ($assoc_1[$key] != $assoc_2[$key]) ? $assoc_1[$key] : $assoc_2[$key];
}

?>