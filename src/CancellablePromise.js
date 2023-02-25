export const createCancellablePromise = (func) => {
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
