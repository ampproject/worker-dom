try {
  localStorage.setItem('marco', 'polo');
  console.log('localStorage is available');
} catch (e) {
  console.error(e);
}
try {
  sessionStorage.setItem('marco', 'polo');
  console.log('sessionStorage is available');
} catch (e) {
  console.error(e);
}
