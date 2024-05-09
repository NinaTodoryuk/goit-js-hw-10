import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const delayInput = document.querySelector('input[name="delay"]');
  const stateInput = document.querySelector('input[name="state"]:checked');

  const delay = parseInt(delayInput.value, 10);

  delayInput.value = '';

  if (isNaN(delay) || delay <= 0) {
    iziToast.error({
      title: 'Error',
      message: 'Delay must be a positive number',
    });
    return;
  }

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (stateInput.value === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise.then(delay => {
    iziToast.success({
      title: 'Success',
      message: `✅ Fulfilled promise in ${delay}ms`,
    });
  }).catch(delay => {
    iziToast.error({
      title: 'Error',
      message: `❌ Rejected promise in ${delay}ms`,
    });
  });
});
