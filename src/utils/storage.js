import { initialApplications } from "../data/studentData";

const APPLICATIONS_KEY = "farm_student_applications";

export function getApplications() {
  try {
    const stored = localStorage.getItem(APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : initialApplications;
  } catch {
    return initialApplications;
  }
}

export function saveApplications(applications) {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

export function addApplication(application) {
  const applications = getApplications();
  const next = [...applications, application];
  saveApplications(next);
  return next;
}
