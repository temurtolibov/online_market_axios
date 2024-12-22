let elProductsList = document.querySelector(".products-list");
let elGetInfoBtn = document.querySelector(".get-info-btn");
let elModalWrapper = document.querySelector(".modal-wrapper");
let elModalInner = document.querySelector(".modal-inner");
let elInfoForm = document.querySelector(".info-form");

// Modalni yopish uchun hodisa
elModalWrapper.addEventListener("click", (e) => {
  if (e.target.id === "wrapper") {
    elModalWrapper.classList.add("scale-0");
  }
});

const TOKEN = "7617825210:AAF9XnPDap7kE6N8sDMLrO7dryWTWnYvruU";
const CHAT_ID = "-1002342978522";
const HTTPMessage = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
const HTTPPhoto = `https://api.telegram.org/bot${TOKEN}/sendPhoto`;

// Mahsulotlarni olish uchun API so'rovi
async function getProducts(API) {
  const promise = new Promise((resolve, reject) => {
    axios.get(API).then((res) => {
      resolve(res.data.products);
    });
  });
  return promise;
}

getProducts("https://dummyjson.com/products").then((result) => {
  result.forEach((item) => {
    let elItem = document.createElement("li");
    elItem.className = "w-[300px] p-2 rounded-md bg-slate-200";
    elItem.innerHTML = `
  <div class="p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300 ease-in-out">
    <img 
      class="mb-3 h-[300px] object-cover rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out"
      src="${item.images[0]}" 
      alt="Product img" 
      width="300" 
      height="300" 
    />
    <h2 class="text-gray-800 font-extrabold text-[24px] mb-3 line-clamp-1">${item.title}</h2>
    <p class="text-gray-500 line-clamp-3 mb-4">${item.description}</p>
    <div class="flex items-center justify-between mt-4">
      <strong class="text-[24px] text-green-600 font-bold">$${item.price}</strong>
      <button 
        onclick="handleSellBtnClick(${item.id})" 
        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full font-semibold shadow-md hover:from-teal-500 hover:to-blue-500 hover:scale-105 hover:shadow-lg transition-all duration-300 active:scale-95"
      >
        Sell
      </button>
    </div>
  </div>
`;

    elProductsList.appendChild(elItem);
  });
});

// Mahsulot ma'lumotlarini Telegram orqali yuborish
function handleSellBtnClick(id) {
  axios.get(`https://dummyjson.com/products/${id}`).then((res) => {
    let message = `<b class="text-center">Site Info</b> \n`;
    message += `<b>Title:</b> ${res.data.title} \n`;
    message += `<b>Description:</b> ${res.data.description} \n`;
    message += `<b>Price:</b> ${res.data.price}$ \n`;

    const data = {
      chat_id: CHAT_ID,
      parse_mode: "html",
      caption: message,
      photo: res.data.images[0],
    };

    axios.post(HTTPPhoto, data);
  });
}

// Modal oynani ochish
function handleGetInfoBtnClick() {
  elModalWrapper.classList.remove("scale-0");
}

// Forma orqali ma'lumotlarni Telegramga yuborish
elInfoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let message = "<b>Site Info</b> \n";
  message += `<b>Username:</b> ${e.target.username.value} \n`;
  message += `<b>Email:</b> ${e.target.email.value} \n`;
  message += `<b>Phone number:</b> ${e.target.phone_number.value} \n`;

  const data = {
    chat_id: CHAT_ID,
    parse_mode: "html",
    text: message,
  };

  axios.post(HTTPMessage, data).then((res) => {
    elModalWrapper.classList.add("scale-0");
  });
});
