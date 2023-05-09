  let chartInstance;

  // Function that displays powerstats as a chart
  const displayPowerstats = (powerstats) => {
    const labels = ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'];
    const values = [
      powerstats.intelligence,
      powerstats.strength,
      powerstats.speed,
      powerstats.durability,
      powerstats.power,
      powerstats.combat
    ];
  
    const ctx = document.getElementById('power-stats').getContext('2d');
  
    // Function for destroying existing chart 
    if (chartInstance) {
      chartInstance.destroy();
    }
  
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Powerstats',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  };
  
  
  // Function that displays the heroes biography data
const displayBiography = (biography) => {
  const biographyList = document.getElementById('biography');
  biographyList.innerHTML = `
    <li><strong>Name:</strong> ${biography['full-name']}</li>
    <li><strong>Alter Egos:</strong> ${biography['alter-egos']}</li>
    <li><strong>Aliases:</strong> ${biography.aliases.join(', ')}</li>
    <li><strong>Place of Birth:</strong> ${biography['place-of-birth']}</li>
    <li><strong>First Appearance:</strong> ${biography['first-appearance']}</li>
    <li><strong>Publisher:</strong> ${biography.publisher}</li>
    <li><strong>Alignment:</strong> ${biography.alignment}</li>
  `;
};


// Function for displaying searched hero related comics
const imagesFolder = './images/';
const img = document.getElementById('my-image');
img.alt = 'No movie information available'; // alt text

const fetchHeroData = async (name) => {
  try {
    const response = await fetch(`https://www.superheroapi.com/api.php/1952847071749817/search/${name}`);
    const data = await response.json();
    const result = data.results.filter(hero => hero.name.toLowerCase() === name.toLowerCase())[0];
    return result;
  } catch (error) {
    console.error(error);
  }
};

const displayImage = async (heroName) => {
  const heroData = await fetchHeroData(heroName);
  const imageName = heroData.name.toLowerCase().replace(/\s/g, '-') + '.png';
  img.src = imagesFolder + imageName;
};

// Function that reloads powerstats chart, biography and image
const reloadAllData = async (heroName) => {
  // Reload powerstats and biography for the current search
  const heroData = await fetchHeroData(heroName);
  const powerstats = heroData.powerstats;
  const biography = heroData.biography;
  displayPowerstats(powerstats);
  displayBiography(biography);

  // Funtion to display the searched hero related image
  await displayImage(heroName);
};

// Event listener for the search button
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', async () => {
  const heroName = document.getElementById('hero-name').value;

  // Function to check if previous searches are stored in local storage
  let previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];

  // Function that adds current search to the array of previous searches
  previousSearches.push(heroName);

  // Function that stores the updated array of previous searches in local storage
  localStorage.setItem('previousSearches', JSON.stringify(previousSearches));

  // Function that reloads all data for the current search
  await reloadAllData(heroName);
});


// Event listener for the reset button
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
  // Function to clear powerstats chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Function that clears the biography list
  const biographyList = document.getElementById('biography');
  biographyList.innerHTML = '';

  // Function tbat clears the hero name input field
  document.getElementById('hero-name').value = '';

  // Function that displays previous searches
  const previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];
  const previousSearchesList = document.getElementById('previous-searches');
  previousSearchesList.innerHTML = '';

  previousSearches.forEach(search => {
    const listItem = document.createElement('li');
    listItem.innerText = search;
    previousSearchesList.appendChild(listItem);
  });
});

  // Function that clears the biography list
  const biographyList = document.getElementById('biography');
  biographyList.innerHTML = '';

  // Function that clears the hero name input field
  document.getElementById('hero-name').value = '';


