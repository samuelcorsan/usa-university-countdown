const SwRegister = () => {
  if (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    window.workbox !== undefined
  ) {
    const wb = window.workbox;
    wb.register().catch((error: any) => {
      console.error("Service worker registration failed:", error);
    });

    window.addEventListener("unhandledrejection", (event) => {
      if (event.reason && event.reason.name === "ChunkLoadError") {
        window.location.reload();
      }
    });
  }
  return null;
};

export default SwRegister;
