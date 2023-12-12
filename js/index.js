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
                id: doc.id
            };
            moviesArr.push(formatedMovies);
        });
        
    } catch (error) {
        console.log(`ERROR: ${error}`);
       
    }
    return(moviesArr);
    
    
}

const movies = await getmovies();
createMovieCard(movies)


//loopar igenom formatatedMovies och skapar upp "kort" där elementen får classer/id och läggs i varandra. 
function createMovieCard(formatedMovies) {
    console.log(formatedMovies);
    for (let i = 0; i < formatedMovies.length; i++) {
        let title = formatedMovies[i].title;
        let genre = formatedMovies[i].genre;
        let year = formatedMovies[i].utgivningsår;
        let id = formatedMovies[i].id;
        console.log(id)

        const containerElem = document.querySelector("#show-info");
        const movieCard = document.createElement("article");
        movieCard.classList.add("card");
        const titleElem = document.createElement("h3");
        titleElem.classList.add("title");
        const genreElem = document.createElement("p");
        genreElem.classList.add("genre");
        const yearElem = document.createElement("p");
        yearElem.classList.add("year");
        const haveSeenbutton = document.createElement("button");
        haveSeenbutton.classList.add("have-seen-btn");
        const deleteMovieButton = document.createElement("button");
        deleteMovieButton.classList.add("delete-btn");

        titleElem.innerHTML = title;
        genreElem.innerHTML = genre;
        yearElem.innerHTML = year;
        haveSeenbutton.innerHTML = "Markera som sedd";
        deleteMovieButton.innerHTML = "Ta bort film";

        containerElem.append(movieCard);
        movieCard.append(titleElem);
        movieCard.append(genreElem);
        movieCard.append(yearElem);
        movieCard.append(haveSeenbutton);
        movieCard.append(deleteMovieButton);

        deleteMovieButton.addEventListener("click", async () => {
            console.log("det klickar");
            const movieId = id;
            console.log(movieId)
            deleteMovies(movieId)
            console.log(id)
            movieCard.remove()
            
        })
    }
}

//skapar upp ett klickevent till min knapp som sen sparar inputvärderna till databasen 
saveMovieButton.addEventListener("click", async () => {
    console.log("det klickar");

    const inputValueTitle = document.querySelector('#inputValueTitle').value;
    const inputValueGenre = document.querySelector('#inputValueGenre').value;
    const inputValueYear = document.querySelector('#inputValueYear').value;

    async function addMovie() {
        try {
            await addDoc(collection(db, "Movies"), {
                title: inputValueTitle,
                genre: inputValueGenre, 
                utgivningsår: inputValueYear,
            });
        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
        
    }
    addMovie()
    createMovieCard(movies)
});


async function deleteMovies(id) {
    try {
        await deleteDoc(doc(db, 'Movies', id));
    } catch (error) {
        console.log(`ERROR: ${error}`);
    }
}