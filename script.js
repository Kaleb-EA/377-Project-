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
  const response = await fetch(`https://www.superheroapi.com/api.php/1952847071749817/search/${name}`);
  const data = await response.json();
  const result = data.results.filter(hero => hero.name.toLowerCase() === name.toLowerCase())[0];
  return result;
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

// Function to get a list of image files in a folder
const getImagesList = async (folderPath) => {
const response = await fetch(folderPath);
const pageContent = await response.text();
const parser = new DOMParser();
const htmlDoc = parser.parseFromString(pageContent, 'text/html');
const imageLinks = htmlDoc.querySelectorAll('a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"]');
const imageNames = Array.from(imageLinks).map(link => link.getAttribute('href'));
return imageNames;
};

// Function to find an image file in a folder that has a similar name to the given string
const findSimilarImageName = (searchStr, imageFiles) => {
const normalizedSearchStr = searchStr.toLowerCase().replace(/\s/g, '-');
for (let i = 0; i < imageFiles.length; i++) {
  const imageName = imageFiles[i].replace(/\.png$|\.jpg$|\.jpeg$/i, '');
  const normalizedImageName = imageName.toLowerCase().replace(/\s/g, '-');
  if (normalizedImageName.includes(normalizedSearchStr)) {
    return imageFiles[i];
  }
}
return null;
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

// Function that clears the hero name input field
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
document.getElementById('hero-name').value = ''