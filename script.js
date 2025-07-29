let students = [];
let editingIndex = -1;
window.onload = () => {
  const savedData = localStorage.getItem("studentData");
  if (savedData) {
    students = JSON.parse(savedData);
    displayStudents();
  }
};

function addStudent() {
  let name = document.getElementById("nameInput").value.trim();
  let marks = Number(document.getElementById("marksInput").value);

  if (name === "" || isNaN(marks) || marks < 0 || marks > 100) {
    alert("Please enter valid name and marks (0-100)");
    return;
  }

  let status = marks >= 35 ? "pass" : "Fail";
  let grade;
  if (marks >= 90) {
  grade = "A";
} else if (marks >= 75) {
  grade = "B";
} else if (marks >= 35) {
  grade = "C";
} else {
  grade = "F";
}

  let student = {
    name: name,
    marks: marks,
    status: status,
    grade: grade
  };
  if (editingIndex === -1) {
    students.push(student);
  } else {
    students[editingIndex] = student;
    editingIndex = -1;
    document.getElementById("addBtn").innerText = "Add Student";
  }

  localStorage.setItem("studentData", JSON.stringify(students));
  document.getElementById("nameInput").value = "";
  document.getElementById("marksInput").value = "";
  displayStudents();
 
}

function displayStudents(data = students) {
  let listDiv = document.getElementById("studentList");
  listDiv.innerHTML = "";

  let table = document.createElement("table");
  let headerRow = document.createElement("tr");
  ["Name", "Marks", "Grade", "Status", "Action"].forEach(text => {
    let th = document.createElement("th");
    th.innerText = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  let maxMarks = 0;
  students.forEach(student => {
    if (student.marks > maxMarks) {
      maxMarks = student.marks;
    }
  });

  data.forEach((student, index) => {
    let row = document.createElement("tr");
    if (student.marks === maxMarks) {
      row.classList.add("top-scorer");
    }

    let nameCell = document.createElement("td");
    nameCell.innerText = student.name;

    let marksCell = document.createElement("td");
    marksCell.innerText = student.marks;

    let statusCell = document.createElement("td");
    statusCell.innerText = student.status;
    let gradeCell = document.createElement("td");
    gradeCell.innerText = student.grade;
    let actionCell = document.createElement("td");
    let deleteBtn = document.createElement("button");
    let editBtn = document.createElement("button");
editBtn.innerText = "Edit ✏️";
editBtn.style.marginLeft = "10px";
editBtn.style.background = "#3498db";
editBtn.style.color = "white";
editBtn.style.border = "none";
editBtn.style.borderRadius = "5px";
editBtn.style.padding = "5px 10px";
editBtn.style.cursor = "pointer";

editBtn.onclick = () => {
  document.getElementById("nameInput").value = student.name;
  document.getElementById("marksInput").value = student.marks;
  editingIndex = index; // set global index
  document.getElementById("addBtn").innerText = "Update Student";
};

    deleteBtn.innerText = "Delete";
    deleteBtn.style.color = "white";
    deleteBtn.style.background = "#e74c3c";
    deleteBtn.style.border = "none";
    deleteBtn.style.borderRadius = "5px";
    deleteBtn.style.padding = "5px 10px";
    deleteBtn.style.cursor = "pointer";

    deleteBtn.onclick = () => {
      students.splice(index, 1);
      localStorage.setItem("studentData", JSON.stringify(students)); // ✅ Save after deleting
      displayStudents();
    };

    actionCell.appendChild(deleteBtn);
    actionCell.appendChild(editBtn);

    row.appendChild(nameCell);
    row.appendChild(marksCell);
    row.appendChild(gradeCell);
    row.appendChild(statusCell);
    row.appendChild(actionCell);
    table.appendChild(row);
  });

  listDiv.appendChild(table);
  // Calculate summary
let total = students.length;
let totalMarks = students.reduce((sum, s) => sum + s.marks, 0);
let avg = total > 0 ? (totalMarks / total).toFixed(2) : 0;
let topper = students.reduce((max, s) => (s.marks > max.marks ? s : max), students[0] || { name: "None", marks: 0 });
let passed = students.filter(s => s.status === "pass").length;
let passPercent = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

// Display summary
let summaryDiv = document.getElementById("summaryBox");
summaryDiv.innerHTML = `
  <div class="summary">
    <p><strong>Total Students:</strong> ${total}</p>
    <p><strong>Average Marks:</strong> ${avg}</p>
    <p><strong>Top Scorer:</strong> ${topper?.name || "None"}</p>
    <p><strong>Pass Percentage:</strong> ${passPercent}%</p>
  </div>
`;

}
function searchStudent() {
  let query = document.getElementById("searchInput").value.toLowerCase();

  let filtered = students.filter(student => 
    student.name.toLowerCase().includes(query)
  );

  displayStudents(filtered);
}


function filterStudents(category) {
  let filtered = [];

  if (category === "toppers") {
    filtered = students.filter(s => s.marks >= 75);
  } else if (category === "average") {
    filtered = students.filter(s => s.marks >= 35 && s.marks < 75);
  } else if (category === "dullers") {
    filtered = students.filter(s => s.marks < 35);
  } else {
    filtered = students;
  }

  displayStudents(filtered);
}

let sortDescending = true;
function sortByMarks() {
  students.sort((a, b) => sortDescending ? b.marks - a.marks : a.marks - b.marks);
  document.querySelector("button[onclick='sortByMarks()']").innerText =
    sortDescending ? "Sort by Marks ⬆️" : "Sort by Marks ⬇️";
  sortDescending = !sortDescending;
  displayStudents();
}
function exportToPDF() {
  if (students.length === 0) {
    alert("No data to export!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Student Report", 14, 15);

  const tableData = students.map(s => [s.name, s.marks,s.grade, s.status]);

  doc.autoTable({
    head: [["Name", "Marks", "Grade", "Status"]],
    body: tableData,
    startY: 25,
    styles: {
      halign: 'center',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [22, 160, 133],
    },
  });

  doc.save("Student_Report.pdf");
}


  

