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
    try {
        const col = collection(db, "Movies");

        const moviesArr = [];
        const querySnapshot = await getDocs(col);
        querySnapshot.forEach((doc) => {
            //Loopar igenom och plockar ut data med funktionen data(). Formaterar produkten till objektformen jag valt.
            const data = doc.data();
            const formatedMovies = {
                title: data.title,
                genre: data.genre,
                utgivningsår: data.utgivningsår,
            };
            moviesArr.push(formatedMovies);
        });

        console.log(moviesArr);
        createMovieCard(moviesArr);
    } catch (error) {
        console.log(`ERROR: ${error}`);
    }
}

getmovies();

function createMovieCard(formatedMovies) {
    for (let i = 0; i < formatedMovies.length; i++) {
        let title = formatedMovies[i].title;
        let genre = formatedMovies[i].genre;
        let year = formatedMovies[i].utgivningsår;
        console.log(formatedMovies);

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
        const removeMovieButton = document.createElement("button");
        removeMovieButton.classList.add("remove-btn");

        titleElem.innerHTML = title;
        genreElem.innerHTML = genre;
        yearElem.innerHTML = year;
        haveSeenbutton.innerHTML = "Markera som sedd";
        removeMovieButton.innerHTML = "Ta bort film";

        containerElem.append(movieCard);
        movieCard.append(titleElem);
        movieCard.append(genreElem);
        movieCard.append(yearElem);
        movieCard.append(haveSeenbutton);
        movieCard.append(removeMovieButton);
    }
    createMovieCard()
}


// function getInputValue {
//     const inputValueTitle = document.querySelector('#inputValueTitle').value;
//     const inputValueGenre = document.querySelector('#inputValueGenre').value;
//     const inputValueYear = document.querySelector('#inputValueYear').value;
// }


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
        createMovieCard()
    }
    addMovie()
    
    
});
