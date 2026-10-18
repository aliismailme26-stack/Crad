let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

let mood = "create";
let tmp;

// حساب إجمالي السعر
function getTotal() {
  if (price.value !== "") {
    let result =
      (+price.value || 0) +
      (+taxes.value || 0) +
      (+ads.value || 0) -
      (+discount.value || 0);

    total.innerHTML = result;
    total.style.background = "#040";
  } else {
    total.innerHTML = "";
    total.style.background = "#a00d02";
  }
}

// جلب البيانات من localStorage
let datapro = localStorage.getItem("product")
  ? JSON.parse(localStorage.getItem("product"))
  : [];

// إضافة منتج جديد
submit.onclick = function () {
  let newpro = {
    title: title.value.trim().toLowerCase(),
    price: +price.value || 0,
    taxes: +taxes.value || 0,
    ads: +ads.value || 0,
    discount: +discount.value || 0,
    total: +total.innerHTML || 0,
    count: +count.value || 1,
    category: category.value.trim().toLowerCase(),
  };

  if (newpro.title && newpro.price && newpro.category && newpro.count <= 100) {
    if (mood === "create") {
      for (let i = 0; i < newpro.count; i++) {
        datapro.push({ ...newpro });
      }
    } else {
      datapro[tmp] = newpro;
      mood = "create";
      submit.innerHTML = "Create";
      count.style.display = "block";
    }

    clearData();
    localStorage.setItem("product", JSON.stringify(datapro));
    showData();
  }
};

// تفريغ الحقول بعد الإضافة
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
  total.style.background = "#a00d02";
}

// عرض البيانات في الجدول
function showData() {
  getTotal();
  let table = "";
  datapro.forEach((pro, i) => {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${pro.title}</td>
        <td>${pro.price}</td>
        <td>${pro.taxes}</td>
        <td>${pro.ads}</td>
        <td>${pro.discount}</td>
        <td>${pro.total}</td>
        <td>${pro.category}</td>
        <td><button onclick="updateData(${i})">Update</button></td>
        <td><button onclick="deleteData(${i})">Delete</button></td>
      </tr>`;
  });
  document.getElementById("tbody").innerHTML = table;

  let btnDelete = document.getElementById("deleteAll");
  btnDelete.innerHTML =
    datapro.length > 0
      ? `<button onclick="deleteAll()">Delete All (${datapro.length})</button>`
      : "";
}

// حذف منتج من القائمة
function deleteData(i) {
  datapro.splice(i, 1);
  localStorage.setItem("product", JSON.stringify(datapro));
  showData();
}

// حذف جميع المنتجات
function deleteAll() {
  localStorage.removeItem("product");
  datapro = [];
  showData();
}

// تحديث المنتج
function updateData(i) {
  let pro = datapro[i];
  title.value = pro.title;
  price.value = pro.price;
  taxes.value = pro.taxes;
  ads.value = pro.ads;
  discount.value = pro.discount;
  count.style.display = "none";
  category.value = pro.category;
  submit.innerHTML = "Update";
  getTotal();
  mood = "update";
  tmp = i;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// البحث
let searchMood = "title";
function getSearchMood(id) {
  let search = document.getElementById("search");
  searchMood = id === "searchTitle" ? "title" : "category";
  search.placeholder = "Search By " + searchMood;
  search.focus();
  search.value = "";
  showData();
}

function searchData(value) {
  let table = "";
  let searchValue = value.toLowerCase();
  datapro.forEach((pro, i) => {
    if (
      (searchMood === "title" && pro.title.includes(searchValue)) ||
      (searchMood === "category" && pro.category.includes(searchValue))
    ) {
      table += `
        <tr>
          <td>${i + 1}</td>
          <td>${pro.title}</td>
          <td>${pro.price}</td>
          <td>${pro.taxes}</td>
          <td>${pro.ads}</td>
          <td>${pro.discount}</td>
          <td>${pro.total}</td>
          <td>${pro.category}</td>
          <td><button onclick="updateData(${i})">Update</button></td>
          <td><button onclick="deleteData(${i})">Delete</button></td>
        </tr>`;
    }
  });
  document.getElementById("tbody").innerHTML = table;
}

// تحديث الجدول عند تحميل الصفحة
showData();