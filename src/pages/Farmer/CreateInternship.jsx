import React, { useState } from "react";
import "./Farmer.css";

function CreateInternship() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    duration: "",
    startDate: "",
    deadline: "",
    openings: "",
    stipend: "",
    skills: "",
    description: "",
    responsibilities: "",
    accommodation: "No",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Internship Details:", formData);

    alert("Internship posted successfully!");

    setFormData({
      title: "",
      category: "",
      location: "",
      duration: "",
      startDate: "",
      deadline: "",
      openings: "",
      stipend: "",
      skills: "",
      description: "",
      responsibilities: "",
      accommodation: "No",
    });
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      category: "",
      location: "",
      duration: "",
      startDate: "",
      deadline: "",
      openings: "",
      stipend: "",
      skills: "",
      description: "",
      responsibilities: "",
      accommodation: "No",
    });
  };

  return (
    <div className="farmer-page">

      <div className="page-header">
        <p className="page-label">INTERNSHIP MANAGEMENT</p>

        <h1>Create New Internship</h1>

        <p>
          Post a new internship opportunity for students and agricultural
          learners.
        </p>
      </div>

      <div className="create-internship-card">

        <form onSubmit={handleSubmit}>

          <div className="internship-section">

            <h3>Basic Information</h3>

            <div className="profile-form-grid">

              <div className="form-group full-width">
                <label>Internship Title</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Organic Farming Internship"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Organic Farming">Organic Farming</option>
                  <option value="Crop Management">Crop Management</option>
                  <option value="Dairy Farming">Dairy Farming</option>
                  <option value="Horticulture">Horticulture</option>
                  <option value="Agricultural Technology">
                    Agricultural Technology
                  </option>
                  <option value="Farm Management">Farm Management</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Example: Guntur, Andhra Pradesh"
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration</label>

                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select duration</option>
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="4 Months">4 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>

              <div className="form-group">
                <label>Number of Openings</label>

                <input
                  type="number"
                  name="openings"
                  value={formData.openings}
                  onChange={handleChange}
                  placeholder="Example: 5"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Application Deadline</label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stipend</label>

                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  placeholder="Example: ₹5,000 / month"
                />
              </div>

            </div>

          </div>


          <div className="internship-section">

            <h3>Internship Details</h3>

            <div className="form-group">
              <label>Skills Required</label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Example: Agriculture, Crop Management, Communication"
                required
              />
            </div>

            <div className="form-group internship-textarea">

              <label>Internship Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the internship opportunity..."
                rows="5"
                required
              />

            </div>

            <div className="form-group internship-textarea">

              <label>Responsibilities</label>

              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="Describe the responsibilities of the intern..."
                rows="5"
                required
              />

            </div>

            <div className="form-group">

              <label>Accommodation Provided?</label>

              <select
                name="accommodation"
                value={formData.accommodation}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

            </div>

          </div>


          <div className="profile-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              Post Internship
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateInternship;