import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, update, get } from "firebase/database";

const HomePage = () => {
	const [artists, setArtists] = useState([]);

	useEffect(() => {
		const artistsRef = ref(db, "artists");
		const unsubscribe = onValue(artistsRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setArtists(Object.values(data));
			}
		});

		return () => unsubscribe();
	}, []);

	const handleVote = (artistName) => {
		const artistsRef = ref(db, "artists");
		get(artistsRef).then((snapshot) => {
			const artists = snapshot.val();
			const artistKey = Object.keys(artists).find(
				(key) => artists[key].name === artistName
			);
			if (artistKey) {
				const artistRef = ref(db, `artists/${artistKey}`);
				update(artistRef, { votes: artists[artistKey].votes + 1 });
			}
		});
	};

	return (
		<div className="container mx-auto py-5 px-4 sm:px-0 bg-gray-100">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{artists.map((artist) => (
					<div
						key={artist.name}
						className="p-4 border rounded-lg flex flex-col items-center shadow-md hover:shadow-lg"
						style={{ transition: "box-shadow 0.3s" }}
					>
						<h2 className="text-lg sm:text-xl font-semibold">{artist.name}</h2>
						<img
							src={artist.image}
							alt={artist.name}
							className="my-2 w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
						/>
						{/* <p>Votes: {artist.votes}</p> */}
						<button
							className="mt-2 px-2 py-1 sm:px-4 sm:py-2 bg-blue-500 text-sm sm:text-base text-white rounded-md hover:bg-blue-600"
							onClick={() => handleVote(artist.name)}
						>
							Vote
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default HomePage;
