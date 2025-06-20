console.log("script started");

document.addEventListener("DOMContentLoaded", function () {
    // Restore last search input
    document.getElementById("searchInput").value = localStorage.getItem("lastSearch") || "";
  
    // Search listeners
    document.getElementById("searchButton").addEventListener("click", function () {
      searchRecommendations();
    });
  
    // document.getElementById("resetButton").addEventListener("click", function () {
    //  document.getElementById("searchInput").value = "";
    // });
  
    // Navigation logic
    function showSection(sectionId) {
      const sections = ["sct-home", "sct-about", "sct-contact", "sct-recom"];
      sections.forEach(id => document.getElementById(id)?.classList.add("hidden"));
      document.getElementById("search-container").classList.add("invisible");

      // Show the selected section
      document.getElementById(sectionId)?.classList.remove("hidden");

      // Special case: reveal search-container if home is shown
      if (sectionId === "sct-home") {
        document.getElementById("search-container")?.classList.remove("invisible");
      }
    }

    // Nav link handlers
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
  
    // Search function
    function searchRecommendations() {
      fetch("data/travel_recommendation_api.json")
        .then(response => response.json())
        .then(data => {
          const query = document.getElementById("searchInput").value.toLowerCase();
          localStorage.setItem("lastSearch", query);
  
          const results = data.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query)
          );
  
          document.getElementById("results").innerHTML = results.length
            ? results.map(item => `<p><strong>${item.title}</strong>: ${item.content}</p>`).join("")
            : "<p>No results found.</p>";
        })
        .catch(error => console.error("Error fetching data:", error));
    }
  });
  
function normalizeWord(word) {
    return word
      .toLowerCase()
      .replace(/(es|s)$/, ''); // removes plural endings like 's' and 'es'
}

function normalize(text) {
    return text
      .toLowerCase()
      .split(/\W+/) // splits into words
      .map(word => word.replace(/(es|s)$/, '')) // basic stemming
      .join(' ');
  }
  
  function searchRecommendations() {
    const input = document.getElementById("searchInput").value;
    const query = normalize(input);
  
    fetch("data/travel_recommendation_api.json")
      .then(response => response.json())
      .then(data => {
        const results = data.filter(item => {
          const title = normalize(item.title);
          const content = normalize(item.content);
          return title.includes(query) || content.includes(query);
        });
  
        document.getElementById("results").innerHTML = results.length
          ? results.map(item => `<p><strong>${item.title}</strong>: ${item.content}</p>`).join("")
          : "<p>No results found.</p>";
      })
      .catch(error => console.error("Error fetching data:", error));
  }
  