const auth = "563492ad6f9170000100000149a3e1fb8c7145f7b10fcb45411de2cd";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let searchValue;

// Event Listeners

searchInput.addEventListener("input", updateValue);
form.addEventListener("submit", searchPhotos);

// Functions

function clear() {
	gallery.innerHTML = "";
}

function updateValue(e) {
	searchValue = e.target.value;
}

function renderImages(photosArr) {
	photosArr.photos.forEach((photo) => {
		const photoUrl = photo.src.large;

		const imageElement = document.createElement("div");
		imageElement.innerHTML = `
      <img src=${photoUrl}></img>
      <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
      </div>  
    `;
		gallery.appendChild(imageElement);
	});
}

async function fetchPhotos(url) {
	const fetchData = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: auth,
		},
	});
	const data = await fetchData.json();
	return data;
}

async function curatedPhotos() {
	const data = await fetchPhotos("https://api.pexels.com/v1/curated");

	renderImages(data);
}

async function searchPhotos(e) {
	e.preventDefault();
	clear();
	const data = await fetchPhotos(
		`https://api.pexels.com/v1/search?query=${searchValue}&per_page=15`
	);

	renderImages(data);
}

curatedPhotos();
