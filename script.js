document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".project-card");

  // Ensure the first card is focusable and add initial focus
  projectCards.forEach((card) => {
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

  function getVisibleCards() {
    return Array.from(projectCards).filter(
      (card) => card.style.display !== "none"
    );
  }

  projectCards.forEach((card, index) => {
    card.addEventListener("keydown", function (event) {
      // Handle Enter key to click the first link
      if (event.key === "Enter") {
        const link = this.querySelector("a");
        if (link) {
          link.click();
        }
      }

      // Navigation using arrow keys
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          const visibleCards = getVisibleCards();
          const currentVisibleIndex = visibleCards.indexOf(card);
          if (visibleCards[currentVisibleIndex + 1]) {
            visibleCards[currentVisibleIndex + 1].focus();
          }
          break;

        case "ArrowLeft":
          event.preventDefault();
          const visibleCardsLeft = getVisibleCards();
          const currentVisibleLeftIndex = visibleCardsLeft.indexOf(card);
          if (visibleCardsLeft[currentVisibleLeftIndex - 1]) {
            visibleCardsLeft[currentVisibleLeftIndex - 1].focus();
          }
          break;

        case "ArrowDown":
          event.preventDefault();
          const cardsPerRowDown = Math.floor(
            window.innerWidth / projectCards[0].offsetWidth
          );
          const visibleCardsDown = getVisibleCards();
          const currentDownIndex = visibleCardsDown.indexOf(card);
          const nextCardIndexDown = currentDownIndex + cardsPerRowDown;
          if (visibleCardsDown[nextCardIndexDown]) {
            visibleCardsDown[nextCardIndexDown].focus();
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          const cardsPerRowUp = Math.floor(
            window.innerWidth / projectCards[0].offsetWidth
          );
          const visibleCardsUp = getVisibleCards();
          const currentUpIndex = visibleCardsUp.indexOf(card);
          const prevCardIndexUp = currentUpIndex - cardsPerRowUp;
          if (visibleCardsUp[prevCardIndexUp]) {
            visibleCardsUp[prevCardIndexUp].focus();
          }
          break;
      }
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
  allButton.addEventListener("click", () => {
    filterProjects("All");
    document.querySelectorAll("#tag-list button").forEach((btn) => {
      btn.classList.remove("active");
    });
    allButton.classList.add("active");

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
    button.addEventListener("click", () => {
      filterProjects(tag);
      document.querySelectorAll("#tag-list button").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");

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

  // Filter projects based on selected tag
  function filterProjects(tag) {
    projectCards.forEach((card) => {
      const tags = card
        .querySelector(".tags")
        .textContent.split("\n")
        .map((t) => t.trim());
      // Show or hide cards based on whether the tag matches
      if (tag === "All" || tags.includes(tag)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }
  // Set "All" as the default tag and make it active
  allButton.classList.add("active");
  filterProjects("All");

  // Show a navigation hint to the user only when the card list is visible
  const hintMessage = document.createElement("div");
  hintMessage.textContent =
    "Use arrow keys to navigate between project cards and Enter to select.";
  hintMessage.style.position = "fixed";
  hintMessage.style.top = "20px";
  hintMessage.style.left = "50%";
  hintMessage.style.transform = "translateX(-50%)";
  hintMessage.style.padding = "10px";
  hintMessage.style.backgroundColor = "#333";
  hintMessage.style.color = "#fff";
  hintMessage.style.borderRadius = "5px";
  hintMessage.style.zIndex = "1000";
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
