import offlineSprite from './images/offline-sprite.png';
let _imageSprite = null;

export function getImageSprite() {
  return _imageSprite;
}

export function loadImageSprite() {
  return new Promise((resolve) => {
    const imageSprite = document.createElement('img');
    imageSprite.src = offlineSprite
    imageSprite.addEventListener('load', () => {
      _imageSprite = imageSprite;
      resolve();
    });
  });
}
