// To use the API endpoints, the format is as follows:
// https://api.magicthegathering.io/<version>/<resource>
// For example:
// https://api.magicthegathering.io/v1/cards

//Base API URL
const MAGIC_BASE_URL = 'https://api.magicthegathering.io/v1/cards';

//DOM
const searchFormNode = document.querySelector('#searchForm');
const userSearchInput = document.querySelector('#searchText');
const searchResultsContainer = document.querySelector('#searchContainer');
const navBar = document.querySelector('#navBar');
const backButton = document.querySelector('#backButton');
const nextButton = document.querySelector('#nextButton');
const homeButton = document.querySelector('#home');
const individualCardDetail = document.querySelector('#individualCardDetail');
const myDeck = document.querySelector('#myDeck');
const myDeckList = document.querySelector('#myDeckList');


const favouritesArray = []; //empty array to store favourited cards

//global variable for pagination
let currentPage = 1; 

//Page starts with 100 cards loaded
loadAllCards();

//Clear any previous searches
function clearPreviousSearches(){

    myDeckList.replaceChildren();
    individualCardDetail.replaceChildren(); //clear previous searches
    searchResultsContainer.replaceChildren(); //clear previous searches
}

//show 100 cards by default, total count from headers: 81967 i.e. about 820 pages


function loadAllCards( currentPage ){

clearPreviousSearches()

     axios.get( MAGIC_BASE_URL, {
        params: {
            page: currentPage,
            pageSize: 10, //TODO: change to 100
        }
    })

    .then( res => {
        // console.log( 'loadAllCards', res.data );

        const cards = res.data.cards;
        // console.log( cards );

        //TODO: make the total displayed 10 ignoring null ones

        //loop through array of card objects and and render 
        cards.forEach( card => {
            if (card.imageUrl !== null && card.imageUrl !== undefined){
            // console.log( card.name );
            // console.log( card.imageUrl );

            const newImageTag = document.createElement('img');

            newImageTag.src= `${card.imageUrl}`;
            newImageTag.alt = `${card.name}`;
            newImageTag.dataset.id = card.id;
            newImageTag.classList.add('cardTile');

            //Add seleted properties to searchResultsContainer
            searchResultsContainer.appendChild(newImageTag);

        }
        })
    
    })

    .catch( err => {
        console.warn('Error loading search results:', err );
    });
}
// };


//load search results
const loadSearchResults = ( searchText ) =>{

    clearPreviousSearches()

    axios.get(MAGIC_BASE_URL, {
        params: {
            name: searchText,
        }
    })

    //display cards that include the searchText in the name, this seems to be case insensitive
    
    .then(res => {

        const cards = res.data.cards;

        // console.log( cards );

        cards.forEach( card => {
            if (card.imageUrl !== null && card.imageUrl !== undefined){

            const newImageTag = document.createElement('img');
            newImageTag.src= `${card.imageUrl}`
            newImageTag.alt = `${card.name}`

            //get the id and add as an attribute to each image to target later for card details page
            newImageTag.dataset.id = card.id;
            // console.log(card.id);

            //add the defined image details above
            searchResultsContainer.appendChild(newImageTag);

            }
        } )

    })

    .catch( err =>{
        console.warn( 'Error loading search results:', err );
    });

}

//load the card details using /cards/:id
const cardDetails = (id) => {

    clearPreviousSearches()

    axios.get( `${MAGIC_BASE_URL}/${id}` )

    .then( res=> {

        // console.log('card details', res.data.card.imageUrl);
        const newImageTag = document.createElement('img');
        newImageTag.src= `${res.data.card.imageUrl}`
        
        const newDivTag = document.createElement('div');

        // newDivTag.dataset.id = 'individualCard'

        newDivTag.dataset.id ='cardDetailsContainer'
        newDivTag.innerHTML = `
        <h2>${res.data.card.name}</h2>
        <span class="material-symbols-outlined" id="favourite">
        favorite </span>
        <p>Type: ${res.data.card.type}</p>
        <p>Rarity: ${res.data.card.rarity}</p>
        <p>${res.data.card.text}</p>
        `

        individualCardDetail.appendChild(newImageTag);
        individualCardDetail.appendChild(newDivTag);

        const favouriteButton = document.querySelector('#favourite');
        
        favouriteButton.addEventListener( 'click', ev => {

            console.log('favouriteButton clicked');

        // push id into array
            favouritesArray.push( res.data.card );
            console.log( 'favourites array push', res.data.card );
            console.log( favouritesArray );
        })

    })

    .catch( err =>{
        console.warn( 'Error loading search results:', err );
    });


}

//event handler to 
searchFormNode.addEventListener(`submit`, ev =>{
    
    ev.preventDefault(); //stop the form submit as not sending data to a server

      console.log('clicked');
    //   console.log(userSearchInput.value);

      loadSearchResults( userSearchInput.value );

});

searchResultsContainer.addEventListener( 'click', ev => {
    console.log('card clicked', ev.target.dataset.id);

    
    const clickedCard = ev.target.dataset.id
    // console.log(clickedCard);
    cardDetails(clickedCard);

})

nextButton.addEventListener('click', ev =>{

    //display back button
    backButton.style.display = "block";

    clearPreviousSearches()

    //currentPage + 1
    if (currentPage <=820 ){

        loadAllCards( currentPage += 1 );

    } else {
        
        const newPTag = document.createElement('p')
        newPTag.innerHTML = `
        You've reached the end of the cards list, please go back or return Home.
        `
        searchResultsContainer.appendChild(newPTag);
    }
})

backButton.addEventListener('click', ev =>{

    //display back button

    clearPreviousSearches()

    //currentPage - 1
    currentPage -= 1

    //turnary? to check if a condition is true or not, will display the first value if true, the second value if false
    backButton.style.display = currentPage > 1 ? 'block' : 'none'

    loadAllCards(currentPage);
})

homeButton.addEventListener('click', ev=>{
    currentPage = 1;
    loadAllCards( currentPage );
});

//On click of 'My Deck' link take user to list of favourites or display the 'No cards yet' message
myDeck.addEventListener('click', ev=>{

    clearPreviousSearches()

    newH2Tag = document.createElement('h2')
    newH2Tag.innerHTML = 'My deck'

    myDeckList.appendChild(newH2Tag);

    //TODO: if statement to check if it's empty or has data
    if( favouritesArray.length === 0 ){
        newDivTag = document.createElement('div');
        newDivTag.innerHTML = `
        There are no cards in your list yet.

        `

        myDeckList.appendChild(newDivTag);

    } else {

    //for each to loop through array and display certain properties

    favouritesArray.forEach( card =>{

        const newImageTag = document.createElement('img');
        newImageTag.src= `${card.imageUrl}`;
        newImageTag.alt = `${card.name}`;
        newImageTag.classList.add('cardTile');

        myDeckList.appendChild(newImageTag);

    })
}

});


//test
//load all cards on first visit - need to sort out async/ loading
//click onto card for more details
//favourite to add to new array
//click on faves displays all stored items
//capitals vs lower case search