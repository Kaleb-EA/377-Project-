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

// constanstns and event listener for character search
  const searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener('click', () => {
    const heroId = document.getElementById('hero-id').value;
  
    // Fetching and displaying characters powerstats data
    fetch(`https://www.superheroapi.com/api.php/1952847071749817/${heroId}/powerstats`)
    .then(response => response.json())
    .then(data => {
      const labels = ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'];
      const values = [
        data.intelligence,
        data.strength,
        data.speed,
        data.durability,
        data.power,
        data.combat
      ];

      const ctx = document.getElementById('power-stats').getContext('2d');
      const myChart = new Chart(ctx, {
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
    })
    .catch(error => console.log(error));
  
    // Fetching and displaying heroes biography data
    fetch(`https://www.superheroapi.com/api.php/1952847071749817/${heroId}/biography`)
      .then(response => response.json())
      .then(data => {
        const biographyList = document.getElementById('biography');
        biographyList.innerHTML = `
          <li><strong>Name:</strong> ${data['full-name']}</li>
          <li><strong>Alter Egos:</strong> ${data['alter-egos']}</li>
          <li><strong>Aliases:</strong> ${data.aliases.join(', ')}</li>
          <li><strong>Place of Birth:</strong> ${data['place-of-birth']}</li>
          <li><strong>First Appearance:</strong> ${data['first-appearance']}</li>
          <li><strong>Publisher:</strong> ${data.publisher}</li>
          <li><strong>Alignment:</strong> ${data.alignment}</li>
          `;
          document.getElementById('hero-id').value = '';
        })
        .catch(error => console.error(error));
    });