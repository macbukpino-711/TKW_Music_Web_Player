const authButton = document.getElementById("authButton");

if (authButton) {
  const currentUrl = new URL(window.location.href);
  const isLoggedIn = currentUrl.searchParams.get("loggedIn") === "1";
  const displayName = (currentUrl.searchParams.get("name") || "").trim();

  if (isLoggedIn && displayName) {
    authButton.textContent = displayName.charAt(0).toUpperCase();
    authButton.classList.add("is-account");
    authButton.setAttribute("aria-label", displayName);
    authButton.setAttribute("title", displayName);
    authButton.setAttribute("href", "javascript:void(0)");

    currentUrl.searchParams.delete("loggedIn");
    currentUrl.searchParams.delete("name");

    window.history.replaceState({}, document.title, currentUrl.pathname + currentUrl.search + currentUrl.hash);
  }
}
