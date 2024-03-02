<?php 
$servername = "<DB_SERVER_LOCATION>";
$username = "<DB_USERNAME>";
$password = "<DB_PASSWORD>";
$db = "<DB_NAME>";

$conn = mysqli_connect($servername, $username, $password, $db);

if (mysqli_connect_errno())
{
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
}

?>