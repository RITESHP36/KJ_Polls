import React, { useEffect, useState } from "react";

const FormPage = () => {
	const [index, setIndex] = useState(0);
	const phrases = [
		"Kanlinga Jyoti - Our Community",
		"Pratibha Sangram",
		"Vote Now (Every vote counts)",
	];
	const [color, setColor] = useState("");

	useEffect(() => {
		const colorInterval = setInterval(() => {
			setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
		}, 500); // Change color every 500ms

		return () => clearInterval(colorInterval);
	}, []);

	useEffect(() => {
		const phraseInterval = setInterval(() => {
			setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
		}, 2000); // Change the phrase every 20 seconds

		return () => clearInterval(phraseInterval);
	}, []);

	useEffect(() => {
		for (let i = 0; i < 100; i++) {
			const star = document.createElement("div");
			star.className = "star";
			star.style.top = `${Math.random() * window.innerHeight}px`;
			star.style.left = `${Math.random() * window.innerWidth}px`;
			document.body.appendChild(star);
		}

		return () => {
			document.querySelectorAll(".star").forEach((star) => star.remove());
		};
	}, []);

	return (
		<div className="bg-black">
			<div className="flex flex-col justify-center items-center h-screen text-white">
				<div className="text-7xl font-bold mb-20 text-center">
					WELCOME TO PRATIBHA SANGRAM
				</div>

				{/* Text animated */}
				{/* <div className="text-reveal-container w-full text-center">
                    <div className="text-reveal w-full">
                        <span className="text-6xl font-bold mb-8 animate-bounce" style={{ color: color }}>
                            {phrases[index]}
                        </span>
                    </div>
                </div> */}

				<div className="flex justify-center px-40">
					<p className="text-center text-4xl font-semibold">
						Click the button below to register your vote for the participant.
					</p>
				</div>

				{/*  Buttons to navigate through different pages */}
				<div className="pt-12">
					<button className="bg-blue-500 hover:bg-blue-700 text-white text-2xl font-bold py-2 px-4 rounded">
						Vote Now
					</button>
				</div>
			</div>
		</div>
	);
};

export default FormPage;
