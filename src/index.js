import { createCancellablePromise } from "./CancellablePromise.js";

const promisesInFlight = {};

//
const fake_fetch = async (data, timeout = 200) => {
	const wait = new Promise((resolve, reject) => {
		setTimeout(() => {
			// return reject("not cancelled");
			resolve();
		}, timeout);
	});

	await wait;

	return data;
};

const loadProgram = async (stream) => {
	// cancel all pending promises.
	console.log("cancelling all previous streams.");
	Object.keys(promisesInFlight)
		.filter((key) => key != stream)
		.forEach((inFlightStream) => {
			promisesInFlight[inFlightStream].forEach((promise) => {
				promise.cancel();
			});
		});

	// create all promises belonging to this stream.
	console.log("creating stream: ", stream);
	for (let i = 1; i <= 10; i++) {
		// create the new promise.
		const newPromise = createCancellablePromise(async (resolve, reject) => {
			const res = fake_fetch(
				`hello from inside stream ${stream}:${i}`,
				200 * i
			);
			await res;
			resolve(res);
		});

		// set the resolve condition.
		newPromise.promise.then((data) => {
			console.log(data);
		});

		// add the promise to the stream.
		if (promisesInFlight[stream]) {
			promisesInFlight[stream].push(newPromise);
		} else {
			promisesInFlight[stream] = [newPromise];
		}
	}
};

// bind the event listeners.
document.getElementById("load-alpha").addEventListener("click", (event) => {
	loadProgram("alpha");
});
document.getElementById("load-beta").addEventListener("click", (event) => {
	loadProgram("beta");
});
document.getElementById("load-charlie").addEventListener("click", (event) => {
	loadProgram("charlie");
});
