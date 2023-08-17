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


const favouritesArray = []; //empty array to store favourited cards

//global variable for pagination
let currentPage = 1; 

//Page starts with 100 cards loaded
loadAllCards();
removeBackOnPageOne();

function removeBackOnPageOne(){
    console.log(currentPage);

    if (currentPage <= 1) {

        backButton.style.display = "none";

    }

}

//show 100 cards by default, total count from headers: 81967 i.e. about 820 pages

//TODO: if on second page+ show the back button via display: block CSS



function loadAllCards( currentPage ){

    searchResultsContainer.replaceChildren(); // clear any previous results
    


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
        //loop through array and render 
        
        
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

    searchResultsContainer.replaceChildren(); //clear any previous search results

    axios.get(MAGIC_BASE_URL, {
        params: {
            name: searchText,
        }
    })

    //display cards that include the searchText in the name, this seems to be case insensitive
    
    .then(res => {

        const cards = res.data.cards;

        console.log( cards );

        cards.forEach( card => {

            const newImageTag = document.createElement('img');
            newImageTag.src= `${card.imageUrl}`
            newImageTag.alt = `${card.name}`

            //get the id and add as an attribute to each image to target later for details
            newImageTag.dataset.id = card.id;
            // console.log(card.id);


            //add the defined image details above
            searchResultsContainer.appendChild(newImageTag);

        } )

    })

    .catch( err =>{
        console.warn( 'Error loading search results:', err );
    });

}

///cards/:id

//TODO: stop further clicking
const cardDetails = (id) => {
    searchResultsContainer.replaceChildren();

    axios.get( `${MAGIC_BASE_URL}/${id}` )

    .then( res=> {

        // console.log('card details', res.data.card.imageUrl);
        const newImageTag = document.createElement('img');
        newImageTag.src= `${res.data.card.imageUrl}`
        
        const newDivTag = document.createElement('div');
        // newDivTag.dataset.id = 'individualCard'
        newDivTag.innerHTML = `
        <span class="material-symbols-outlined" id="favourite">
        favorite </span>
        <p>Type: ${res.data.card.type}</p>
        <p>Rarity: ${res.data.card.rarity}</p>
        <p>${res.data.card.text}</p>
        `

        searchResultsContainer.appendChild(newImageTag);
        searchResultsContainer.appendChild(newDivTag);

        const favouriteButton = document.querySelector('#favourite');
        
        // favouriteButton.addEventListener( 'click', ev => {

        //     console.log('favouriteButton clicked');
        //     const clickedCard = ev.target.dataset.id;

        //     favouritesArray.push()


        // })

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

    searchResultsContainer.replaceChildren(); //clear previous results

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

    searchResultsContainer.replaceChildren(); //clear previous results

    //currentPage - 1
    currentPage -= 1

    backButton.style.display = currentPage > 1 ? 'block' : 'none'
    // if (currentPage > 1){
    //     console.log(`should show`);

    //     backButton.style.display = "block";

    // } else if (currentPage <= 1) {

    //     console.log(`shouldn't show`);
    //     backButton.style.display = "none";

    // }
    loadAllCards(currentPage);
})

homeButton.addEventListener('click', ev=>{
    currentPage = 1;
    loadAllCards( currentPage );
});

//TODO: hide back button page 1
//test
//load all cards on first visit - need to sort out async/ loading
//click onto card for more details
//favourite to add to new array
//click on faves displays all stored items
//capitals vs lower case search