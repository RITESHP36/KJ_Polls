import React, { useState, useEffect } from "react";

import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

import toast from "react-hot-toast";
import axios from "axios";

const VotingCountdown = () => {
	const [bufferCountdown, setBufferCountdown] = useState(0);
	const [votingCountdown, setVotingCountdown] = useState(0);
	const [bufferTime, setBufferTime] = useState(0);
	const [votingTime, setVotingTime] = useState(0);
	const [artist, setArtist] = useState("NULL");
	const [votingActive, setVotingActive] = useState(false);

	const [firebaseBufferTime, setFirebaseBufferTime] = useState(0);
	const [firebaseVotingTime, setFirebaseVotingTime] = useState(0);
	const [firebaseArtist, setFirebaseArtist] = useState("");
	const [firebaseVotingActive, setFirebaseVotingActive] = useState(false);
	useEffect(() => {
		const votingControlsRef = ref(db, "votingControls");
		const unsubscribe = onValue(votingControlsRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				setFirebaseBufferTime(data.bufferTime);
				setFirebaseVotingTime(data.votingTime);
				setFirebaseArtist(data.artist);
				setFirebaseVotingActive(data.votingActive);
			}
		});

		// Clean up function
		return () => unsubscribe();
	}, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

	// starting the timer based on updation from firebase
	useEffect(() => {
		if (bufferTime == 0 && votingTime == 0) {
			setBufferTime(firebaseBufferTime);
			setVotingTime(firebaseVotingTime);
			setArtist(firebaseArtist);
			setVotingActive(firebaseVotingActive);
		} else {
			if (firebaseBufferTime != bufferTime) {
				setBufferTime(firebaseBufferTime);
			}
			if (firebaseVotingTime != votingTime) {
				setVotingTime(firebaseVotingTime);
			}
			if (firebaseArtist != artist) {
				setArtist(firebaseArtist);
			}
			if (firebaseVotingActive != votingActive) {
				setVotingActive(firebaseVotingActive);
			}
            if (firebaseBufferTime===0 && firebaseVotingTime===0){
                setBufferCountdown(0);
                setVotingCountdown(0);
                setArtist("NULL");
                setVotingActive(false);
            }
		}
	}, [
		firebaseBufferTime,
		firebaseVotingTime,
		firebaseArtist,
		firebaseVotingActive,
	]);

	useEffect(() => {
		if (votingActive) {
			setBufferCountdown(parseInt(bufferTime));
			setTimeout(() => {
				setVotingCountdown(parseInt(votingTime));
			}, parseInt(bufferTime) * 1000);
		}
	}, [bufferTime, votingTime, artist, votingActive]);

	// Voting Timer Logic Below
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

	return (
		<div>
			{/* <h2>Voting Countdown</h2>
			<p>Buffer Countdown: {bufferCountdown}</p>
			<p>Voting Countdown: {votingCountdown}</p>
			<p>Buffer Time: {bufferTime}</p>
			<p>Voting Time: {votingTime}</p>
			<p>Artist: {artist}</p>
			<p>Voting Active: {votingActive ? "Yes" : "No"}</p> */}
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

export default VotingCountdown;
