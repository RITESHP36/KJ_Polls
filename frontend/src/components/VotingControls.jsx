import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { db } from "../firebase";
import { uid } from "uid";
import { set, ref, onValue, update } from "firebase/database";

const VotingControls = () => {
	const [artist, setArtist] = useState("");
	const [bufferTime, setBufferTime] = useState("");
	const [votingTime, setVotingTime] = useState("");
	const [bufferCountdown, setBufferCountdown] = useState(0);
	const [votingCountdown, setVotingCountdown] = useState(0);
	const [artists, setArtists] = useState([]);

	useEffect(() => {
		axios
			.get("https://kjpollsapi.onrender.com/artists")
			.then((response) => setArtists(response.data))
			.catch((error) => console.error("Error fetching artists:", error));
	}, []);

	useEffect(() => {
		// Timer to update the buffer countdown every second
		const bufferTimer = setInterval(() => {
			if (bufferCountdown) {
				setBufferCountdown((prevCountdown) => prevCountdown - 1);
			}
		}, 1000);

		// Clear the buffer timer when the component unmounts
		return () => clearInterval(bufferTimer);
	}, [bufferCountdown]);

	useEffect(() => {
		// Timer to update the voting countdown every second
		const votingTimer = setInterval(() => {
			if (votingCountdown) {
				setVotingCountdown((prevCountdown) => prevCountdown - 1);
			}
		}, 1000);

		// Clear the voting timer when the component unmounts
		return () => clearInterval(votingTimer);
	}, [votingCountdown]);

	useEffect(() => {
		if (votingCountdown === 0) {
			// Reset the voting status when the voting countdown ends
			localStorage.setItem("voted", "false");
			// update the voting status in Firebase
			update(ref(db, "votingControls"), {
				votingActive: false,
			});
		}
	}, [votingCountdown]);

	// Show a toast when the voting lines are active
	const [toastShown, setToastShown] = useState(false);
	useEffect(() => {
		if (!toastShown && bufferCountdown === 0 && votingCountdown > 0) {
			toast(`Voting Lines are active. You can now vote for ${artist}`);
			setToastShown(true);
		}
		if (votingCountdown === 0) {
			setToastShown(false);
		}
	}, [bufferCountdown, votingCountdown, artist, toastShown]);

	const handleStartVoting = () => {
		// Start the buffer countdown
		setBufferCountdown(parseInt(bufferTime));
		// firebase update
		set(ref(db, "votingControls"), {
			artist,
			bufferTime,
			votingTime,
			bufferCountdown: parseInt(bufferTime),
			votingCountdown: parseInt(votingTime),
			votingActive: true,
		});

		// Start the voting countdown after the buffer time
		setTimeout(() => {
			setVotingCountdown(parseInt(votingTime));
		}, parseInt(bufferTime) * 1000);
	};

	const [newBufferTime, setNewBufferTime] = useState("");
	const [newVotingTime, setNewVotingTime] = useState("");

	const handleUpdateBufferTime = () => {
		// Update the buffer time and reset the buffer countdown
		setBufferTime(newBufferTime);
		setBufferCountdown(parseInt(newBufferTime));

		// Update the buffer time in Firebase
		update(ref(db, "votingControls"), {
			bufferTime: newBufferTime,
			bufferCountdown: parseInt(newBufferTime),
		});
	};

	const handleUpdateVotingTime = () => {
		// Update the voting time and reset the voting countdown
		setVotingTime(newVotingTime);
		setVotingCountdown(parseInt(newVotingTime));

		// Update the voting time in Firebase
		update(ref(db, "votingControls"), {
			votingTime: newVotingTime,
			votingCountdown: parseInt(newVotingTime),
		});
	};

	const handleStopVoting = () => {
		// Stop the buffer and voting countdowns
		setBufferCountdown(0);
		setVotingCountdown(0);

		// Update the buffer and voting countdowns in Firebase
		update(ref(db, "votingControls"), {
			bufferTime: 0,
			votingTime: 0,
			artist: "",
			votingActive: false,
		});
	};

	const handleVote = (artistName) => {
		axios
			.post(
				`https://kjpollsapi.onrender.com/vote/${encodeURIComponent(artistName)}`
			)
			.then(() => {
				// Show a toast when the vote is successful
				toast.success("You have successfully voted!");
				// Store the voting status in the local storage
				localStorage.setItem("voted", "true");
				localStorage.setItem(`${artistName}`, "true");
			})
			.catch((error) => console.error("Error voting:", error));
	};

	return (
		<div className="bg-white shadow-xl rounded p-6 mx-40 mt-10 ">
			<h2 className="text-lg font-semibold mb-4">Voting Controls</h2>
			<div className="mb-4">
				<label
					htmlFor="artist"
					className="block text-sm font-medium text-gray-700"
				>
					Select Artist:
				</label>
				<select
					id="artist"
					name="artist"
					className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					value={artist}
					onChange={(e) => setArtist(e.target.value)}
				>
					{artists.map((artist) => (
						<option key={artist.name} value={artist.name}>
							{artist.name}
						</option>
					))}
				</select>
			</div>
			<div className="mb-4">
				<label
					htmlFor="bufferTime"
					className="block text-sm font-medium text-gray-700"
				>
					Buffer Time (in seconds):
				</label>
				<input
					type="number"
					id="bufferTime"
					name="bufferTime"
					className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					value={bufferTime}
					onChange={(e) => setBufferTime(e.target.value)}
				/>
			</div>
			<div className="mb-4">
				<label
					htmlFor="votingTime"
					className="block text-sm font-medium text-gray-700"
				>
					Voting Time (in seconds):
				</label>
				<input
					type="number"
					id="votingTime"
					name="votingTime"
					className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					value={votingTime}
					onChange={(e) => setVotingTime(e.target.value)}
				/>
			</div>
			<div className="flex justify-between">
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
					onClick={handleStartVoting}
					disabled={!artist} // Disable the button if no artist is selected
				>
					Start Voting
				</button>
				<div className="flex items-center mt-4">
					<input
						type="number"
						className="mr-2 px-2 py-1 border border-gray-300 rounded-md shadow-sm"
						value={newBufferTime}
						onChange={(e) => setNewBufferTime(e.target.value)}
					/>
					<button
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
						onClick={handleUpdateBufferTime}
					>
						Update Buffer Time
					</button>
					<input
						type="number"
						className="mr-2 px-2 py-1 border border-gray-300 rounded-md shadow-sm"
						value={newVotingTime}
						onChange={(e) => setNewVotingTime(e.target.value)}
					/>
					<button
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
						onClick={handleUpdateVotingTime}
					>
						Update Voting Time
					</button>
				</div>
				<button
					className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
					onClick={handleStopVoting}
				>
					Stop Voting
				</button>
			</div>
			<div className="mt-4 border border-gray-300 p-4 rounded">
				<div className="flex flex-col items-center justify-center h-96 bg-gray-100 text-gray-800">
					{bufferCountdown <= 0 && votingCountdown <= 0 && (
						<p className="text-xl">Voting Lines are not Active now</p>
					)}
					{bufferCountdown > 0 && (
						<div className="text-center">
							<p className="text-2xl mb-4">Voting Lines will be active soon</p>
							<p className="text-xl mb-2">Artist: {artist}</p>
							<p className="text-lg mb-2">Voting starts in:</p>
							<span className="countdown font-mono text-6xl mb-2">
								<span
									style={{
										"--value": bufferCountdown,
									}}
								></span>
							</span>
							<p className="text-lg">seconds</p>
						</div>
					)}
					{bufferCountdown <= 0 && votingCountdown > 0 && (
						<div className="text-center">
							<p className="text-2xl mb-4">Voting Lines are active</p>
							<p className="text-xl mb-2">Artist: {artist}</p>
							<p className="text-lg mb-2">Vote now</p>
							<button
								className={`px-4 py-2 rounded-md mb-4 ${
									localStorage.getItem("voted") === "true" ||
									localStorage.getItem(artist) === "true"
										? "bg-green-500 cursor-not-allowed"
										: "bg-blue-500 hover:bg-blue-600"
								} text-white`}
								onClick={() => handleVote(artist)} // Call handleVote when the button is clicked
								disabled={
									localStorage.getItem("voted") === "true" ||
									localStorage.getItem(artist) === "true"
								} // Disable the button if the user has already voted or the artist has been voted for
							>
								Vote
							</button>
							<p className="text-lg mb-2">Voting ends in:</p>
							<span className="countdown font-mono text-6xl mb-2">
								<span
									style={{
										"--value": votingCountdown,
									}}
								></span>
							</span>
							<p className="text-lg">seconds</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default VotingControls;
