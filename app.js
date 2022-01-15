const auth = "563492ad6f9170000100000149a3e1fb8c7145f7b10fcb45411de2cd";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const moreBtn = document.querySelector(".more");

let pageCount = 1;
let searchValue;

// Event Listeners

searchInput.addEventListener("input", updateValue);
form.addEventListener("submit", searchPhotos);
moreBtn.addEventListener("click", loadMoreItmes);

// Functions

function clear() {
	gallery.innerHTML = "";
}

function updateValue(e) {
	searchValue = e.target.value;
}

function nothingFound() {
	const divNothingFound = document.createElement("div");
	divNothingFound.innerHTML = /*html*/ `
		<p>Sorry, nothing was found. Please try another term.</p>	
	`;
	divNothingFound.classList.add("nothing-found");
	gallery.appendChild(divNothingFound);
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
	pageCount = 1;
	e.preventDefault();
	clear();
	const data = await axiosFetch(
		`https://api.pexels.com/v1/search?query=${searchValue}&per_page=15`
	);

	if (data.data.total_results === 0) {
		nothingFound();
		moreBtn.classList.add("hide-btn");
	} else {
		renderImages(data.data);
		moreBtn.classList.remove("hide-btn");
	}
}

// Using Axios

async function axiosFetch(url) {
	const data = await axios.get(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: auth,
		},
	});
	return data;
}

async function loadMoreItmes(count) {
	pageCount++;
	const data = await axiosFetch(
		`https://api.pexels.com/v1/search?query=${searchValue}&per_page=15&page=${pageCount}`
	);

	renderImages(data.data);
	console.log(data.data);
}
