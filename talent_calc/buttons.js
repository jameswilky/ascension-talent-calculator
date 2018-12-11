var map = []
var class_names = ['druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior'];
var spec_names =
  ['balance', 'feral', 'restoration',
    'beast mastery', 'marksman', 'survival',
    'arcane', 'fire', 'frost',
    'holy', 'protection', 'retribution',
    'discipline', 'holy', 'shadow',
    'assasination', 'combat', 'subtlety',
    'elemental', 'enhancement', 'restoration',
    'affliction', 'demonology', 'destruction',
    'arms', 'fury', 'protection']


var legacy_wow_api = {
  // append class name and talent tree index. e.g balance druid = 'druid0.png'
  spec_icon: 'https://legacy-wow.com/talentcalcs/vanilla/shared/global/talents/images/talents/trees/'
}

/* Get Locations from JSON FIle*/
function getMap() {
  /*Get locations*/
  $.getJSON("text.json", function (data) {
    data.forEach(element => {
      map.push(element);
    });
    let event = new Event('mapLoaded');
    document.dispatchEvent(event);
  })

}

//Talent Tree object
function Tree(class_name, spec_name, element, index) {
  this.class_name = class_name
  this.spec_name = spec_name
  this.body = element;
  this.image = 'https://wotlk.evowow.com/static/images/wow/talents/backgrounds/' + class_name + '_' + index + '.jpg'
  /*Update background image css*/
  $(this.body).css('background-image', 'url(' + this.image + ')');

  function buildHeader() {
    /*Assigns the correct header name to each tree*/
    let s = spec_names.indexOf(spec_name);
    let header = $('.spec-banner')[s % 3];
    $(header).html(spec_name) /*Add Name of spec*/
    let logo = legacy_wow_api.spec_icon + class_name + (s % 3) + '.png' //get icon
    $(header).append('<img src=' + "'" + logo + "'" + '/>')
  }
  buildHeader();

}

//ClassIcon Blue Print
function ClassIcon(name, element, modalId) {
  this.name = name;
  this.element = element;
  this.image = 'https://data.project-ascension.com/files/images/icons/classes/' + name + '.png';
  element.src = this.image;
  element.name = name /*Image name*/

  element.onclick = function () {
    loadBackground(element.name); /*Load background images*/
    loadTalents(name);
    /*Close modal*/
    $('#' + modalId).toggle();

    $('#selectedClassIcon').attr('src', element.src)/*Change icon image*/
    selected_class = element.name;
  }


}

//Talent Blue Print
function Talent(id, element, nRanks) {
  this.id = id;
  this.element = element;

  let imageElement = $(this.element).first().children();
  $(imageElement).css('filter', 'grayscale(100)') /* make image grayscale*/

  this.tooltip = "Example Text";
  this.nRanks = nRanks;
  let curRank = 0;

  $(this.element).append("<div class=rankBox>" + curRank + " / " + nRanks + "</div>")

  this.loadEvents = function () {
    /*Prevent dev tool inspect on right click*/
    element.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    /*Handle left click and right click for desktop*/
    element.onmousedown = function (event) {
      if (event.which == 1) {
        /* Add point on left click and remove gray filter*/
        $(imageElement).css('filter', 'none')
        if (curRank < nRanks) {
          curRank += 1;
          $(this).find('.rankBox').html("<div class=rankBox>" + curRank + " / " + nRanks + "</div>")
        }

      }
      if (event.which == 3) {
        /* Remove point on right click*/
        if (curRank > 0) {
          curRank -= 1;
          $(this).find('.rankBox').html("<div class=rankBox>" + curRank + " / " + nRanks + "</div>")
          /* If rank == 0, add greyscale filter */
          if (curRank == 0) {
            $(imageElement).css('filter', 'grayscale(100)')
          }
        }
      }
    }

    /*Handle touch hold for mobile users */

    let onlongtouch;
    let timer, lockTimer;
    let touchduration = 1000; //length of time we want the user to touch before we do something

    function touchstart(e) {
      /*On Each click, add an element */
      $(imageElement).css('filter', 'none')
      if (curRank < nRanks) {
        curRank += 1;
        $(this).find('.rankBox').html("<div class=rankBox>" + curRank + " / " + nRanks + "</div>")
      }

      e.preventDefault();
      if (lockTimer) {
        return;
      }
      timer = setTimeout(onlongtouch, touchduration);
      lockTimer = true;
    }

    function touchend() {
      //stops short touches from firing the event
      if (timer) {
        clearTimeout(timer); // clearTimeout, not cleartimeout..
        lockTimer = false;
      }
      else {
      }
    }

    onlongtouch = function () {
      /* on long hold, remove all points from an icon*/
      console.log('Hold Triggered')
      curRank = 0;
      $(element).find('.rankBox').html("<div class=rankBox>" + curRank + " / " + nRanks + "</div>")
      $(imageElement).css('filter', 'grayscale(100)')
    }

    element.addEventListener("touchstart", touchstart, false);
    element.addEventListener("touchend", touchend, false);
  }

  /* On mouse over show tooltip */
  element.onmouseover = function () {

  }
  this.loadEvents();



}

function loadTalents(selectedclass) {
  let n = 44; /* Number of grids per tree */

  let placeholder = class_names.indexOf(selectedclass) * n * 3;
  for (let j = 0; j < 3; j++) {/*For each tree*/
    let selector = '#tree' + j
    $(selector).children().empty(); /*Clear previous talents*/
    let grids = $(selector).children().toArray();
    let p = placeholder + (j * n);
    for (let i = 0; i < n; i++) {
      let index = i + p;
      if (map[index].data[0] != undefined) {
        let image_name = map[index].data[0].image;
        let imgElement = document.createElement("img");
        imgElement.src = 'https://data.project-ascension.com/files/images/icons/' + image_name;
        grids[i].appendChild(imgElement)

        let id = map[index].data[0].id;
        let element = grids[i];
        let maxRank = map[index].max_rank;
        let talent = new Talent(id, element, maxRank)
      }
    }
  }
}

/*Load background*/
function loadBackground(class_name) {
  //Select div that holds talent trees and populate with relevant data

  let trees = $('.tree');
  for (let i = 0; i < 3; i++) {
    let spec_name = spec_names[class_names.indexOf(class_name) * 3 + i]
    let tree = new Tree(class_name, spec_name, trees[i], i + 1)
  }
}

function Modal(modalId) {
  this.modal = $('#' + modalId);
  this.isOpen = false;
  this.open_button
  this.toggle = function () {
    if (this.modal.isOpen) { //Close Modal
      this.modal.css('display', 'none');
      this.modal.isOpen = false;
    }
    else { //Open
      this.modal.css('display', 'block');
      this.modal.isOpen = true;
    }
  }

  this.initIcons = function () {
    // Get placeholder divs
    let elements = $('.modal-content').children().toArray();

    let ClassIcons = [];
    /* Replace placeholder with appropriate class icons and give click functionality*/
    for (let i = 0; i < class_names.length; i++) {
      let icon = new ClassIcon(class_names[i], elements[i], modalId)
      ClassIcons.push(icon);
    }
  }

}


getMap();
$(document).ready(function () { //check document is loaded
  /* Init Modal and class Icons */
  let classModal = new Modal('modal');
  classModal.initIcons();

  //Toggle modal display on ClassIcon click
  $('#selectedClassIcon').on('click', function () {
    classModal.toggle()
  })

  document.addEventListener('mapLoaded', function () {
    /* waits untill the map is loaded before other assets are loaded*/

    /* Initialize Default Settings */
    let selected_class = 'druid';
    loadBackground(selected_class);
    loadTalents(selected_class)
  })


});


