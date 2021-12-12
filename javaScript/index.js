const moviesTemplate = (title, date, id) => {
  return `
      <div class="card" id=${id}>
      <span>0${id}</span>
      <h2>${title}</h2>
      <p>${date}</p>
      </div>
    `;
};

// close icon
let closeIcon = document.querySelector(".close-icon");
let popup = document.querySelector(".popup");

const handleCardWorking = async (e) => {
  document.querySelector("#loader-modal-wrapper").style.display = "flex";

  let Id = e.target.id;
  let Title = e.target.querySelector("h2");
  let PopUpTitle = document.querySelector(".popup h1");
  let Characters = [];

  popup.classList.add("active");

  PopUpTitle.textContent = Title.textContent;

  await fetch(`https://swapi.dev/api/films/${Id}`)
    .then((res) => res.json())
    .then((response) => {
      response["characters"].forEach((eachChar) => {
        fetch(eachChar)
          .then((jsonres) => jsonres.json())
          .then((response) => {
            Characters.push(response["name"]);
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => {
      console.log(err);
    });

  setTimeout(() => {
    let characterList = document.querySelector(".characters-list");
    characterList.innerHTML = "";
    Characters.sort();

    Characters.forEach((eachCharacter) => {
      let HTML = `<li>${eachCharacter}</li>`;

      characterList.insertAdjacentHTML("beforeend", HTML);
    });
    document.querySelector("#loader-modal-wrapper").style.display = "none";
  }, 2000);
};

const fetchProcess = (container) => {
  let topRatedContainer = document.querySelector(container);

  fetch(`https://swapi.dev/api/films`)
    .then((res) => res.json())
    .then((response) => {
      let Counter = 1;

      response["results"].forEach((eachResults) => {
        topRatedContainer.insertAdjacentHTML(
          "beforeend",
          moviesTemplate(
            eachResults["title"],
            eachResults["release_date"],
            Counter
          )
        );
        Counter++;
      });

      document.querySelectorAll(".cards-wrapper .card").forEach((eachCard) => {
        eachCard.addEventListener("click", handleCardWorking);
      });
      document.querySelector("#loader-modal-wrapper").style.display = "none";
    })
    .catch((err) => {
      console.log(err);
    });
};

// fetching data
const starWarMovies = () => {
  fetchProcess(".cards-wrapper");
};

starWarMovies();

window.addEventListener("load", (e) => {});

closeIcon.addEventListener("click", (e) => {
  popup.classList.remove("active");
});
