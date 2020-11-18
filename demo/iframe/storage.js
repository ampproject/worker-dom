try {
  localStorage.setItem('marco', 'polo');
  console.log('localStorage is available at: ' + window.location);
} catch (e) {
  console.error(e);
}
try {
  sessionStorage.setItem('marco', 'polo');
  console.log('sessionStorage is available at: ' + window.location);
} catch (e) {
  console.error(e);
}

console.log('Can run code after the storage access occurs');
