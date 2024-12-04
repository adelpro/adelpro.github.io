import { handleArrowNavigation, filterProjects } from "./helper.js";

document.addEventListener("DOMContentLoaded", function () {
  // obscure the email link
  const emailLink = document.getElementById("email-link");
  emailLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (emailLink) {
      const user = "adelpro";
      const domain = "gmail.com";
      emailLink.href = `mailto:${user}@${domain}`;

      window.location.href = emailLink.href;
    }
  });
  const projectCards = document.querySelectorAll(".project-card");
  const firstCard = projectCards[0];

  projectCards.forEach((card) => {
    card.addEventListener("click", function () {
      card.focus();
    });
    card.setAttribute("tabindex", "0");

    const tags = card.querySelectorAll(".tags span");
    tags.forEach((tag) => {
      tag.addEventListener("click", function (event) {
        const tagText = event.target.textContent;
        const relatedButton = Array.from(
          document.querySelectorAll("#tag-list button")
        ).find((button) => button.textContent === tagText);

        if (relatedButton) {
          relatedButton.click();
        }
      });
    });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      if (firstCard) {
        firstCard.focus();
      }
    }
  });

  projectCards.forEach((card) => {
    card.addEventListener("keydown", function (event) {
      handleArrowNavigation(event, card, projectCards);
    });
  });

  // Tags section:
  const tagList = document.getElementById("tag-list");

  // Extract all unique tags
  const allTags = new Set();
  projectCards.forEach((card) => {
    const tags = card.querySelector(".tags").textContent.split("\n");
    tags.forEach((tag) => {
      if (tag.trim()) allTags.add(tag.trim());
    });
  });

  // Create and append the "All" button to reset filter
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

    // Focus the first visible card after resetting the filter
    const firstVisibleCard = document.querySelector(
      ".project-card[style*='display: block']"
    );
    if (firstVisibleCard) {
      firstVisibleCard.focus();
    }
  });
  tagList.appendChild(allButton);

  // Generate tag buttons
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

      // Focus the first visible project card after filtering
      const firstVisibleCard = document.querySelector(
        ".project-card[style*='display: block']"
      );
      if (firstVisibleCard) {
        firstVisibleCard.focus();
      }
    });
    tagList.appendChild(button);
  });

  // Set "All" as the default tag and make it active
  allButton.classList.add("tab-button-active");
  filterProjects("All");

  // Show a navigation hint to the user only when the card list is visible
  const hintMessage = document.createElement("div");
  hintMessage.textContent =
    "Use arrow keys to navigate between project cards and Enter to select.";
  hintMessage.className = "navigation-hint";
  document.body.appendChild(hintMessage);

  // Setup IntersectionObserver to show the hint when cards are in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(
      (entry) => {
        if (entry.isIntersecting) {
          hintMessage.style.display = "block";
          const firstVisibleCard = document.querySelector(".project-card");
          if (firstVisibleCard) {
            firstVisibleCard.focus();
          }
        } else {
          hintMessage.style.display = "none";
        }
      },
      { threshold: 1.0 }
    );
  });

  // Ensure all project cards are observed
  projectCards.forEach((card) => {
    if (card) {
      observer.observe(card);
    }
  });

  // Remove hint after 5 seconds
  setTimeout(() => {
    hintMessage.remove();
  }, 5000);
});
