"use strict";
// function getAuthorizationHeader() {
//   //  填入自己 ID、KEY 開始
//   let AppID = "2af5643ac6c948c4b206225d87f27506";
//   let AppKey = "5ewryF_mUSxIGukfP-b5CyCnE-o";
//   //  填入自己 ID、KEY 結束
//   let GMTString = new Date().toGMTString();
//   let ShaObj = new jsSHA("SHA-1", "TEXT");
//   ShaObj.setHMACKey(AppKey, "TEXT");
//   ShaObj.update("x-date: " + GMTString);
//   let HMAC = ShaObj.getHMAC("B64");
//   let Authorization =
//     'hmac username="' +
//     AppID +
//     '", algorithm="hmac-sha1", headers="x-date", signature="' +
//     HMAC +
//     '"';
//   return { Authorization: Authorization, "X-Date": GMTString };
// }

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
  console.log(page, count);
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
    <svg
      class="search-contain__icon"
      width="11"
      height="14"
      viewBox="0 0 11 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.5 13.4444C5.5 13.4444 11 9.77778 11 5.5C11 4.04131 10.4205 2.64236 9.38909 1.61091C8.35764 0.579463 6.95869 0 5.5 0C4.04131 0 2.64236 0.579463 1.61091 1.61091C0.579463 2.64236 0 4.04131 0 5.5C0 9.77778 5.5 13.4444 5.5 13.4444ZM7.33388 5.49991C7.33388 6.51243 6.51307 7.33324 5.50055 7.33324C4.48803 7.33324 3.66721 6.51243 3.66721 5.49991C3.66721 4.48739 4.48803 3.66658 5.50055 3.66658C6.51307 3.66658 7.33388 4.48739 7.33388 5.49991Z"
        fill="#FF1D6C"
      /></svg
    >${contextTitle}
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

let titleSvg1 = `<svg
width="20"
height="17"
viewBox="0 0 20 17"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path d="M10 0L0 16.1905H20L10 0Z" fill="#FF1D6C" />
</svg>`;

let titleSvg2 = `<svg
width="20"
height="20"
viewBox="0 0 20 20"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<rect
  width="20"
  height="20"
  transform="matrix(-1 0 0 1 20 0)"
  fill="#FFB72C"
/></svg
>`;
