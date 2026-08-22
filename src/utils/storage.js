const STORAGE_KEY = "farm_internship_student_applications";

const defaultApplications = [
  {
    id: "app_1",
    internshipId: "1",
    title: "Organic Crop Cultivation & Hydroponics",
    organization: "Green Valley Farms",
    appliedDate: "2026-08-01",
    status: "Approved",
    coverLetter: "Interested in practical hydroponics and sustainable farm management.",
  },
  {
    id: "app_2",
    internshipId: "3",
    title: "Precision Horticulture & Greenhouse Management",
    organization: "Sunrise Agri-Tech Solutions",
    appliedDate: "2026-08-10",
    status: "Pending",
    coverLetter: "Looking forward to gaining climate-controlled greenhouse experience.",
  },
];

export function getApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultApplications));
      return defaultApplications;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse applications from localStorage", err);
    return defaultApplications;
  }
}

export function addApplication(application) {
  try {
    const apps = getApplications();
    const newApp = {
      id: `app_${Date.now()}`,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      ...application,
    };
    const updated = [newApp, ...apps];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newApp;
  } catch (err) {
    console.error("Failed to save application to localStorage", err);
    return null;
  }
}

export function updateApplicationStatus(id, newStatus) {
  try {
    const apps = getApplications();
    const updated = apps.map((app) => (app.id === id ? { ...app, status: newStatus } : app));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to update application status", err);
    return [];
  }
}
