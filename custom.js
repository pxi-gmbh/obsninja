function director_init(){
    if(location.search.indexOf("director")>-1){ 
      let mainmenu = document.getElementById("mainmenu");
      if(mainmenu!=null)mainmenu.style.display = "block";
    }
}


director_init();
