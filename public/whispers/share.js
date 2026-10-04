document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("share-journal");
  const status = document.getElementById("share-status");
  if (!button || !status) return;
  const url = "https://tschech.co/whispers/";
  button.addEventListener("click", async () => {
    status.textContent = "";
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Whisper Radar", text: "Loud is not the same as true. A public research journal on stock rumors, hype, and evidence.", url });
      } else if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(url);
        status.textContent = "Link copied. Share it wherever you like.";
      } else {
        status.textContent = "Share this link: " + url;
      }
    } catch (error) {
      if (error && error.name === "AbortError") return;
      status.textContent = "Share this link: " + url;
    }
  });
});
