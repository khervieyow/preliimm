<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('dbconnection.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['student_id'])) {
    $studentId = $_POST['student_id'];
    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $email = $_POST['email'];
    $gender = $_POST['gender'];
    $course = $_POST['course'];
    $userAddress = $_POST['user_address'];
    $birthdate = $_POST['birthdate'];

    try {
        $sql = "UPDATE student_table SET first_name = :first_name, last_name = :last_name, email = :email, gender = :gender, course = :course, user_address = :user_address, birthdate = :birthdate, date_created = NOW() WHERE student_id = :student_id";

        $stmt = $connection->prepare($sql);

        $stmt->bindParam(':student_id', $studentId, PDO::PARAM_INT);
        $stmt->bindParam(':first_name', $firstName, PDO::PARAM_STR);
        $stmt->bindParam(':last_name', $lastName, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':gender', $gender, PDO::PARAM_STR);
        $stmt->bindParam(':course', $course, PDO::PARAM_STR);
        $stmt->bindParam(':user_address', $userAddress, PDO::PARAM_STR);
        $stmt->bindParam(':birthdate', $birthdate, PDO::PARAM_STR);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['res' => 'success']);
        } else {
            echo json_encode(['res' => 'error', 'msg' => 'No rows updated. Check student_id.']);
        }

    } catch (PDOException $e) {
        error_log("Update error: " . $e->getMessage());
        echo json_encode(['res' => 'error', 'msg' => $e->getMessage()]);
    }
} else {
    error_log("Update error: Invalid request");
    echo json_encode(['res' => 'error', 'msg' => 'Invalid request']);
}

$connection = null;
?>