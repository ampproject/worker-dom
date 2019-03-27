/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const sieveOfEratosthenes = limit => {
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

  sieve.forEach(function(value, key) {
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
