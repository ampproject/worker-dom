const ampImgExists = document.getElementsByClassName('amp-img')[0] !== undefined;
const imgExists = document.getElementsByTagName('img').length > 0;

document.body.appendChild(document.createTextNode(`AMP IMG: ${ampImgExists}, img: ${imgExists}`));
