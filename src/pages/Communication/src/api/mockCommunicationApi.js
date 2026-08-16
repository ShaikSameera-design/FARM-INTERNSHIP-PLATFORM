/**
 * MOCK API — for running the frontend with no backend at all.
 *
 * Same function shapes as ./communicationApi.js (notificationsApi,
 * feedbackApi, certificatesApi), backed by in-memory arrays instead of
 * HTTP calls. Data resets on page refresh — that's expected, this is only
 * for visually testing/demoing the UI before the FastAPI backend is wired
 * up.
 *
 * Swap back to the real API with one line in App.jsx:
 *   import { notificationsApi, feedbackApi, certificatesApi } from "./api/communicationApi";
 */

let nextNotificationId = 4;
let notifications = [
  {
    id: 1,
    recipient_id: "student1",
    recipient_role: "student",
    title: "Application received",
    message: "Your application for Organic Farming Internship was received.",
    type: "info",
    link: null,
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read_at: null,
  },
  {
    id: 2,
    recipient_id: "student1",
    recipient_role: "student",
    title: "Internship approved",
    message: "You've been matched with Green Valley Farms starting next month.",
    type: "success",
    link: null,
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read_at: null,
  },
  {
    id: 3,
    recipient_id: "student1",
    recipient_role: "student",
    title: "Reminder: submit weekly log",
    message: "Your weekly activity log is due tomorrow.",
    type: "warning",
    link: null,
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

let nextFeedbackId = 2;
let feedbackItems = [
  {
    id: 1,
    submitted_by_id: "student1",
    submitted_by_role: "student",
    internship_id: "intern1",
    category: "internship_experience",
    rating: 5,
    comments: "Learned a lot about organic pest control. Great mentor!",
    admin_response: null,
    responded_by_id: null,
    responded_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
  },
];

let nextCertificateId = 1;
let certificates = [];

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ---------------- Notifications ---------------- */

export const notificationsApi = {
  list: async (recipientId, { unreadOnly = false } = {}) => {
    await delay();
    return notifications
      .filter((n) => n.recipient_id === recipientId && (!unreadOnly || !n.is_read))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  unreadCount: async (recipientId) => {
    await delay(100);
    const count = notifications.filter((n) => n.recipient_id === recipientId && !n.is_read).length;
    return { recipient_id: recipientId, unread_count: count };
  },

  send: async (payload) => {
    await delay();
    const notif = { id: nextNotificationId++, is_read: false, created_at: new Date().toISOString(), read_at: null, ...payload };
    notifications.push(notif);
    return notif;
  },

  broadcast: async (payload) => {
    await delay();
    return Promise.all(payload.recipient_ids.map((rid) => notificationsApi.send({ ...payload, recipient_id: rid })));
  },

  markRead: async (id) => {
    await delay(100);
    const notif = notifications.find((n) => n.id === id);
    if (notif) {
      notif.is_read = true;
      notif.read_at = new Date().toISOString();
    }
    return notif;
  },

  markAllRead: async (recipientId) => {
    await delay();
    let updated = 0;
    notifications.forEach((n) => {
      if (n.recipient_id === recipientId && !n.is_read) {
        n.is_read = true;
        n.read_at = new Date().toISOString();
        updated++;
      }
    });
    return { detail: `${updated} notification(s) marked as read` };
  },

  remove: async (id) => {
    await delay(100);
    notifications = notifications.filter((n) => n.id !== id);
    return { detail: "Notification deleted" };
  },
};

/* ---------------- Feedback ---------------- */

export const feedbackApi = {
  list: async ({ internshipId, submittedById, category, unansweredOnly } = {}) => {
    await delay();
    return feedbackItems
      .filter((f) => !internshipId || f.internship_id === internshipId)
      .filter((f) => !submittedById || f.submitted_by_id === submittedById)
      .filter((f) => !category || f.category === category)
      .filter((f) => !unansweredOnly || !f.admin_response)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  summary: async (internshipId) => {
    await delay(150);
    const items = feedbackItems.filter((f) => !internshipId || f.internship_id === internshipId);
    const count = items.length;
    const average_rating = count ? Math.round((items.reduce((s, f) => s + f.rating, 0) / count) * 100) / 100 : 0;
    const rating_breakdown = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    items.forEach((f) => (rating_breakdown[String(f.rating)] += 1));
    return { count, average_rating, rating_breakdown };
  },

  submit: async (payload) => {
    await delay();
    const fb = {
      id: nextFeedbackId++,
      admin_response: null,
      responded_by_id: null,
      responded_at: null,
      created_at: new Date().toISOString(),
      ...payload,
    };
    feedbackItems.push(fb);
    return fb;
  },

  respond: async (id, payload) => {
    await delay();
    const fb = feedbackItems.find((f) => f.id === id);
    if (fb) {
      fb.admin_response = payload.admin_response;
      fb.responded_by_id = payload.responded_by_id;
      fb.responded_at = new Date().toISOString();
    }
    return fb;
  },

  remove: async (id) => {
    await delay(100);
    feedbackItems = feedbackItems.filter((f) => f.id !== id);
    return { detail: "Feedback deleted" };
  },
};

/* ---------------- Certificates ---------------- */

export const certificatesApi = {
  list: async ({ studentId, internshipId } = {}) => {
    await delay();
    return certificates
      .filter((c) => !studentId || c.student_id === studentId)
      .filter((c) => !internshipId || c.internship_id === internshipId)
      .sort((a, b) => new Date(b.issued_at) - new Date(a.issued_at));
  },

  issue: async (payload) => {
    await delay(400);
    const cert = {
      id: nextCertificateId++,
      certificate_uid: `mock-${Math.random().toString(36).slice(2, 10)}`,
      status: "issued",
      issued_at: new Date().toISOString(),
      ...payload,
    };
    certificates.push(cert);
    return cert;
  },

  get: async (id) => {
    await delay(100);
    return certificates.find((c) => c.id === id);
  },

  verify: async (uid) => {
    await delay();
    return certificates.find((c) => c.certificate_uid === uid);
  },

  // No real PDF in mock mode — points at a placeholder so the button doesn't dead-end.
  downloadUrl: () => "about:blank",

  revoke: async (id) => {
    await delay();
    const cert = certificates.find((c) => c.id === id);
    if (cert) cert.status = "revoked";
    return cert;
  },
};
