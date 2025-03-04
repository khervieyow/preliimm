$(document).ready(function() {
    function calculateAge(birthdate) {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function loadStudents() {
        $.ajax({
            url: "get_students.php"
        }).done(function(data) {
            try {
                let result = JSON.parse(data);
                let parent = document.querySelector("#tableBody");
                parent.innerHTML = "";

                result.forEach(item => {
                    console.log(item);
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.student_id}</td>
                        <td>${item.first_name}</td>
                        <td>${item.last_name}</td>
                        <td>${item.email}</td>
                        <td>${item.gender}</td>
                        <td>${item.course}</td>
                        <td>${item.user_address}</td>
                        <td>${calculateAge(item.birthdate)}</td>
                        <td>${item.date_created}</td>
                        <td>
                            <button class="btn btn-sm btn-primary update-btn" data-id="${item.student_id}" data-name="${item.first_name}" data-last="${item.last_name}" data-email="${item.email}" data-gender="${item.gender}" data-course="${item.course}" data-user_address="${item.user_address}" data-birthdate="${item.birthdate}">Update</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${item.student_id}">Delete</button>
                        </td>
                    `;
                    parent.appendChild(row);
                });
            } catch (error) {
                console.error("Error parsing JSON: ", error);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX call failed: ", textStatus, errorThrown);
        });
    }

    loadStudents();

    $("#createUserForm").submit(function(event) {
        event.preventDefault();
        const formData = $(this).serializeArray();
        const data = {};
        formData.forEach(item => {
            data[item.name] = item.value;
        });

        $.ajax({
            url: "createnewuser.php",
            type: "POST",
            dataType: "json",
            data: data
        }).done(function(result) {
            if (result.res === "success") {
                alert("Student added successfully");
                $("#createUserModal").modal("hide");
                loadStudents();
                $("#createUserForm")[0].reset();
            } else {
                alert("Error adding student: " + (result.msg || "Unknown error"));
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert("Request failed: " + textStatus);
            console.error("AJAX call failed: ", errorThrown);
        });
    });

    function loadStudents() {
        $.ajax({
            url: "get_students.php"
        }).done(function(data) {
            try {
                let result = JSON.parse(data);
                let parent = document.querySelector("#tableBody");
                parent.innerHTML = "";

                result.forEach(item => {
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.student_id}</td>
                        <td>${item.first_name}</td>
                        <td>${item.last_name}</td>
                        <td>${item.email}</td>
                        <td>${item.gender}</td>
                        <td>${item.course}</td>
                        <td>${item.user_address}</td>
                        <td>${calculateAge(item.birthdate)}</td>
                        <td>
                            <button class="btn btn-sm btn-primary update-btn" data-id="${item.student_id}" data-name="${item.first_name}" data-last="${item.last_name}" data-email="${item.email}" data-gender="${item.gender}" data-course="${item.course}" data-user_address="${item.user_address}" data-birthdate="${item.birthdate}">Update</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${item.student_id}">Delete</button>
                        </td>
                    `;
                    parent.appendChild(row);
                });

                // Attach update button event listeners
                document.querySelectorAll(".update-btn").forEach(button => {
                    button.addEventListener("click", function() {
                        // Fill the form in the modal with the current user data
                        document.querySelector("#update_student_id").value = this.dataset.id;
                        document.querySelector("#update_first_name").value = this.dataset.name;
                        document.querySelector("#update_last_name").value = this.dataset.last;
                        document.querySelector("#update_email").value = this.dataset.email;
                        document.querySelector("#update_gender").value = this.dataset.gender;
                        document.querySelector("#update_course").value = this.dataset.course;
                        document.querySelector("#update_user_address").value = this.dataset.user_address;
                        document.querySelector("#update_birthdate").value = this.dataset.birthdate;

                        // Show the modal
                        new bootstrap.Modal(document.querySelector("#updateUserModal")).show();
                    });
                });
            } catch (error) {
                console.error("Error parsing JSON: ", error);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX call failed: ", textStatus, errorThrown);
        });
    }

    function calculateAge(birthdate) {
        let birthDate = new Date(birthdate);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Handle form submission for the update functionality
    document.querySelector("#updateUserForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let formData = $(this).serializeArray();
        formData.push({ name: 'student_id', value: document.querySelector('#update_student_id').value });
        formData = $.param(formData);

        $.ajax({
            url: "updateuser.php",
            type: "POST",
            data: formData
        }).done(function(response) {
            // Handle success response
            if(response.res === "success") {
                alert("Student updated successfully!");
                // Refresh the student list
                loadStudents();
                // Hide the modal
                $('#updateUserModal').modal('hide');
            } else {
                alert("Failed to update student: " + response.msg);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX call failed: ", textStatus, errorThrown);
            alert("Failed to update student.");
        });
    });

    // Initialize by loading students
    loadStudents();

    $(document).on('click', '.delete-btn', function() {
        const studentId = $(this).data('id');

        if (confirm("Are you sure you want to delete this student?")) {
            $.ajax({
                url: "deleteuser.php",
                type: "POST",
                dataType: "json",
                data: {
                    id: studentId
                }
            }).done(function(result) {
                if (result.res === "success") {
                    alert("Student deleted successfully");
                    loadStudents();
                } else {
                    alert("Error deleting student: " + (result.msg || "Unknown error"));
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.error("AJAX call failed: ", errorThrown);
                console.error(jqXHR.responseText);
                alert("Request failed: " + textStatus);
            });
        }
    });
});