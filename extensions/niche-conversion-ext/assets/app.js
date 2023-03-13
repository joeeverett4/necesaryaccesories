window.onload = async function () {

   

  
   function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // adding onclick event to add product to cart
  const buttons = document.querySelectorAll(".outfoss-add-to-cart")
   
  buttons.forEach(function (button, index) {
  
      //colors
       button.addEventListener("click", function () {
           console.log("button is clicking")
        let show = button.getAttribute("open");
        /*
        if (show == "false") {
          let toast = button.nextElementSibling;
          
          if (toast.style.display === "none") {
            toast.style.display = "block";
            // button.click();
            button.innerHTML = `<svg  aria-hidden="true" focusable="false" role="presentation" width="12" height="13" class="icon icon-close-small" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.48627 9.32917L2.82849 3.67098" stroke="#333030" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.88539 9.38504L8.42932 3.61524" stroke="#333030" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
    
         `;
  
            return;
          } else {
            toast.style.display = "none";
            button.innerHTML = "Add to Cart";
            return;
          }
        }
        */
        let productid = button.getAttribute("data-product-id");
        
        console.log("this is productid " + productid)
        button.innerHTML = `
        <svg aria-hidden="true" focusable="false" role="presentation" class="zyzicon zyzicon-spinner" viewBox="0 0 20 20"><path d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z" fill="#919EAB"/></svg>
        `;
  
        let formData = {
          items: [
            {
              id: productid,
              quantity: 1,
            },
          ],
        };
        fetch(window.Shopify.routes.root + "cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
          
            return response.json();
          })
          .then((res) => {
            button.innerHTML = `
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 7L9.42857 17L6 13" stroke="#363853" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `;
            console.log("tick");
          });
        sleep(1000)
          .then(function () {
            button.innerHTML = "Add to Cart";
            console.log("add to cart");
            alert("added succsesfulyys");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    });
  
    //variants
  /*
    let toastItems = document.querySelectorAll(".toast-list li");
  
    toastItems.forEach(async function (toastItem) {
      let ans = toastItem.getAttribute("data-variant");
      let variantID = ans.split("/").pop();
      toastItem.addEventListener("click", function () {
        const parentUl = toastItem.parentElement;
        
        const parentBtn = parentUl.parentElement;
  
        const siblingBtn = parentBtn.previousElementSibling;
  
        siblingBtn.innerHTML = `
        <svg aria-hidden="true" focusable="false" role="presentation" class="zyzicon zyzicon-spinner" viewBox="0 0 20 20"><path d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z" fill="#919EAB"/></svg>
        `;
        parentBtn.style.display = "none";
  
        let formData = {
          items: [
            {
              id: variantID,
              quantity: 1,
            },
          ],
        };
        fetch(window.Shopify.routes.root + "cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            siblingBtn.innerHTML = `
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 7L9.42857 17L6 13" stroke="#363853" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `;
            console.log("tick");
          });
        sleep(1000)
          .then(function () {
            siblingBtn.innerHTML = "Add to Cart";
            console.log("add to cart");
            alert("added succsesfulyys");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    });
  
   */
  
    //collection title
  
  
    // button colors / showing button
  /*
    buttons.forEach(function (button) {
      if (addToCart == false) {
        button.remove();
      } else {
        button.style.backgroundColor = addToCartBG;
        button.style.color = addToCartTC;
      }
    });
  */
    //images
    /*
    if (secondImageChecked == false) {
      items.forEach(function (item) {
        let imgSrc = item.querySelector(".image-original").src;
  
        let imgSrcTwo = item.querySelector(".image-change");
        if (imgSrcTwo) {
          imgSrcTwo.src = imgSrc;
        }
      });
    }
  */
    // from/currency
    /*
    console.log(priceVariesChecked)
    let compare = document.querySelectorAll(".xyz-compare")
    let from = document.querySelectorAll(".xyz-from")
    if(priceVariesChecked == false){
      compare.forEach((compare)=> compare.remove())
      from.forEach((from)=> from.remove())
    }
    if (priceVariesChecked == true){
      compare.forEach((compare)=> compare.innerHTML.includes("null") == 1 ? compare.remove() : console.log("hello"))
    }
  */
  //colors
  
  
  
  // out of stock
  
  
  
  };