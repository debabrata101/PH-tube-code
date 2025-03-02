console.log("video script added");

function getTimeString(time) {
  const hour = parseInt(time / 3600);
  let second = time % 3600;
  const minute = parseInt(second / 60);
  second = second % 60;
  return `${hour}hour ${minute}minute ${second} second ago`;
}

const removeActiveClass=()=>{
  const buttons = document.getElementsByClassName("categories-btn");
  console.log(buttons)
  for(let btn of buttons){
    btn.classList.remove("active")
  }
}

const loadCategories = () => {
  console.log("load categories");
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};
const loadVideos = (searchText) => {
  console.log("load videos");
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};
const loadId=(id)=>{
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const activeBtn = document.getElementById(`btn-${id}`)
      activeBtn.classList.add("active")
      displayVideos(data.category)})
    .catch((error) => console.log(error));
}

const loadDetails=async(videoId)=>{
 const url =`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
 const res = await fetch(url);
 const data = await res.json()
 displayDetails(data.video)
}

const displayDetails =(video)=>{
  console.log(video)
  const detailsContainer = document.getElementById("modal-content")

  detailsContainer.innerHTML=`
  <img src=${video.thumbnail}/>
  <p class="font-bold">${video.description}</p>
  `
  document.getElementById("showModalData").click()

}

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML="";
  if(videos.length==0){
    videoContainer.classList.remove("grid")
    videoContainer.innerHTML=`
    <div class="min-h-[300px] w-full  flex flex-col gap-5 justify-center items-center">
    <img src="assets/Icon.png"/>
    <h2 class="text-center text-xl font-bold">No Content Here in this category</h2>
    </div>
    `;
    return;
  }
  else{
    videoContainer.classList.add("grid")
  }
  videos.forEach((video) => {
    console.log(video);
    const card = document.createElement("div");
    card.classList = "card card-compact";
    card.innerHTML = `
            <figure class="h-[200px] relative">
    <img
      src=${video.thumbnail}
      class="h-full w-full object-cover"
      alt="Shoes" />
      ${
        video.others.posted_date?.length == 0
          ? ""
          : `<span class="absolute text-xs right-2 bottom-2 bg-gray-500 text-white rounded p-1">${getTimeString(
              video.others.posted_date
            )}</span>`
      }
  </figure>
  <div class="px-0 py-2 flex gap-2">
    <div>
    <img class=" w-10 h-10   rounded-full object-cover " src=${
      video.authors[0].profile_picture
    }/>
    </div>
    <div>
    <h2 class="font-bold">${video.title}</h2>
    <div class="flex item-center gap-2">
    <p class="text-gray-400">${video.authors[0].profile_name}</p>
    ${
      video.authors[0].verified === true
        ? '<img class="w-5 h-5  rounded-full"  src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png"/>'
        : ""
    }
    </div>
    <p>
    <button onclick="loadDetails('${video.video_id}')" class="btn-sort p-1 rounded btn-small ">details</button>
    </p>
    </div>
  </div>`;
    videoContainer.append(card);
  });
};

const displayCategories = (data) => {
  const categoryContainer = document.getElementById("categories");
  data.forEach((item) => {
    const buttonContainer = document.createElement("div");

    buttonContainer.innerHTML= `
    <button id="btn-${item.category_id}"  onClick="loadId(${item.category_id})" class= "btn categories-btn p-4">
    ${item.category}</button>
    `;

    categoryContainer.append(buttonContainer);
  });
};

document.getElementById("search-input").addEventListener("keyup",(e)=>{
loadVideos(e.target.value)
})

loadVideos();
loadCategories();
