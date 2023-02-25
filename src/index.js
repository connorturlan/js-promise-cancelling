const promisesInFlight = {};

const fake_fetch = async (data, timeout = 200) => {
	const wait = new promise((resolve, reject) => {
		setTimeout(() => {
			// return reject("not cancelled");
			resolve();
		}, timeout * i);
	});

	await wait();

	return data;
};

const createPromise = (func) => {
	const wrapper = {};
	const signal = new Promise((resolve, reject) => {
		wrapper.cancel = () => {
			reject(new Error("Promise was cancelled"));
		};
	});

	wrapper.promise = new Promise((resolve, reject) => {
		func(resolve, reject);

		signal.catch((err) => {
			reject(err);
		});
	});

	return wrapper;
};

const loadProgram = async (stream) => {
	console.log("loading stream: ", stream);

	// cancel all pending promises.
	Object.keys(promisesInFlight)
		.filter((key) => key != stream)
		.forEach((inFlightStream) => {
			// delete promisesInFlight[inFlightStream];
			promisesInFlight[inFlightStream].forEach((promise) => {
				console.log(promise);
				promise.cancel();
				console.log(promise);
			});
		});

	// create all promises belonging to this stream.
	console.log("creating all");
	for (let i = 1; i <= 10; i++) {
		const newPromise = createPromise((resolve, reject) => {
			setTimeout(() => {
				// return reject("not cancelled");
				resolve(`hello from inside stream ${stream}:${i}`);
			}, 200 * i);
		});

		newPromise.then((data) => {
			console.log(data);
		});

		if (promisesInFlight[stream]) {
			promisesInFlight[stream].push(newPromise);
		} else {
			promisesInFlight[stream] = [newPromise];
		}
	}

	// await then output the promises returned.
	// await Promise.all(promisesInFlight[stream]);

	// for (promise of promisesInFlight[stream]) {
	// }
};

document.getElementById("load-alpha").addEventListener("click", (event) => {
	loadProgram("alpha");
});
document.getElementById("load-beta").addEventListener("click", (event) => {
	loadProgram("beta");
});
