import { db } from "./firebase-config.js";
import {
    addDoc,
    collection,
    getDocs,
    where,
    query,
    deleteDoc,
    doc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const saveMovieButton = document.querySelector("#save-movie-btn");

async function getmovies() {
    const moviesArr = [];
    try {
        const col = collection(db, "Movies");
        const querySnapshot = await getDocs(col);
        querySnapshot.forEach((doc) => {
            //Loopar igenom och plockar ut data med funktionen data(). Formaterar produkten till objektformen jag valt.
            const data = doc.data();
            const formatedMovies = {
                title: data.title,
                genre: data.genre,
                utgivningsår: data.utgivningsår,
                id: doc.id,
                watched: data.watched
        
            };
            moviesArr.push(formatedMovies);
        });
        
    } catch (error) {
        console.log(`ERROR: ${error}`);
       
    }
    return(moviesArr);
    
}

let movies = await getmovies();
createMovieCard(movies)


//loopar igenom formatatedMovies och skapar upp "kort" där elementen får classer/id och läggs i varandra. 
function createMovieCard(formatedMovies) {
    console.log(formatedMovies);
    for (let i = 0; i < formatedMovies.length; i++) {
        let title = formatedMovies[i].title;
        let genre = formatedMovies[i].genre;
        let year = formatedMovies[i].utgivningsår;
        let id = formatedMovies[i].id;
        let watched = formatedMovies[i].watched;
        console.log(watched)


        const containerElem = document.querySelector("#show-info");
        const movieCard = document.createElement("article");
        movieCard.classList.add("card");
        const titleElem = document.createElement("h3");
        titleElem.classList.add("title");
        const genreElem = document.createElement("p");
        genreElem.classList.add("genre");
        const yearElem = document.createElement("p");
        yearElem.classList.add("year");
        const watchedButton = document.createElement("button");
        watchedButton.classList.add("watched-btn");
        const deleteMovieButton = document.createElement("button");
        deleteMovieButton.classList.add("delete-btn");

        function updateInnerHTML() {
            titleElem.innerHTML = title;
            genreElem.innerHTML = genre;
            yearElem.innerHTML = year;
            watchedButton.innerHTML = watched ? 'Den här har jag sett' : "Markera som sedd"; 
            deleteMovieButton.innerHTML = "Ta bort film";
            watchedButton.style.backgroundColor = watched ? '#9EE493' : 'white'
        }
        updateInnerHTML()

        containerElem.append(movieCard);
        movieCard.append(titleElem);
        movieCard.append(genreElem);
        movieCard.append(yearElem);
        movieCard.append(watchedButton);
        movieCard.append(deleteMovieButton);

        deleteMovieButton.addEventListener("click", async () => {
            const movieId = id;
            deleteMovies(movieId)
            movieCard.remove()
        })

        watchedButton.addEventListener('click', async () => {
            watched = !watched;
            await updateWatched(watched, id)
            updateInnerHTML()
        })
    }
}

//funktionen ändrar/uppdaterar booleanen till false/true på det id knappen gäller. Funktionen startas i knappeventet ovan.
async function updateWatched(newWatched, id) {
    try {
        await updateDoc(doc(db, 'Movies', id), {
            watched: newWatched
        })
        console.log(newWatched, id)
    } catch (error) {
        console.log(`ERROR: ${error}`);
    }
}

//skapar upp ett klickevent till min knapp som sen sparar inputvärderna till databasen 
saveMovieButton.addEventListener("click", async () => {

    const inputValueTitle = document.querySelector('#inputValueTitle').value;
    const inputValueGenre = document.querySelector('#inputValueGenre').value;
    const inputValueYear = document.querySelector('#inputValueYear').value;

    const foundTitle = await checkIfTitleExist(inputValueTitle);
    console.log('foundtitle', foundTitle)
    if (foundTitle) {
     document.getElementById('error-text').innerHTML = 'Titeln finns redan'
     document.getElementById('inputValueTitle').style.border = '2px solid red'
    } else {
        await addMovie()
        location.reload()
    }

//lägger till film i objectform till min collection 'Movies'.
    async function addMovie() {
        try {
            await addDoc(collection(db, "Movies"), {
                title: inputValueTitle,
                genre: inputValueGenre, 
                utgivningsår: inputValueYear,
                watched: false
            });
        } catch (error) {
            console.log(`ERROR: ${error}`);

        }
    }
});

//tar bort filmer från min databas
async function deleteMovies(id) {
    try {
        await deleteDoc(doc(db, 'Movies', id));
    } catch (error) {
        console.log(`ERROR: ${error}`);
    }
}

//kollar ifall titeln jag vill lägga till redan finns i databasen eller ej.
async function checkIfTitleExist(movieTitle) {

    const movieTitleQuery = query(collection(db, 'Movies'), where('title', '==', movieTitle));
    const existMovieTitle = await getDocs(movieTitleQuery);
    
    let foundTitle = false
    existMovieTitle.forEach(() => {
        foundTitle = true;
    });

    return foundTitle;
}



