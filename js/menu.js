function collapseMenu(currentMenu){
  var i;

  content = document.getElementById(currentMenu);
  allContent = document.getElementsByClassName("menuTable");

  if (content.style.display === "none"){
    for (i = 0; i < allContent.length; i++)
      allContent[i].style.display = "none";

    content.style.display = "block";
  } else {
    content.style.display= "none";
  } 
}

function openOverlay(image_id, name_id, price_id) {
  var image, name, price;

  image = document.getElementById(image_id).innerText;
  name = document.getElementById(name_id).innerText;
  price = document.getElementById(price_id).innerText;
  
  document.getElementById("overlay_itemImage").innerHTML = image;
  document.getElementById("overlay_itemName").innerHTML = name;
  document.getElementById("overlay_itemPrice").innerHTML = price;
  document.getElementById("menuItem_overlay").style.height = "100%";
}

function closeOverlay() {
  document.getElementById("menuItem_overlay").style.height = "0%";
  document.getElementById("overlay_quantityBox").value = 1;
}

function minus() {
  var quantity;

  quantity = document.getElementById("overlay_quantityBox").value;
  quantity = parseInt(quantity) - 1;

  if (quantity < 1)
    quantity = 1;

  document.getElementById("overlay_quantityBox").value = quantity;
}

function plus() {
  var quantity;

  quantity = document.getElementById("overlay_quantityBox").value;
  quantity = parseInt(quantity) + 1;

  if (quantity > 10)
  quantity = 10;
  
  document.getElementById("overlay_quantityBox").value = quantity;
}