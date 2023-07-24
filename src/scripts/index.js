import "../styles/index.scss";

const SHAPES_TO_ROTATE = [1, 2, 3, 4, 5, 7, 9, 11];
const ROTATE_INTERVAL = 100000;
const TIMEOUT_INTERVAL = 4000;

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelector(".images");
  window.setInterval(rotateRandomImg, ROTATE_INTERVAL);

  function rotateRandomImg() {
    var randomImg =
      SHAPES_TO_ROTATE[Math.floor(Math.random() * SHAPES_TO_ROTATE.length)];
    var selectedImg = images.querySelector("img:nth-child(" + randomImg + ")");
    selectedImg.classList.add("rotateAnim");
    setTimeout(() => {
      selectedImg.classList.remove("rotateAnim");
    }, TIMEOUT_INTERVAL);
  }
});
