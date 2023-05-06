/* eslint-disable max-len */
/*
  Welcome to Javascript!

  This file contains parts of a simple script to make your carousel work.
  Please feel free to edit away - the main version of this with all the notes is safely stored elsewhere
*/
/* eslint-enable max-len */
// set our first slide's position to "0", the opening position in an array
let slidePosition = 0;

// gather a reference to every slide we're using via the class name and querySelectorAll
const slides = document.querySelectorAll('.carousel_item');

// change that "NodeList" into a Javascript "array", to get access to "array methods"
const slidesArray = Array.from(slides);

// Figure out how many slides we have available
const totalSlides = slidesArray.length;

function updateSlidePosition() {
  slidesArray.forEach(slide => {
    slide.classList.remove('visible');  
    slide.classList.add('hidden');  
  });

  slides[slidePosition].classList.add('visible');
}

function moveToNextSlide() {
  /*
    add an if statement here that checks
    if you're already at the max number of slides
    and if so, sets your slidePosition to the first index of an array
    if not, set the slidePosition to the current position plus one
  */
  if(slidePosition === totalSlides - 1){
    slidePosition = 0;
  } else { 
    slidePosition += 1;
}
  updateSlidePosition(); // this is how you call a function within a function
}

function moveToPrevSlide() {
  /*
    add an if statement here that checks
    if you're already at the first index position for an array
    and if so, sets your slidePosition to the last slide position in totalSlides
    if not, set the slidePosition to the current position minus one
  */
  if(slidePosition === 0){
    slidePosition = totalSlides - 1;
  } else { 
    slidePosition -= 1;
} 
  updateSlidePosition();
}

/*
  These two functions have been assigned via "addEventListener"
  to the elements accessed by the "querySelector" set to the class name on each
*/
document.querySelector('.next') // Get the appropriate element (<button class="next">)
  .addEventListener('click', () => { // set an event listener on it - when it's clicked, do this callback function
    console.log('clicked next'); // let's tell the client console we made it to this point in the script
    moveToNextSlide(); // call the function above to handle this
  });

// Paying close attention to the above queryselector, write one that fires
// when you want a "prev" slide
document.querySelector('.prev') // Get the appropriate element (<button class="next">)
  .addEventListener('click', () => { // set an event listener on it - when it's clicked, do this callback function
    console.log('clicked prev'); // let's tell the client console we made it to this point in the script
    moveToPrevSlide(); // call the function above to handle this
  });
  
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
const fetchHeroData = async (name) => {
  try {
    const response = await fetch(`https://www.superheroapi.com/api.php/1952847071749817/search/${name}`);
    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.error(error);
  }
};

// Function that reloads powerstats chart and biography
const reloadPowerstatsAndBiography = async (heroName) => {
  // Fetches for displaying hero's powerstats data
  const heroData = await fetchHeroData(heroName);
  const powerstats = heroData.powerstats;
  displayPowerstats(powerstats);

  //Function that fetchs for displaying hero's biography data
  const bioData = await fetchHeroData(heroName);
  const biography = bioData.biography;
  displayBiography(biography);
};

// Event listener for the search button
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', async () => {
  const heroName = document.getElementById('hero-name').value;

  await reloadPowerstatsAndBiography(heroName);
});

// Event listener for the reset button
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
  // Function to clear powerstats chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Function to clear the biography list
  const biographyList = document.getElementById('biography');
  biographyList.innerHTML = '';

  // Function to clear the hero name input field
  document.getElementById('hero-name').value = '';
});
