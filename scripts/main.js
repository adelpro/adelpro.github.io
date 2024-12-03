import {
  getVisibleCards,
  handleArrowNavigation,
  filterProjects,
} from "./helper.js";

document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".project-card");

  // Ensure the first card is focusable and add initial focus
  projectCards.forEach((card) => {
    //card.classList.remove("active");
    card.addEventListener("click", function () {
      card.focus();
      card.classList.add("active");
    });
    card.setAttribute("tabindex", "0");
  });

  // Global escape key listener to return to first card
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      if (firstCard) {
        firstCard.focus();
      }
    }
  });

  projectCards.forEach((card, _index) => {
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
  allButton.classList.add("tag-button");
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
  allButton.classList.add("ta-button-active");
  filterProjects("All");

  // Show a navigation hint to the user only when the card list is visible
  const hintMessage = document.createElement("div");
  hintMessage.textContent =
    "Use arrow keys to navigate between project cards and Enter to select.";
  hintMessage.className = "navigation-hint";
  document.body.appendChild(hintMessage);

  // Setup IntersectionObserver to show the hint when cards are in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        hintMessage.style.display = "block";
        const firstVisibleCard = document.querySelector(
          ".project-card[style*='display: block']"
        );
        if (firstVisibleCard) {
          firstVisibleCard.focus();
        }
      } else {
        hintMessage.style.display = "none";
      }
    });
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