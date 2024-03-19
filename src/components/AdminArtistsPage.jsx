import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, set, update, onValue } from "firebase/database";

const AdminArtistsPage = () => {
	const [artists, setArtists] = useState([]);
	const [newArtistName, setNewArtistName] = useState("");
	const [newArtistImage, setNewArtistImage] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [editArtistId, setEditArtistId] = useState(null);

	useEffect(() => {
		const artistsRef = ref(db, "artists");
		const unsubscribe = onValue(artistsRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setArtists(Object.values(data));
			}
		});

		// Clean up function
		return () => unsubscribe();
	}, []);

	const handleAddArtist = () => {
		const newArtistRef = push(ref(db, "artists"));
		set(newArtistRef, {
			name: newArtistName,
			image: newArtistImage,
			votes: 0,
		}).then(() => {
			setArtists([...artists, { id: newArtistRef.key, name: newArtistName, image: newArtistImage, votes: 0 }]);
			setNewArtistName("");
			setNewArtistImage("");
		}).catch((error) => console.error("Error adding artist:", error));
	};

	const handleDeleteArtist = (id) => {
		update(ref(db, `artists/${id}`), null).then(() => {
			const updatedArtists = artists.filter((artist) => artist.id !== id);
			setArtists(updatedArtists);
		}).catch((error) => console.error("Error deleting artist:", error));
	};

	const handleEditArtist = (id, name, image) => {
		setIsEditing(true);
		setEditArtistId(id);
		setNewArtistName(name);
		setNewArtistImage(image);
	};

	const handleUpdateArtist = () => {
		update(ref(db, `artists/${editArtistId}`), {
			name: newArtistName,
			image: newArtistImage,
		}).then(() => {
			const updatedArtists = artists.map((artist) => {
				if (artist.id === editArtistId) {
					return { ...artist, name: newArtistName, image: newArtistImage };
				}
				return artist;
			});
			setArtists(updatedArtists);
			setIsEditing(false);
			setEditArtistId(null);
			setNewArtistName("");
			setNewArtistImage("");
		}).catch((error) => console.error("Error updating artist:", error));
	};

	return (
		<div className="bg-gray-100 pt-10 flex items-center justify-center">
			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 flex flex-col">
				<h1 className="text-2xl font-bold mb-4 text-center">Manage Artists</h1>
				<div className="mb-4">
					<input
						type="text"
						placeholder="Artist Name"
						className="mr-2 px-2 py-1 border border-gray-300 rounded-md shadow-sm"
						value={newArtistName}
						onChange={(e) => setNewArtistName(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Artist Image URL"
						className="mr-2 px-2 py-1 border border-gray-300 rounded-md shadow-sm"
						value={newArtistImage}
						onChange={(e) => setNewArtistImage(e.target.value)}
					/>
					{isEditing ? (
						<button
							className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md"
							onClick={handleUpdateArtist}
						>
							Update Artist
						</button>
					) : (
						<button
							className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md"
							onClick={handleAddArtist}
						>
							Add Artist
						</button>
					)}
				</div>
				<table className="min-w-full divide-y divide-gray-200">
					<tbody className="bg-white divide-y divide-gray-200">
						{artists.map((artist,index) => (
							<tr key={index}>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										{artist.image && (
											<img
												src={artist.image}
												alt={artist.name}
												className="w-10 h-10 mr-2 rounded-lg object-cover"
											/>
										)}
										<div className="text-sm font-medium text-gray-900">
											{artist.name}
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button
										className="text-blue-600 hover:text-blue-900 mr-2"
										onClick={() =>
											handleEditArtist(artist.id, artist.name, artist.image)
										}
									>
										Edit
									</button>
									<button
										className="text-red-600 hover:text-red-900"
										onClick={() => handleDeleteArtist(artist.id)}
									>
										Delete
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

export default AdminArtistsPage;

