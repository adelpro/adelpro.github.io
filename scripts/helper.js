export function getVisibleCards(projectCards) {
  if (!projectCards) return;
  return Array.from(projectCards).filter(
    (card) => card.style.display !== "none"
  );
}

export function handleArrowNavigation(event, card, projectCards) {
  if (!projectCards) return;
  if (!card) return;

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
      const visibleCards = getVisibleCards(projectCards);
      const currentVisibleIndex = visibleCards.indexOf(card);
      if (visibleCards[currentVisibleIndex + 1]) {
        visibleCards[currentVisibleIndex + 1].focus();
      }
      break;
    }

    case "ArrowLeft": {
      event.preventDefault();
      const visibleCardsLeft = getVisibleCards(projectCards);
      const currentVisibleLeftIndex = visibleCardsLeft.indexOf(card);
      if (visibleCardsLeft[currentVisibleLeftIndex - 1]) {
        visibleCardsLeft[currentVisibleLeftIndex - 1].focus();
      }
      break;
    }

    case "ArrowDown": {
      event.preventDefault();
      const cardsPerRowDown = Math.floor(
        window.innerWidth / projectCards[0].offsetWidth
      );
      const visibleCardsDown = getVisibleCards(projectCards);
      const currentDownIndex = visibleCardsDown.indexOf(card);
      const nextCardIndexDown = currentDownIndex + cardsPerRowDown;
      if (visibleCardsDown[nextCardIndexDown]) {
        visibleCardsDown[nextCardIndexDown].focus();
      }
      break;
    }

    case "ArrowUp": {
      event.preventDefault();
      const cardsPerRowUp = Math.floor(
        window.innerWidth / projectCards[0].offsetWidth
      );
      const visibleCardsUp = getVisibleCards(projectCards);
      const currentUpIndex = visibleCardsUp.indexOf(card);
      const prevCardIndexUp = currentUpIndex - cardsPerRowUp;
      if (visibleCardsUp[prevCardIndexUp]) {
        visibleCardsUp[prevCardIndexUp].focus();
      }
      break;
    }
  }
}

export function filterProjects(tag, projectCards) {
  if (!projectCards) {
    return;
  }
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

export function obscureEmail(emailLink) {
  const user = "adelpro";
  const domain = "gmail.com";
  emailLink.href = `mailto:${user}@${domain}`;

  window.location.href = emailLink.href;
}
