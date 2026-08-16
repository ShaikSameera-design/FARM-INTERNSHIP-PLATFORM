import { useState } from "react";
import "./StudentProgress.css";

function StudentProgress() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const students = [
    {
      id: 1,
      name: "Anjali Reddy",
      rollNo: "CSE001",
      internship: "Organic Farming",
      organization: "Green Valley Farms",
      duration: "3 Months",
      progress: 85,
    },
    {
      id: 2,
      name: "Ravi Teja",
      rollNo: "CSE002",
      internship: "Dairy Farming",
      organization: "Happy Cows Dairy",
      duration: "2 Months",
      progress: 65,
    },
    {
      id: 3,
      name: "Meghana S",
      rollNo: "CSE003",
      internship: "Horticulture",
      organization: "Sunrise Farms",
      duration: "3 Months",
      progress: 45,
    },
    {
      id: 4,
      name: "Priya Kumar",
      rollNo: "CSE004",
      internship: "Crop Management",
      organization: "Green Agriculture",
      duration: "2 Months",
      progress: 90,
    },
    {
      id: 5,
      name: "Rahul Varma",
      rollNo: "CSE005",
      internship: "Poultry Farming",
      organization: "Healthy Poultry Farms",
      duration: "2 Months",
      progress: 30,
    },
  ];

  const filteredStudents = students.filter((student) => {
    const searchMatch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(search.toLowerCase());

    const filterMatch =
      filter === "All" || student.internship === filter;

    return searchMatch && filterMatch;
  });

  return (
    <div className="student-progress-page">

      {/* Page Header */}
      <div className="progress-header">
        <div>
          <h1>Student Progress</h1>
          <p>
            Track the internship progress of students from your college.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="progress-filters">

        <input
          type="text"
          placeholder="Search by student name or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Internships</option>
          <option value="Organic Farming">Organic Farming</option>
          <option value="Dairy Farming">Dairy Farming</option>
          <option value="Horticulture">Horticulture</option>
          <option value="Crop Management">Crop Management</option>
          <option value="Poultry Farming">Poultry Farming</option>
        </select>

      </div>

      {/* Student Table */}
      <div className="progress-table-container">

        <table className="progress-table">

          <thead>
            <tr>
              <th>Student</th>
              <th>Roll Number</th>
              <th>Internship</th>
              <th>Organization</th>
              <th>Duration</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody>

            {filteredStudents.length > 0 ? (

              filteredStudents.map((student) => (

                <tr key={student.id}>

                  {/* Student */}
                  <td>
                    <div className="student-info">

                      <div className="student-avatar">
                        {student.name.charAt(0)}
                      </div>

                      <span>{student.name}</span>

                    </div>
                  </td>

                  {/* Roll Number */}
                  <td>{student.rollNo}</td>

                  {/* Internship */}
                  <td>{student.internship}</td>

                  {/* Organization */}
                  <td>{student.organization}</td>

                  {/* Duration */}
                  <td>{student.duration}</td>

                  {/* Progress */}
                  <td>

                    <div className="progress-wrapper">

                      <div className="progress-bar">

                        <div
                          className="progress-fill"
                          style={{
                            width: `${student.progress}%`,
                          }}
                        ></div>

                      </div>

                      <span className="progress-value">
                        {student.progress}%
                      </span>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="6" className="no-students">
                  No students found.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default StudentProgress;