/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
*/

/**
 * Define Global Variables
 * getting the daynamic sections in the home page and assigned to secArr
*/

let t = performance.now();

// and object holed the page content
let headerSectionsFooter ={};
// generate the sections Array
const sectionsArr = document.querySelectorAll('section');
// getting the nav ul element
const navUl = document.querySelector('nav ul');
// getting the main header element
const header = document.querySelector('main header');
// getting the footter element
const footer = document.querySelector('footer');
// getting the menuBtn element
const menuBtn = document.querySelector('i.menu__btn');
// getting the scrollupBtn
const scrollUpBtn = document.querySelector('#scroll__up__btn');
/**
 * End Global Variables
 * Start Helper Functions
 * 
*/
/*
------ Fire First Function ------
*/
  // build the menu
  startBuildNav();

//-------------------------------------------------------------------------
/* fist function to call populaut the object with the page elements --> holding the header, sections and footer as sub objects.*/

function startBuildNav(){
  // create the header or home attr- link
  header.setAttribute("id","hero");
  header.setAttribute("name","home");
  headerSectionsFooter["header"] = {id: header.getAttribute("id"), 
                                    name: header.getAttribute("name")};
  //check if the page has any sections to create the list----
  if(sectionsArr.length !== 0){
    // loop over the sections arr
    sectionsArr.forEach((item,ind) =>{
      // get the element tag name to use it as subObj name section1,2,3 and so on
      const tagName = item.localName;
      // check if the element has id attr than add it to the main obj else generat one and add it to the object
      if(!item.hasAttribute("id")){
        item.setAttribute("id", tagName + (ind+1));
        console.log('id has been generated for :' + tagName + (ind+1));
      }
      // check if the element has name attr then add it to the main obj else generat one and add it
      if(!item.hasAttribute('name')){
        item.setAttribute('name', tagName + " " + (ind+1));
        console.log('name attr has been generated for :' + tagName + " " + ind);
      }
      // add the item to the mani obj
      headerSectionsFooter[tagName + ind] = {id: item.getAttribute("id"),
                                            name: (item.getAttribute("name"))};
    })
    // create the footer attr- link
    footer.setAttribute("id","footer");
    footer.setAttribute("name","footer");
    headerSectionsFooter["footer"] = {id: footer.getAttribute("id"),
                                      name: footer.getAttribute("name")};
  }else{
    console.log('something went wrong check if the body has any sections to populate the menu with the sections links!');
  }
  (headerSectionsFooter !== null || headerSectionsFooter !== "undefind")
  ? creatLiItem(headerSectionsFooter)
  : console.log('the headerSectionsFooter object is empty or undefind') 
  return;
}// end of startBuildNav

//-------------------------------------------------------------------------
// createLiItem generate the li element and invoke a element with specified atter 
function creatLiItem(listObj){
  // iterat over the object entries to handel each sub object
  Object.keys(listObj).forEach(key=>{
    // create link element
    const liEle = document.createElement("li")
    const aEle = document.createElement("a");
    // prepare the elements with class and attrs
    liEle.setAttribute("name",listObj[key]["name"]);
    aEle.href = listObj[key]["id"];
    aEle.textContent = (listObj[key]["name"]).toUpperCase();
    aEle.classList.add("menu__link");
    // adding the default active class to the header and menu item link
    
    if(listObj[key]["name"] == "home"){
      aEle.classList.add("active");
      header.classList.add("active");
    }
    // adding the event listener to the li element
    liEle.addEventListener("click",event=>{
      event.preventDefault();
      if(aEle.textContent === event.target.textContent){
        scrollForce(event.target);
        if(window.innerWidth<=600){
          toggleMenu();
        }
      }
    })
    // push the elements to the object
    listObj[key]["elements"] = {"a": aEle, "li": liEle};
  })
    // fun time 
  fireMenuItems(listObj);//---->;-)
}// end of createLiItem

//-----------------------------------------------------------------
// firing the menu items
function fireMenuItems(listObj){
  Object.keys(listObj).forEach(key=>{
    const liEle = listObj[key]["elements"]["li"];
    const aEle = listObj[key]["elements"]["a"]
    liEle.prepend(aEle);
    navUl.appendChild(liEle);
  })
}// end of firing the menu

//----------------------------------------------------------------
// Scroll to anchor ID using scrollTO event
// will scroll to the element which has active class
function scrollForce(target){
  const targetAttr = target.getAttribute("href");
  target.classList.add("active");
  const section = document.getElementById(targetAttr);
  section.classList.add("active");
  section.scrollIntoView({"behavior" : "smooth"});
  removeActiveClass(targetAttr);
}// end of forceScroll

//--------------------------------------------------------------
// removing the class active from the other links
function removeActiveClass(targetAttr){
  const aLinkList = navUl.querySelectorAll("li a");
  aLinkList.forEach(aEle=>{
    if(aEle.getAttribute("href") !== targetAttr){
      aEle.classList.remove("active");
      document.getElementById(aEle.getAttribute("href")).classList.remove("active");
    }
  })
  if(targetAttr !== "hero"){
    scrollUpBtn.style.cssText = "animation-direction: alternate;"
  }else{
    scrollUpBtn.style.cssText = "animation-direction: alternate-reverse;"
  }
}// end of removeActiveClass

//---------------------------------------------------------------
// check the window width on load to set the menu bar style
if(window.innerWidth <= 600){
  toggleMenu();
}// end if

//-------------------------------------------------------------
// add window resize event listener
window.addEventListener("resize",toggleMenu);

//---------------------------------------------------------------
// function to toggle the menu
function toggleMenu(){
  if(window.innerWidth <= 600){
    menuBtn.addEventListener("click",hideMenu);
    hideMenu();
  }else{
    menuBtn.classList.remove("hide");
    navUl.classList.remove("hide");
  }
}// end of toggleMenu

//---------------------------------------------------------------
// add and remove the hide clase on menuBtn pressed
function hideMenu(){
  if(navUl.classList.contains("hide")) {
    navUl.classList.remove("hide");
    menuBtn.style.cssText = "background:var(--main-blu);";// in case hide
  }else{
    navUl.classList.add("hide");
    menuBtn.style.cssText = "background:var(--white);";// in case show
  }
}// end of hideMenu

//---------------------------------------------------------------
/**
 * End Helper Functions
 **/
/**
 * Begin scrolling Events 
**/
//scroll to the top of the page
scrollUpBtn.addEventListener("click",()=>{
  // gwtting the aLink from the main object and pass it to the scrollForce
  scrollForce(headerSectionsFooter["header"]["elements"]["a"]);
  if(window.scrollY < 300){

  }
});
// adding scroll event to the document
document.addEventListener("scroll",followScrolling);

// followScrolling function handel the position of each section in the document
function followScrolling(){
  const winHeight = window.innerHeight;
  // getting the footer hright to specify the bottom of the dead area
  let deadLine = (winHeight * 0.5).toFixed(0);
  const footerRec = footer.getBoundingClientRect();
  const footerHeight = (footerRec.height).toFixed(0);
  if(footerHeight < deadLine){
     deadLine = ((footerHeight - winHeight) * -1) + 10;// the 10 will be add to insure that footer will be in the dead area.... 
  }
  Object.keys(headerSectionsFooter).forEach(key=>{
    
    const pageSec = document.getElementById(headerSectionsFooter[key]["id"]);
    const pageSecRec = pageSec.getBoundingClientRect();
    const pagSecTop = (pageSecRec.top).toFixed(0)
    if((Number.parseInt(pagSecTop) >= 0) && (Number.parseInt(pagSecTop) <= Number.parseInt(deadLine))){
      const id = pageSec.getAttribute("id");
      const aLink = navUl.querySelector('[href="'+id+'"]');
      aLink.classList.add("active");
      removeActiveClass(aLink.getAttribute("href"));
    }
  })// end of object.keys
}// end of followScroll

let t1 = performance.now();
console.log(t1-t);