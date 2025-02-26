import { handleArrowNavigation, filterProjects, obscureEmail } from "./helper.js";

document.addEventListener("DOMContentLoaded", function () {
  // Obscure email link
  const emailLink = document.getElementById("email-link");
  if (emailLink) {
    emailLink.addEventListener("click", function (event) {
      event.preventDefault();
      obscureEmail(emailLink);
    });
  }

  const projectCards = document.querySelectorAll(".project-card");
  const firstCard = projectCards[0];

  projectCards.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.addEventListener("click", function () {
      card.focus();
    });

    // Clicking a tag triggers its corresponding filter button
    const tags = card.querySelectorAll(".tags span");
    tags.forEach((tag) => {
      tag.addEventListener("click", function (event) {
        event.stopPropagation();
        const tagText = event.target.textContent;
        const relatedButton = Array.from(
          document.querySelectorAll("#tag-list button")
        ).find((button) => button.textContent === tagText);
        if (relatedButton) {
          relatedButton.click();
        }
      });
    });

    // Handle arrow navigation for this card
    card.addEventListener("keydown", function (event) {
      handleArrowNavigation(event, card, projectCards);
    });
  });

  // Escape key brings focus back to the first card
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && firstCard) {
      event.preventDefault();
      firstCard.focus();
    }
  });

  // Build tags section
  const tagList = document.getElementById("tag-list");
  const allTags = new Set();
  projectCards.forEach((card) => {
    const tags = card.querySelector(".tags").textContent.split("\n");
    tags.forEach((tag) => {
      if (tag.trim()) allTags.add(tag.trim());
    });
  });

  // "All" filter button to reset the filter
  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.classList.add("tag-button-active");
  allButton.addEventListener("click", () => {
    filterProjects("All", projectCards);
    document.querySelectorAll("#tag-list button").forEach((btn) => {
      btn.classList.remove("tag-button-active");
      btn.classList.add("tag-button");
    });
    allButton.classList.add("tag-button-active");
    const firstVisibleCard = document.querySelector(
      ".project-card[style*='display: block']"
    );
    if (firstVisibleCard) {
      firstVisibleCard.focus();
    }
  });
  tagList.appendChild(allButton);

  // Generate individual tag buttons
  allTags.forEach((tag) => {
    const button = document.createElement("button");
    button.textContent = tag;
    button.classList.add("tag-button");
    button.addEventListener("click", () => {
      filterProjects(tag, projectCards);
      document.querySelectorAll("#tag-list button").forEach((btn) => {
        btn.classList.remove("tag-button-active");
        btn.classList.add("tag-button");
      });
      button.classList.add("tag-button-active");
      const firstVisibleCard = document.querySelector(
        ".project-card[style*='display: block']"
      );
      if (firstVisibleCard) {
        firstVisibleCard.focus();
      }
    });
    tagList.appendChild(button);
  });

  // Navigation hint (existing logic)
  const hintMessage = document.createElement("div");
  hintMessage.textContent =
    "Use arrow keys to navigate between project cards and Enter to select.";
  hintMessage.className = "navigation-hint";
  document.body.appendChild(hintMessage);

  if ("IntersectionObserver" in window && window.innerWidth > 768) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -25% 0px",
      threshold: 0.5,
    };

    const observerCallback = (entries) => {
      const isAnyCardVisible = entries.some((entry) => entry.isIntersecting);
      hintMessage.style.display = isAnyCardVisible ? "block" : "none";
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    projectCards.forEach((card) => observer.observe(card));
  } else if (!("IntersectionObserver" in window)) {
    const noObserverMessage = document.createElement("div");
    noObserverMessage.textContent =
      "Your browser does not support IntersectionObserver. Key Navigation will be skipped.";
    noObserverMessage.className = "navigation-hint-warning";
    document.body.appendChild(noObserverMessage);
    setTimeout(() => noObserverMessage.remove(), 5000);
  }

  // NEW: Separate observer to focus the first card once when it appears
  if (firstCard) {
    const focusObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          firstCard.focus();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    focusObserver.observe(firstCard);
  }

  // Remove hint message after 5 seconds
  setTimeout(() => {
    hintMessage.remove();
  }, 5000);
});
