import React, { useState, useEffect } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

const AdminVotesPage = () => {
	const [votes, setVotes] = useState([]);
	const socket = socketIOClient("https://kjpollsapi.onrender.com");

	useEffect(() => {
		const updateVotes = (updatedArtist) => {
			setVotes((prevVotes) =>
				prevVotes.map((prevVote) =>
					prevVote.name === updatedArtist.name ? updatedArtist : prevVote
				)
			);
		};

		axios
			.get("https://kjpollsapi.onrender.com/admin/votes")
			.then((response) => setVotes(response.data))
			.catch((error) => console.error("Error fetching votes:", error));

		socket.on("voteUpdate", (artist) => {
			setVotes((prevVotes) =>
				prevVotes.map((prevVote) =>
					prevVote.name === artist.name
						? { ...artist, votes: artist.votes + 1 }
						: prevVote
				)
			);
		});

		socket.on("artistChange", (data) => {
			const { type, artist } = data;
			if (type === "add") {
				setVotes((prevVotes) => [...prevVotes, artist]);
			} else if (type === "update") {
				updateVotes(artist);
			} else if (type === "delete") {
				setVotes((prevVotes) =>
					prevVotes.filter((prevVote) => prevVote.name !== artist.name)
				);
			}
		});

		return () => {
			socket.disconnect();
		};
	}, [socket]);

	const increaseVotes = (artistName) => {
		axios
			.post(
				`https://kjpollsapi.onrender.com/admin/artists/${encodeURIComponent(
					artistName
				)}/increase-votes`
			)
			.catch((error) => console.error("Error increasing votes:", error));
	};

	const decreaseVotes = (artistName) => {
		axios
			.post(
				`https://kjpollsapi.onrender.com/admin/artists/${encodeURIComponent(
					artistName
				)}/decrease-votes`
			)
			.catch((error) => console.error("Error decreasing votes:", error));
	};

	return (
		<div className="bg-gray-100 flex items-center justify-center pt-10 pb-8 px-4 sm:px-0">
			<div className="bg-white shadow-md rounded px-4 sm:px-8 pt-6 pb-8 mb-4 flex flex-col">
				<h1 className="text-lg sm:text-2xl font-bold mb-4 text-center">
					View Votes
				</h1>
				<table className="min-w-full">
					<thead>
						<tr>
							<th className="px-2 sm:px-4 py-2">Name</th>
							<th className="px-2 sm:px-4 py-2">Votes</th>
						</tr>
					</thead>
					<tbody>
						{votes.map((vote, index) => (
							<tr key={index} className="border-b border-gray-200">
								<td className="px-2 sm:px-4 py-2">{vote.name}</td>
								<td className="px-2 sm:px-4 py-2 text-center">{vote.votes}</td>
								<td className="px-2 sm:px-4 py-2 text-center">
									<button
										onClick={() => increaseVotes(vote.name)}
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded mr-2"
									>
										+
									</button>
									<button
										onClick={() => decreaseVotes(vote.name)}
										className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded"
									>
										-
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminVotesPage;
