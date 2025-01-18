import { useState, useEffect } from "react";
import { Loader } from "../App";
import StarRating from "./StarRating";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});               // Movie details    
  const [isLoading, setIsLoading] = useState(false);    // Loading msg
  const [userRating, setUserRating] = useState("");     // rating given by user

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId); // movie id === selectedId
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie; // destructuring data from api

  function handleAdd() {          // Adds new movie{} to watched []
    const newWatchedMovie = {
      imdbID: selectedId,
      userRating,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
    };
    // console.log(newWatchedMovie);
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(        // fetches movie details 
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=eb2a15fc&i=${selectedId}`
        );
        const data = await res.json();
        // console.log(data);
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );  
  useEffect(      // Escape from movie detail page when esc is pressed 
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
          console.log(e);
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );
  useEffect(        // Sets the title of the browser's tab
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  // console.log(title, year);
  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>

            <section>
              <div className="rating">
                {!isWatched ? (
                  <>
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                      <button className="btn-add" onClick={handleAdd}>
                        + Add to List
                      </button>
                    )}
                  </>
                  ) : (
                    <p> You have rated this movie {watchedUserRating} ⭐</p>
                )}
              </div>
              
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
