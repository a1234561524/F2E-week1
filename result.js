"use strict";

let contain,
  count = 0,
  page = 1,
  totalPage,
  totalCount;

let box = document.querySelector(".search-contain");
let forward = document.querySelector(".control-item__btn--forward");
let backward = document.querySelector(".control-item__btn--backward");
let searchBtn2 = document.querySelector(".search__btn-2");
let searchCity = document.querySelector(".search__city");
let searchType = document.querySelector(".search__type");
let searchResult = document.querySelector(".search-result");

let show = function (page) {
  //每次顯示20筆
  // $(".search-contain").empty();
  box.innerHTML = "";
  let currentCount = page * 20 < totalCount ? page * 20 : totalCount;
  for (let i = count; i < currentCount; i++) {
    let contextTitle = contain[i].Address;
    if (contextTitle !== undefined) {
      if (contextTitle.length > 12) {
        contextTitle = contextTitle.substring(0, 12) + "...";
      }
    } else {
      contextTitle = contain[i].City;
    }
    let html = `<li class="search-contain__item">
    <img src=${
      contain[i].Picture.PictureUrl1 ?? "img/nofound.png"
    } alt="" class="search-contain__img" />
    <h4 class="search-contain__theme">${
      contain[i].Name
    }</h4><div class="search-contain__location">
      <img src="img/icon/location-3.svg" alt="" class="search-contain__icon" />
     ${contextTitle}
  </div>
    </li>`;
    box.insertAdjacentHTML("beforeend", html);
  }

  document.querySelector(".control-item__page").textContent =
    page + " / " + totalPage;
  count = currentCount;
};

let showTitle = function (type) {
  let title;
  let svg;
  if (type === "ScenicSpot") {
    title = "熱門景點";
    svg = titleSvg1;
  } else if (type === "Restaurant") {
    title = "熱門美食";
    svg = titleSvg2;
  } else {
    title = "熱門旅館";
    svg = titleSvg2;
  }
  document.querySelector(".search-result__title").innerHTML = svg + title;
};

let search = function (type, city) {
  count = 0;
  page = 1;
  axios
    .get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/${type}${city}?$format=JSON`
      // {
      //   headers: getAuthorizationHeader(),
      // }
    )
    .then(function (response) {
      contain = response.data;
      totalCount = contain.length;
      totalPage = Math.ceil(totalCount / 20);
      showTitle(type);
      show(page);
      searchResult.style.display = "grid";
      document.querySelector(".init-page").style.display = "none";
    })
    .catch(function (error) {
      console.log(error);
    });
};

searchBtn2.addEventListener("click", function () {
  if (searchType.value === "") {
    alert("請選擇類別");
  } else {
    search(searchType.value, searchCity.value);
  }
});

forward.addEventListener("click", function () {
  if (page > 1) {
    page--;
    count -= 40;
    show(page);
  }
});

backward.addEventListener("click", function () {
  if (page < totalPage) {
    page++;
    show(page);
  }
});

let titleSvg1 = `<img src="img/icon/city-icon.svg" alt="" />`;

let titleSvg2 = `<img src="img/icon/food-icon.svg" alt="" />`;
