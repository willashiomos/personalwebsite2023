import "../styles/index.scss";

const SHAPES_TO_ROTATE_DESKTOP = [[1, 2, 3, 4, 5, 7, 9, 11]];
const SHAPES_TO_ROTATE_MOBILE = [
  [1, 2, 3, 4, 5],
  [1, 3, 5, 6],
];
const ROTATE_INTERVAL = 10000;
const TIMEOUT_INTERVAL = 4000;
const INITIAL_TIMEOUT_INTERVAL = 2000;

document.addEventListener("DOMContentLoaded", () => {
  var images;
  var shapesToRotate;
  desktopOrMobile();

  // first animation run
  setTimeout(() => {
    rotateRandomImg();
  }, INITIAL_TIMEOUT_INTERVAL);
  // rest
  window.setInterval(rotateRandomImg, ROTATE_INTERVAL);

  window.addEventListener("resize", () => {
    desktopOrMobile();
  });

  function desktopOrMobile() {
    if (window.innerWidth < 1000) {
      images = document.querySelectorAll(".images--mobile");
      shapesToRotate = JSON.parse(JSON.stringify(SHAPES_TO_ROTATE_MOBILE));
    } else {
      images = document.querySelectorAll(".images--desktop");
      shapesToRotate = JSON.parse(JSON.stringify(SHAPES_TO_ROTATE_DESKTOP));
    }
  }

  function rotateRandomImg() {
    images.forEach((imageGroup, idx) => {
      var randomImg =
        shapesToRotate[idx][
          Math.floor(Math.random() * shapesToRotate[idx].length)
        ];
      var selectedImg = imageGroup.querySelector(
        "img:nth-child(" + randomImg + ")"
      );
      selectedImg.classList.add("rotateAnim");
      setTimeout(() => {
        selectedImg.classList.remove("rotateAnim");
      }, TIMEOUT_INTERVAL);
    });
  }
});
