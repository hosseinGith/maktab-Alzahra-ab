async function main() {
  const videoCont = document.querySelector(".videoCont");
  const optionsSite = document.querySelectorAll(".options ul li");
  const sliderCont = document.querySelector(".sliderCont");
  const sliderCont2 = document.querySelector(".sliderCont2");
  const sliderCont3 = document.querySelector(".sliderCont3");
  const searchCont = document.querySelector(".searchCont");
  const optionsContainer = document.querySelector(".optionsContainer");
  const lastSectTypeShow = document.querySelectorAll(
    "#lastSectTypeShow li button"
  );
  let timeOutLastSec = null;
  // toISOString
  const {
    homePageSlider1,
    homePageSlider2,
    homePageSlider3,
    homePageLastFetch,
  } = await (await fetch("../../site.php?json=allRequestsData")).json();

  console.log(homePageSlider1);
  let swiperOptions = {
    direction: "horizontal",
    rtl: true,
    slidesPerView: 2,
    centeredSlides: false,
    spaceBetween: 50,
    loop: false,
    breakpoints: {
      1200: {
        slidesPerView: 7,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      500: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  };

  async function getData(api) {
    let data = await (await fetch(api)).json();
    return data;
  }
  function swiperTemplate() {
    // <div class="swiper-wrapper">
    //   <div class="swiper-slide">Slide 1</div>
    //   <div class="swiper-slide">Slide 2</div>
    //   <div class="swiper-slide">Slide 3</div>
    // </div>;
  }
  function createItems(data, container) {
    const div = document.createElement("div");
    const div_divImg = document.createElement("div");
    const div_divImg_img = document.createElement("img");
    const div_span = document.createElement("span");
    const swiper_slide = document.createElement("div");
    swiper_slide.classList.add("swiper-slide");

    div_divImg_img.alt = data.underImgText;
    div_divImg_img.loading = "lazy";
    div.classList.add("item");
    div_divImg.classList.add("imgCont");
    div_span.classList.add("text");
    div_span.textContent = data.underImgText;
    div.appendChild(div_divImg);
    div_divImg.appendChild(div_divImg_img);
    div.appendChild(div_span);
    swiper_slide.appendChild(div);
    container.appendChild(swiper_slide);
    div_divImg_img.src = data.imgSrc;
  }
  async function createElementSlider1() {
    const swiper_wrapper = document.createElement("div");
    swiper_wrapper.classList.add("swiper-wrapper");
    sliderCont.appendChild(swiper_wrapper);
    homePageSlider1.forEach((item) => {
      createItems(item, swiper_wrapper);
    });
    new Swiper(".sliderCont", { ...swiperOptions, slidesPerView: 3 });
    sliderCont.classList.add("swiper");
  }
  async function createElementSlider2() {
    const swiper_wrapper = document.createElement("div");
    swiper_wrapper.classList.add("swiper-wrapper");
    sliderCont2.appendChild(swiper_wrapper);
    homePageSlider2.forEach((item) => {
      createItems(item, swiper_wrapper);
    });
    new Swiper(".sliderCont2", swiperOptions);

    sliderCont2.classList.add("swiper");
  }
  async function mainPageImage() {
    homePageSlider3.forEach((item) => {
      const div = document.createElement("div");
      const div_divImg = document.createElement("div");
      const div_divImg_img = document.createElement("img");

      div_divImg_img.alt = "xxx";
      div_divImg_img.loading = "lazy";
      div.classList.add("item");
      div_divImg.classList.add("imgCont");
      div.appendChild(div_divImg);
      div_divImg.appendChild(div_divImg_img);
      sliderCont3.appendChild(div);
      div_divImg_img.src = item.imgSrc;
    });
  }
  function createFlageItems(property) {
    if (!homePageLastFetch.hasOwnProperty(property)) return;
    optionsContainer.innerHTML = "";
    homePageLastFetch[property].forEach((json) => {
      let date = json.timeOut;
      date = new Date().getTime() - new Date(date).getTime();
      let calculateDate = Math.round(date / (1000 * 3600 * 24));
      let type = "روز";
      let dateString = `${calculateDate} ${type} پیش`;
      if (calculateDate < 1) {
        type = "امروز";
        dateString = type;
      } else if (calculateDate === 1) {
        type = "دیروز";
        dateString = type;
      } else if (calculateDate > 1 && calculateDate < 30) {
        calculateDate = Math.round(calculateDate / 30);
        dateString = `${calculateDate} ${type} پیش`;
      } else if (calculateDate > 29 && calculateDate < 364) {
        type = "ماه";
        calculateDate = Math.round(calculateDate / 30);
        dateString = `${calculateDate} ${type} پیش`;
      } else if (calculateDate > 364) {
        type = "سال";
        calculateDate = Math.round(calculateDate / 365);
        dateString = `${calculateDate} ${type} پیش`;
      }
      const item = `
       <div class="item">
                    <a href="#" class="imgCont">
                      <img
                        loading="lazy"
                        src="${json.imgSrc}"
                        alt="xxx"
                      />
                    </a>
                    <div class="content">
                      <div class="aboutItem">
                        <div class="from">
                          <span>${json.from}</span>
                          <div class="date">
                            <span>${dateString}</span>
                          </div>
                        </div>
                        <a href="#">
                          <h2 class="title">${json.title}</h2>
                        </a>
                        <div class="text">
                          <p>
                          ${json.longText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
    `;
      optionsContainer.innerHTML += item;
    });
  }
  function complateCreateFlageItems(property) {
    if (timeOutLastSec) clearInterval(timeOutLastSec);
    timeOutLastSec = null;
    if (homePageLastFetch[property].length < 1) {
      optionsContainer.classList.add("heightZero");
      timeOutLastSec = setTimeout(() => {
        optionsContainer.classList.remove("heightZero");
        optionsContainer.innerHTML = "";
      }, 500);
    } else {
      optionsContainer.classList.add("heightZero");
      timeOutLastSec = setTimeout(() => {
        optionsContainer.classList.remove("heightZero");
        optionsContainer.classList.add("heightDefault");
        if (optionsContainer.children.length) {
          optionsContainer.children[0].addEventListener("animationend", () => {
            optionsContainer.classList.remove("heightDefault");
          });
        }
        createFlageItems(property);
      }, 1000);
    }
  }
  createElementSlider1();
  createElementSlider2();
  mainPageImage();
  complateCreateFlageItems("public");
  searchCont.addEventListener("submit", (e) => {
    e.preventDefault();
    let a = document.createElement("a");
    a.href = "./pages/searchResult/index.html";
    localStorage.setItem("search", searchCont.children[0].value);
    a.click();
  });
  optionsSite.forEach((item) => {
    item.addEventListener("click", () => {
      optionsSite.forEach((ite) => {
        ite.classList.remove("active");
      });
      item.classList.add("active");
    });
  });
  $("#lastSectTypeShow li button").on("click", function () {
    complateCreateFlageItems(this.value);
  });
}
document.addEventListener("DOMContentLoaded", main);
