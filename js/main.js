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
const existingSpan = document.querySelector('#cardCount');

//empty array to store favourited cards
const favouritesArray = []; 

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
            pageSize: 25, 
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
            newImageTag.classList.add('cardTile');

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
    nextButton.style.display= "none"; //hide next button

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
        heart_plus
        </span>
        <p><strong>Type:</strong> ${res.data.card.type}</p>
        <p><strong>Rarity:</strong> ${res.data.card.rarity}</p>
        <p>${res.data.card.text}</p>
        `

        individualCardDetail.appendChild(newImageTag);
        individualCardDetail.appendChild(newDivTag);

        const favouriteButton = document.querySelector('#favourite');
        
        favouriteButton.addEventListener( 'click', ev => {

            // console.log('favouriteButton clicked');
            // console.log(favouriteButton.innerText);


            //if already favourited, change to minus icon, if clicked again change to a plus - mimicking adding and removing to favourited cards "My deck"

            if (favouriteButton.innerText === 'heart_plus'){
                favouriteButton.innerText = 'heart_minus'
            } else if( favouriteButton.innerText === 'heart_minus' ){
                favouriteButton.innerText = 'heart_plus'
            }

            // push object into array
            favouritesArray.push( res.data.card );
            // console.log( 'favourites array push', res.data.card );
            console.log( favouritesArray );

            //update favourited card number on My deck button 

            existingSpan.replaceChildren();// clear any previous numbers

            existingSpan.innerHTML = `
            (${favouritesArray.length})
            `

        })

    })

    .catch( err =>{
        console.warn( 'Error loading search results:', err );
    });


}

//event handler to 
searchFormNode.addEventListener(`submit`, ev =>{
    
    ev.preventDefault(); //stop the form submit as not sending data to a server

    //   console.log('clicked');
    //   console.log(userSearchInput.value);

      loadSearchResults( userSearchInput.value );

});

searchResultsContainer.addEventListener( 'click', ev => {
    // console.log('card clicked', ev.target.dataset.id);

    
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
    nextButton.style.display="block"; //ensure next button is displaying
});

//On click of 'My Deck' link take user to list of favourites or display the 'No cards yet' message
myDeck.addEventListener('click', ev=>{

    clearPreviousSearches();

    newH2Tag = document.createElement('h2');
    newH2Tag.innerHTML = 'My deck';

    myDeckList.appendChild(newH2Tag);

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
        newImageTag.dataset.id = card.id;

        myDeckList.appendChild(newImageTag);

    })
}

});

myDeckList.addEventListener('click', ev =>{
    // console.log(ev.target.dataset.id);
    cardDetails(ev.target.dataset.id);
})


//TEST

//load all cards on first visit
//paginate to browse more, on first page the back button disappears
//click onto card for more details (from search results and my deck)
//my deck has different text when empty
//favourite card to add to My deck, favourite icon changes once clicked (until refreshed - TODO)
//click on My deck to display all favourited cards
//go home to return to first page
//search for card names
    //capitals vs lower case search