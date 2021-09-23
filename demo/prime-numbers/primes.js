const sieveOfEratosthenes = (limit) => {
  const sieve = [];
  const primes = [];
  let k;
  let l;

  sieve[1] = false;
  for (k = 2; k <= limit; k += 1) {
    sieve[k] = true;
  }

  for (k = 2; k * k <= limit; k += 1) {
    if (sieve[k] !== true) {
      continue;
    }
    for (l = k * k; l <= limit; l += k) {
      sieve[l] = false;
    }
  }

  sieve.forEach(function (value, key) {
    if (value) {
      this.push(key);
    }
  }, primes);

  return new Set(primes);
};

let startNumber = 1;

function generatePrimes() {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }

  const numDivs = 1000;
  const limit = startNumber + numDivs;
  const primes = sieveOfEratosthenes(limit);

  const div = document.createElement('div');
  div.className = 'parent';

  for (let i = startNumber; i < limit; i++) {
    const numberDiv = document.createElement('div');
    numberDiv.className = 'number';
    const numberText = document.createTextNode(i);
    if (primes.has(i)) {
      numberDiv.style.fontWeight = 'bold';
      numberDiv.style.color = '#0379c3';
    }
    numberDiv.appendChild(numberText);
    div.appendChild(numberDiv);
  }

  document.body.appendChild(div);
  startNumber += numDivs;
}

generatePrimes();
document.body.addEventListener('click', generatePrimes);
