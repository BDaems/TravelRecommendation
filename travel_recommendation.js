console.log("script started");

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("results");

  // Restore last search term if available
  searchInput.value = localStorage.getItem("lastSearch") || "";

  // Normalize user input (basic stemming)
  function normalize(text) {
    return text
      .toLowerCase()
      .split(/\W+/)
      .map(word => word.replace(/(es|s)$/, ""))
      .join(" ");
  }

  // Search function with images
  function searchRecommendations() {
    const query = normalize(searchInput.value);
    localStorage.setItem("lastSearch", searchInput.value);

    fetch("data/travel_recommendation_api.json")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Flatten data into unified list of searchable items
        const cities = data.countries.flatMap(country =>
          country.cities.map(city => ({
            title: city.name,
            content: city.description,
            image: city.imageUrl
          }))
        );
        const temples = data.temples.map(temple => ({
          title: temple.name,
          content: temple.description,
          image: temple.imageUrl
        }));
        const beaches = data.beaches.map(beach => ({
          title: beach.name,
          content: beach.description,
          image: beach.imageUrl
        }));

        const allItems = [...cities, ...temples, ...beaches];

        const results = allItems.filter(item => {
          const title = normalize(item.title);
          const content = normalize(item.content);
          return title.includes(query) || content.includes(query);
        });

        resultsContainer.innerHTML = results.length
          ? results
              .map(
                item => `
              <div class="result-item">
                <img src="${item.image}" alt="${item.title}" class="result-image">
                <div class="result-text">
                  <h3>${item.title}</h3>
                  <p>${item.content}</p>
                </div>
              </div>`
              )
              .join("")
          : "<p>No results found.</p>";
        
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        resultsContainer.innerHTML = "<p>Error loading recommendations.</p>";
      });
  }

  // Navigation logic
  function showSection(sectionId) {
    const sections = ["sct-home", "sct-about", "sct-contact", "sct-recom"];
    sections.forEach(id => document.getElementById(id)?.classList.add("hidden"));
    document.getElementById("search-container").classList.add("invisible");

    document.getElementById(sectionId)?.classList.remove("hidden");

    if (sectionId === "sct-home") {
      document.getElementById("search-container").classList.remove("invisible");
    }
  }

  // Event listeners
  document.getElementById("searchButton").addEventListener("click", searchRecommendations);

  document.getElementById("clearButton").addEventListener("click", function () {
    searchInput.value = "";
    localStorage.removeItem("lastSearch");
    resultsContainer.innerHTML = "";
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault(); // prevents the form from submitting/reloading if wrapped in a form
        searchRecommendations(); // trigger the same search logic
    }
  });


  document.getElementById("home").addEventListener("click", function (e) {
    e.preventDefault();
    showSection("sct-home");
  });

  document.getElementById("aboutus").addEventListener("click", function (e) {
    e.preventDefault();
    showSection("sct-about");
  });

  document.getElementById("contactus").addEventListener("click", function (e) {
    e.preventDefault();
    showSection("sct-contact");
  });
});
