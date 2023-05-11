let chartInstance = null;


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

// Function that loads searched hero and there affilliated team's comics that are similar to the movies they are in
const imagesFolder = './images/';
const imgHero = document.getElementById('hero-image');
imgHero.alt = 'No hero image available';
const imgTeam = document.getElementById('team-image');
imgTeam.alt = 'No team image available';

const fetchHeroData = async (name) => {
  try {
    let id;
    let heroName = name;
    if (name.toLowerCase() === 'captain marvel') {
      id = 157;
    } else if (name.toLowerCase() === 'shazam') {
      id = 156;
      heroName = "shazam";
    } else {
      const response = await fetch(`https://www.superheroapi.com/api.php/1952847071749817/search/${name}`);
      const data = await response.json();
      const result = data.results.filter(hero => hero.name.toLowerCase() === name.toLowerCase())[0];
      id = result.id;
    }
    const response = await fetch(`https://www.superheroapi.com/api.php/1952847071749817/${id}`);
    const data = await response.json();
    data.heroName = heroName;
    return data;
  } catch (error) {
    console.error(error);
  }
};


// Function that displays searched hero and there affilliated team's comics that are similar to the movies they are in
const displayImages = async (heroName) => {
imgHero.src = '';
imgTeam.src = '';

const heroData = await fetchHeroData(heroName);
const heroImageName = heroData.name.toLowerCase().replace(/\s/g, '-') + '.png';
const heroImagePath = imagesFolder + heroImageName;
const teamNames = heroData.connections['group-affiliation'];

if (teamNames) {
  const teamNameArray = teamNames.split(';').map(name => name.trim());
  for (const teamName of teamNameArray) {
    const teamImageName = teamName.toLowerCase().replace(/\s/g, '-') + '.png';
    const teamImagePath = imagesFolder + teamImageName;

    if (teamName.includes('Avengers')) {
      try {
        const teamImageResponse = await fetch(imagesFolder + 'Avengers.png');
        if (teamImageResponse.ok) {
          imgTeam.src = imagesFolder + 'Avengers.png';
          break;
        } else {
          console.error(`Team image not found: ${imagesFolder + 'Avengers.png'}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (teamName.includes('X-')) {
      try {
        const teamImageResponse = await fetch(imagesFolder + 'x-men.png');
        if (teamImageResponse.ok) {
          imgTeam.src = imagesFolder + 'x-men.png';
          break;
        } else {
          console.error(`Team image not found: ${imagesFolder + 'x-men.png'}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (teamName.includes('Justice')) {
      try {
        const teamImageResponse = await fetch(imagesFolder + 'Justice-league.png');
        if (teamImageResponse.ok) {
          imgTeam.src = imagesFolder + 'Justice-league.png';
          break;
        } else {
          console.error(`Team image not found: ${imagesFolder + 'Justice-league.png'}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
      try {
        const heroImageResponse = await fetch(imagesFolder + hero.name.replace(/ /g, '_') + '.png');
        if (heroImageResponse.ok) {
          imgHero.src = imagesFolder + hero.name.replace(/ /g, '_') + '.png';
        } else {
          console.error(`Hero image not found: ${imagesFolder + hero.name.replace(/ /g, '_') + '.png'}`);
        }
      } catch (error) {
        console.error(error);
      }
      if (teamName.includes('Galaxy')) {
        try {
          const teamImageResponse = await fetch(imagesFolder + 'Guardians-of-the-Galaxy.png');
          if (teamImageResponse.ok) {
            imgTeam.src = imagesFolder + 'Guardians-of-the-Galaxy.png';
            break;
          } else {
            console.error(`Team image not found: ${imagesFolder + 'Guardians-of-the-Galaxy.png'}`);
          }
        } catch (error) {
          console.error(error);
        }
      }
    try {
      const teamImageResponse = await fetch(teamImagePath);
      if (teamImageResponse.ok) {
        imgTeam.src = teamImagePath;
        break;
      } else {
        console.error(`Team image not found: ${teamImagePath}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

try {
  const heroImageResponse = await fetch(heroImagePath);
  if (heroImageResponse.ok) {
    imgHero.src = heroImagePath;
  } else {
    console.error(`Hero image not found: ${heroImagePath}`);
  }
} catch (error) {
  console.error(error);
}

if (!imgHero.src) {
  imgHero.alt = 'No hero image available';
}

if (!imgTeam.src) {
  imgTeam.alt = 'No team image available';
}
};



// Function that reloads powerstats chart, biography and image
const reloadAllData = async (heroName) => {
// This reloads powerstats and biography for the current search
const heroData = await fetchHeroData(heroName);
const powerstats = heroData.powerstats;
const biography = heroData.biography;
displayPowerstats(powerstats);
displayBiography(biography);


// Funtion to display the searched hero related image
await displayImages(heroName);
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

// Function that reloads everything with the reset button
const resetImages = () => {
  imgHero.src = '';
  imgTeam.src = '';
};
const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
  // Clears the hero's name input field
  document.getElementById('hero-name').value = '';

  // Resets the hero's and team images
  imgHero.src = '';
  imgHero.alt = 'No hero image available';
  imgTeam.src = '';
  imgTeam.alt = 'No team image available';

  // Resets the powerstats chart
  displayPowerstats({
    intelligence: 0,
    strength: 0,
    speed: 0,
    durability: 0,
    power: 0,
    combat: 0
  });

  // Resets the biography list
  const biographyList = document.getElementById('biography');
  biographyList.innerHTML = '';
});

// Function that displays previous searches
const previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];
const previousSearchesList = document.getElementById('previous-searches');
previousSearchesList.innerHTML = '';

previousSearches.forEach(search => {
  const listItem = document.createElement('li');
  listItem.innerText = search;
  previousSearchesList.appendChild(listItem);
});

// Function that clears the biography list
const biographyList = document.getElementById('biography');
biographyList.innerHTML = '';

// Function that clears the hero name input field
document.getElementById('hero-name').value = ''

