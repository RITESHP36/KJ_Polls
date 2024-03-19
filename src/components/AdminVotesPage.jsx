import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, update,get } from "firebase/database";

const AdminVotesPage = () => {
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

	const increaseVotes = (artistName) => {
		const artistsRef = ref(db, "artists");
		get(artistsRef).then((snapshot) => {
			const artists = snapshot.val();
			const artistKey = Object.keys(artists).find(key => artists[key].name === artistName);
			if (artistKey) {
				const artistRef = ref(db, `artists/${artistKey}`);
				update(artistRef, { votes: artists[artistKey].votes + 1 });
			}
		});
	};

	const decreaseVotes = (artistName) => {
		const artistsRef = ref(db, "artists");
		get(artistsRef).then((snapshot) => {
			const artists = snapshot.val();
			const artistKey = Object.keys(artists).find(key => artists[key].name === artistName);
			if (artistKey && artists[artistKey].votes > 0) {
				const artistRef = ref(db, `artists/${artistKey}`);
				update(artistRef, { votes: artists[artistKey].votes - 1 });
			}
		});
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
						{artists.map((artist,index) => (
							<tr key={index} className="border-b border-gray-200">
								<td className="px-2 sm:px-4 py-2">{artist.name}</td>
								<td className="px-2 sm:px-4 py-2 text-center">{artist.votes}</td>
								<td className="px-2 sm:px-4 py-2 text-center">
									<button
										onClick={() => increaseVotes(artist.name)}
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded mr-2"
									>
										+
									</button>
									<button
										onClick={() => decreaseVotes(artist.name)}
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
