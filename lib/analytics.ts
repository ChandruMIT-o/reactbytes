import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Helper to get or create a session ID for tracking unique daily visitors
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem("rb_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("rb_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Logs a copy interaction event to Firestore (fire-and-forget).
 * Does not block the clipboard action.
 */
export function logInteractionEvent(componentId: string, interactionType: "copy_code" | "copy_install") {
  if (typeof window === "undefined" || !db) return;
  
  try {
    const rawEventsCol = collection(db, "raw_events");
    addDoc(rawEventsCol, {
      component_id: componentId,
      interaction_type: interactionType,
      timestamp: serverTimestamp(),
    }).catch((err) => {
      // Fail silently in production, log in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error logging interaction event:", err);
      }
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error logging interaction event:", err);
    }
  }
}

/**
 * Logs a page view event to Firestore (fire-and-forget) to track traffic.
 */
export function logPageView(page: string) {
  if (typeof window === "undefined" || !db) return;

  try {
    const session_id = getSessionId();
    if (!session_id) return;

    const pageViewsCol = collection(db, "page_views");
    addDoc(pageViewsCol, {
      session_id,
      page,
      timestamp: serverTimestamp(),
    }).catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Error logging page view:", err);
      }
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error logging page view:", err);
    }
  }
}
