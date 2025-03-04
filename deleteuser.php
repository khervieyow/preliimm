<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('dbconnection.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $studentId = $_POST['id'];

    try {
        $sql = "DELETE FROM student_table WHERE student_id = :student_id"; // Corrected WHERE clause
        $stmt = $connection->prepare($sql);
        $stmt->bindParam(':student_id', $studentId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['res' => 'success']);
        } else {
            echo json_encode(['res' => 'error', 'msg' => 'Student not found']);
        }
    } catch (PDOException $e) {
        error_log("Delete error: " . $e->getMessage());
        echo json_encode(['res' => 'error', 'msg' => $e->getMessage()]);
    }
} else {
    error_log("Delete error: Invalid request");
    echo json_encode(['res' => 'error', 'msg' => 'Invalid request']);
}

$connection = null;
?>