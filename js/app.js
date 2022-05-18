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

const t = performance.now();

// an object hold the page content
const sectionsAndFooter ={};
// generate the sections Array
const sectionsArr = document.querySelectorAll("main section");
// getting the nav ul element
const navUl = document.querySelector("nav ul");
// getting the footter element
const footer = document.querySelector("footer");
// getting the menuBtn element
const menuBtn = document.querySelector("i.menu__btn");
// getting the scrollupBtn
const scrollUpBtn = document.querySelector("#scroll__up__btn");
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
/* fist function to call populaut the object with the page elements --> holding the header, sections and footer as sub objects and push them to the sectionsAndFooter which we call it the main object.*/
function startBuildNav(){
  //check if the page has any sections to create the list----
  if (sectionsArr.length !== 0) {
    // loop over the sections arr
    sectionsArr.forEach((item,ind) =>{
      // get the element tag name to use it as subObj name section1,2,3 and so on
      const tagName = item.localName;
      // check if the element has id attr than add it to the main obj else generat one and add it to the object
      // but first assign the name "home" for the first section
      if (ind === 0) {
        item.setAttribute("id", tagName + ind);
        item.setAttribute("name", "home");
      } else {
        // assign an id for the section if the section doesn't have one, other way will take the one it has it
        if (!item.hasAttribute("id")) {
          item.setAttribute("id", tagName + (ind));
          console.log('id has been generated for :' + tagName + (ind));
        }// end of if !item.hasAttr
        // assign a name for the section if doesn't have one, other way will take the one it has it
        if (!item.hasAttribute('name')) {
          item.setAttribute('name', tagName + " " + (ind));
          console.log('name attr has been generated for :' + tagName + " " + ind);
        }// end if !item.hasAttr
      }// end of if ind === 0
      // add the item to the mani obj
      sectionsAndFooter[tagName + ind] = {
        id: item.getAttribute("id"),
        name: (item.getAttribute("name"))
      };
    });
    // after adding all sections to the object its time to add the footer as last section
    // create the footer attr- link
    footer.setAttribute("id", "footer");
    if (!footer.hasAttribute("name")) {footer.setAttribute("name", "footer");}
    
    sectionsAndFooter["footer"] = {
      id: footer.getAttribute("id"),
      name: footer.getAttribute("name")
    };
  } else {
    // this log appare when the sectionArr is empty
    console.log('something went wrong check if the body has any sections to populate the menu with the sections links!');
  }// end of if sectionArr !== 0

  // insure that all elements we nedd from the html file has been add to the main object to start create the menu
  (sectionsAndFooter !== null || sectionsAndFooter !== "undefind")
  ? creatLiItem(sectionsAndFooter)
  : console.log('the headerSectionsFooter object is empty or undefind');
}

//-------------------------------------------------------------------------
// createLiItem generate the li element and invoke a element with specified atter 
function creatLiItem(listObj){
  // iterat over the object keys to handel each sub object to add link elements
  Object.keys(listObj).forEach(key=>{
    // create link elements
    const liEle = document.createElement("li")
    const aEle = document.createElement("a");

    // prepare the elements with class and attrs
    liEle.setAttribute("name", listObj[key]["name"]);
    aEle.href = listObj[key]["id"];
    aEle.textContent = (listObj[key]["name"]).toUpperCase();
    aEle.classList.add("menu__link");

    // adding the default active class to the first section and menu item link
    if (listObj[key]["id"] === "section0") {
      aEle.classList.add("active");
      sectionsArr[0].classList.add("active");
    }// end if listObj

    // adding the event listener to the li element
    liEle.addEventListener("click",event=>{
      event.preventDefault();
      if (aEle.textContent === event.target.textContent) {
        scrollForce(event.target);
        if (window.innerWidth<=600) {
          toggleMenuBtn();
        }// end of if window
      }// end of if aEle
    });
    // push the elements to the object
    listObj[key]["elements"] = {"a": aEle, "li": liEle};
  });

    // fun time 
  fireMenuItems(listObj);//---->;-)
}// end of createLiItem

//-----------------------------------------------------------------
// firing the menu items from the main object that holding all the page info
function fireMenuItems(parentObj){
  // itreate over the main object append a to li than li to ul
  Object.keys(parentObj).forEach(key=>{
    const liEle = parentObj[key]["elements"]["li"];
    const aEle = parentObj[key]["elements"]["a"];
    liEle.prepend(aEle);
    navUl.appendChild(liEle);
  });
}// end of firing the menu

//----------------------------------------------------------------
// Scroll to anchor ID using scrollIntoView event
// will scroll to the element which has active class
function scrollForce(target){
  const targetAttr = target.getAttribute("href");// href holding the section id
  target.classList.add("active");
  if (targetAttr !== "footer") {
    const sectionTarget = document.querySelector("main #" + targetAttr);
    sectionTarget.classList.add("active");
    sectionTarget.scrollIntoView({"behavior" : "smooth"});
  } else {
    footer.scrollIntoView({"behavior" : "smooth"});
  }
  // calling the removeActiveclass with the common id between a,section
  removeActiveClass(targetAttr);
}// end of forceScroll

//--------------------------------------------------------------
// removing the class active from the other links
function removeActiveClass(targetAttr){
  const aLinkList = navUl.querySelectorAll("li a");
  // remove the class active from the a elements
  aLinkList.forEach(aEle=>{
    if (aEle.getAttribute("href") !== targetAttr) {
      aEle.classList.remove("active");
    }
  });
  // remove the class active from the sections 
  sectionsArr.forEach(section=>{
    if(section.getAttribute("id") !== targetAttr){
      section.classList.remove("active");
    }
  });
  
  // handel of the state of the scrollUpBtn
  if (targetAttr !== "section0") {
    scrollUpBtn.style.cssText = "animation-name : show_up;";
  } else {
    scrollUpBtn.style.cssText = "animation-direction: alternate-reverse;";
  }// end of if target
}// end of removeActiveClass

//---------------------------------------------------------------
// check the window width on load to set the menu bar style and the menu btn
toggleMenuBtn();
//-------------------------------------------------------------
// add window resize event listener control the menu style when resizing the window
window.addEventListener("resize", toggleMenuBtn);

//---------------------------------------------------------------
// if the width of the window less than 600 will show the menu button and add event listener to it.
function toggleMenuBtn(){
  if (window.innerWidth <= 600) {
    menuBtn.addEventListener("click",hideMenu);
    if (!navUl.classList.contains("hide")) {hideMenu();}
  } else {
    menuBtn.classList.remove("hide");
    navUl.classList.remove("hide");
  }
}// end of toggleMenu

//---------------------------------------------------------------
// toggle the class hide in menuBtn 
function hideMenu(){
  if (navUl.classList.contains("hide")) {
    navUl.classList.remove("hide");
    menuBtn.style.cssText = "background:var(--main-blu);";// in case hide
  } else {
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
//scroll to the top of the page with postion x:0 y:0
scrollUpBtn.addEventListener("click",()=>{
  window.scrollTo({top: 0, left: 0, behavior: "smooth"});
});

//---------------------------------------------------------------------
// adding scroll event to the document to toogle active class to the navigation items and showing section.
document.addEventListener("scroll",followScrolling);
// followScrolling function handel the position of each section in the view port
function followScrolling(){
  const winHeight = window.innerHeight;
  // getting the footer height to specify the bottom of the dead area
  let deadLine = (winHeight * 0.5).toFixed(0);
  const footerRec = footer.getBoundingClientRect();
  // using toFixed method to avoid any decimals in the dimensions
  const footerHeight = (footerRec.height).toFixed(0);
  if (footerHeight < deadLine) {
    deadLine = ((footerHeight - winHeight) * -1) + 10;// the 10 will be add to insure that footer will be in the dead area.... 
  }
  // iterate over the entries in the main object to get the section in the view port.
  Object.keys(sectionsAndFooter).forEach(key=>{
    const pageSec = document.getElementById(sectionsAndFooter[key]["id"]);
    const pageSecRec = pageSec.getBoundingClientRect();
    const pagSecTop = (pageSecRec.top).toFixed(0)
    
    if ((Number.parseInt(pagSecTop) >= 0) && (Number.parseInt(pagSecTop) <= Number.parseInt(deadLine))) {
      const id = pageSec.id;
      const aLink = navUl.querySelector('[href="' + id + '"]');
      aLink.classList.add("active");
      if (id !== "footer") {
        document.querySelector("main #" + id).classList.add("active");
      }
      removeActiveClass(aLink.getAttribute("href"));
    }// end of if Number.parseInt
  })// end of object.keys
}// end of followScroll

const t1 = performance.now();
console.log(t1-t);