<?php
include('dbconnection.php');

try {
    $stmt = $connection->query("SELECT * FROM student_table");
    $student_table = $stmt->fetchAll(PDO::FETCH_ASSOC);

    error_log(print_r($student_table, TRUE)); // Log the data before encoding

    echo json_encode($student_table);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
    error_log("Database error: " . $e->getMessage());
}

$connection = null;
?>