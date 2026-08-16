/**
 * DEMO MODE — this file re-exports the in-memory mock API so the whole
 * frontend runs with zero backend. Every component imports from this path
 * ("../../api/communicationApi"), so switching to the real FastAPI backend
 * later is a one-line change: replace the line below with the real
 * implementation (see the full project's frontend/src/api/communicationApi.js),
 * or just set VITE_COMMUNICATION_API_URL and swap this export back to a
 * real fetch-based client.
 */
export { notificationsApi, feedbackApi, certificatesApi } from "./mockCommunicationApi";
