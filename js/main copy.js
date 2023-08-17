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

//Page starts with 100 cards loaded
loadAllCards();

//show 100 cards by default, total count from headers: 81967 i.e. about 820 pages

// let currentPage = 1; //for pagination //TODO: pagination

//async/await limits pageSize otherwise the loop continues to iterate and grab all cards not necessarily in order, to display before pageSize applied

//async //await

function loadAllCards(){
    //TODO change back to 820
    for (let i = 0; i <= 10; i++ ){
        // console.log(i);
    searchResultsContainer.replaceChildren(); // clear any previous results
    
    //TODO: redo the url
     axios.get( MAGIC_BASE_URL, {
        params: {
            page: i,
            pageSize: 15, //TODO: change to 100
        }
    })

    .then( res => {
        // console.log( 'loadAllCards', res.data );

        const cards = res.data.cards;
        // console.log( cards );

        //TODO: filter out 'undefined' imageUrl
        //loop through array and render 
        
        cards.forEach( card => {
            
            // console.log( card.name );
            // console.log( card.imageUrl );

            const newImageTag = document.createElement('img');

            newImageTag.src= `${card.imageUrl}`;
            newImageTag.alt = `${card.name}`;
            newImageTag.dataset.id = card.id;
           


            //Add seleted properties to searchResultsContainer
            searchResultsContainer.appendChild(newImageTag);


        })

    })

    .catch( err => {
        console.warn('Error loading search results:', err );
    });
}
};


//TODO: get list of all cards not just top 100. Change the way this works - https://api.magicthegathering.io/v1/cards?name={cardName}
//load search results
const loadSearchResults = ( searchText ) =>{

    searchResultsContainer.replaceChildren(); //clear any previous search results

    axios.get(MAGIC_BASE_URL)

    //look for cards that include the searchText in the name
    .then(res => {

        const cards = res.data.cards;

        //remove case sensitivity

        console.log( cards );

        //use es6 to find card names that contain searchText
        const filteredCards = cards.filter( card => card.name.toLowerCase().includes( searchText.toLowerCase() ) );
        
        console.log('filtered cards', filteredCards);

        //display the filtered results

        filteredCards.forEach( card => {

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

const cardDetails =  (id) => {
    searchResultsContainer.replaceChildren();

    axios.get( `${MAGIC_BASE_URL}/${id}` )

    .then( res=> {

        console.log('card details', res.data.card.imageUrl);
        const newImageTag = document.createElement('img');
        newImageTag.src= `${res.data.card.imageUrl}`
        
        const newDivTag = document.createElement('div');
        newDivTag.dataset.id = 'individualCard'
        newDivTag.innerHTML = `
        <p>Type: ${res.data.card.type}</p>
        <p>Rarity: ${res.data.card.rarity}</p>
        <p>${res.data.card.text}</p>
        `

        const backBar = document.createElement('div');
        backBar.innerHTML = `
        <nav><ul><li>Home</li><li>Back to results</li></ul></nav>
        `
        backBar.classList.add('backBar');


        searchResultsContainer.appendChild(backBar);
        searchResultsContainer.appendChild(newImageTag);
        searchResultsContainer.appendChild(newDivTag);
        

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
    console.log('card clicked', ev.target);

    const clickedCard = ev.target.dataset.id
    // console.log(clickedCard);
    cardDetails(clickedCard);

})

//test
//load all cards on first visit - need to sort out async/ loading
//click onto card for more details
//favourite to add to new array
//click on faves displays all stored items
//capitals vs lower case search



            //create different tags
            // const newDivTag = document.createElement('div');
            // const newH2Tag = document.createElement('h2')

                        // const newPTag = document.createElement('p');
            
            // newH2Tag.innerHTML = card.name;