import { WatchedMovie } from "./WatchedMovie";

export function WatchedMovieList({ watched, onDeleteWatched }) {
  // Display the list of movies seen by user
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
