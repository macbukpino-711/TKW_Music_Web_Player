const tabButtons = document.querySelectorAll(".tab-button");
const forms = document.querySelectorAll(".auth-form");
const switchButtons = document.querySelectorAll(".inline-switch");
const statusMessage = document.getElementById("statusMessage");
const signupWarning = document.getElementById("signupWarning");
let redirectTimer;

const formConfig = {
  loginPanel: {
    button: document.getElementById("loginButton"),
    inputs: [
      document.getElementById("loginEmail"),
      document.getElementById("loginPassword")
    ],
    message: "Dang nhap thanh cong."
  },
  signupPanel: {
    button: document.getElementById("signupButton"),
    inputs: [
      document.getElementById("signupEmail"),
      document.getElementById("signupPassword"),
      document.getElementById("signupConfirmPassword")
    ],
    message: "Dang ky thanh cong."
  }
};

// Login is demo-only, so we clear any previously stored auth data.
localStorage.removeItem("rondoAccount");

function buildAccountProfile(email) {
  const trimmedEmail = email.trim();
  const displayName = trimmedEmail.split("@")[0] || "Rondo";

  return {
    email: trimmedEmail,
    displayName
  };
}

function setActivePanel(targetId) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.target === targetId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  forms.forEach((form) => {
    const isActive = form.id === targetId;
    form.classList.toggle("is-active", isActive);
    form.hidden = !isActive;
  });

  statusMessage.textContent = "";

  if (targetId !== "signupPanel") {
    signupWarning.textContent = "";
  }
}

function updateButtonState(panelId) {
  const { button, inputs } = formConfig[panelId];
  const hasValue = inputs.every((input) => input.value.trim() !== "");

  if (panelId === "signupPanel") {
    const password = document.getElementById("signupPassword").value.trim();
    const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();
    const isMatch = password !== "" && confirmPassword !== "" && password === confirmPassword;

    if (confirmPassword !== "" && password !== confirmPassword) {
      signupWarning.textContent = "Mat khau nhap lai chua khop.";
    } else {
      signupWarning.textContent = "";
    }

    button.disabled = !(hasValue && isMatch);
    return;
  }

  button.disabled = !hasValue;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActivePanel(button.dataset.target);
  });
});

switchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActivePanel(button.dataset.switch);
  });
});

Object.entries(formConfig).forEach(([panelId, config]) => {
  config.inputs.forEach((input) => {
    input.addEventListener("input", () => updateButtonState(panelId));
  });

  document.getElementById(panelId).addEventListener("submit", (event) => {
    event.preventDefault();
    updateButtonState(panelId);

    clearTimeout(redirectTimer);

    if (config.button.disabled) {
      if (panelId === "signupPanel" && signupWarning.textContent) {
        statusMessage.textContent = "Vui long nhap dung va day du thong tin dang ky.";
        return;
      }

      statusMessage.textContent = "Vui long nhap day du email va mat khau.";
      return;
    }

   

    statusMessage.textContent = config.message;
    redirectTimer = setTimeout(() => {
      const emailInput = panelId === "loginPanel"
        ? document.getElementById("loginEmail").value.trim()
        : document.getElementById("signupEmail").value.trim();
      const profile = buildAccountProfile(emailInput);
      const redirectUrl = new URL("../index.html", window.location.href);

      redirectUrl.searchParams.set("loggedIn", "1");
      redirectUrl.searchParams.set("name", profile.displayName);

      window.location.href = redirectUrl.toString();
    }, 900);
  });
});

setActivePanel("loginPanel");
updateButtonState("loginPanel");
updateButtonState("signupPanel");
