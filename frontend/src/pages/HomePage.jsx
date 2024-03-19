import React, { useState, useEffect } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

const HomePage = () => {
	const [artists, setArtists] = useState([]);
	const socket = socketIOClient("https://kjpollsapi.onrender.com");

	useEffect(() => {
		axios
			.get("https://kjpollsapi.onrender.com/artists")
			.then((response) => setArtists(response.data))
			.catch((error) => console.error("Error fetching artists:", error));

		socket.on("voteUpdate", (artistName) => {
			setArtists((prevArtists) =>
				prevArtists.map((artist) =>
					artist.name === artistName
						? { ...artist, votes: artist.votes + 1 }
						: artist
				)
			);
		});

		socket.on("artistChange", (data) => {
			const { type, artist } = data;
			if (type === "add") {
				setArtists((prevArtists) => [...prevArtists, artist]);
			} else if (type === "update") {
				setArtists((prevArtists) =>
					prevArtists.map((a) => (a._id === artist._id ? artist : a))
				);
			} else if (type === "delete") {
				setArtists((prevArtists) =>
					prevArtists.filter((a) => a._id !== artist._id)
				);
			}
		});

		return () => {
			socket.disconnect();
		};
	}, [socket]);

	const handleVote = (artistName) => {
		axios
			.post(
				`https://kjpollsapi.onrender.com/vote/${encodeURIComponent(artistName)}`
			)
			.catch((error) => console.error("Error voting:", error));
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
