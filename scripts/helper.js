// helper.js

export function getVisibleCards(projectCards) {
  if (!projectCards) return;
  return Array.from(projectCards).filter(
    (card) => card.style.display !== "none"
  );
}

// Internal helper: scroll the element into view and reapply focus after a short delay
function focusAndScroll(element) {
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  setTimeout(() => {
    element.focus({ preventScroll: true });
  }, 300);
}

// Internal helper: check if an element is at least partially in the viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

// Internal helper: get number of cards in the same row as the current card
// Uses a tolerance to account for minor differences in positioning.
function getCardsPerRow(currentCard, visibleCards) {
  const tolerance = 10;
  const currentTop = currentCard.getBoundingClientRect().top;
  return visibleCards.filter(card => {
    const cardTop = card.getBoundingClientRect().top;
    return Math.abs(cardTop - currentTop) < tolerance;
  }).length;
}

export function handleArrowNavigation(event, card, projectCards) {
  event.preventDefault();
  // If the current card is out of view, scroll it into view and exit early
  if (!isElementInViewport(card)) {

    focusAndScroll(card);
    return;
  }
  if (!projectCards || !card) return;

  const visibleCards = getVisibleCards(projectCards);
  const currentIndex = visibleCards.indexOf(card);

  switch (event.key) {
    case "Enter": {
      event.preventDefault();
      const liveDemo = card.querySelector("#live-demo");
      if (liveDemo) {
        window.open(liveDemo.href, "_blank");
      }
      break;
    }
    case "ArrowRight": {
      event.preventDefault();
      if (visibleCards[currentIndex + 1]) {
        focusAndScroll(visibleCards[currentIndex + 1]);
      }
      break;
    }
    case "ArrowLeft": {
      event.preventDefault();
      if (visibleCards[currentIndex - 1]) {
        focusAndScroll(visibleCards[currentIndex - 1]);
      }
      break;
    }
    case "ArrowDown": {
      event.preventDefault();
      const cardsInRow = getCardsPerRow(card, visibleCards);
      const targetIndex = currentIndex + cardsInRow;
      if (visibleCards[targetIndex]) {
        focusAndScroll(visibleCards[targetIndex]);
      }
      break;
    }
    case "ArrowUp": {
      event.preventDefault();
      const cardsInRow = getCardsPerRow(card, visibleCards);
      const targetIndex = currentIndex - cardsInRow;
      if (visibleCards[targetIndex]) {
        focusAndScroll(visibleCards[targetIndex]);
      }
      break;
    }
  }
}

export function filterProjects(tag, projectCards) {
  if (!projectCards) return;
  projectCards.forEach((card) => {
    const tags = card
      .querySelector(".tags")
      .textContent.split("\n")
      .map((t) => t.trim());
    // Show or hide cards based on whether the tag matches
    card.style.display = tag === "All" || tags.includes(tag) ? "block" : "none";
  });
}

export function obscureEmail(emailLink) {
  const user = "adelpro";
  const domain = "gmail.com";
  emailLink.href = `mailto:${user}@${domain}`;
  window.location.href = emailLink.href;
}
