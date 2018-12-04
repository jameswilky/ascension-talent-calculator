$(document).ready(function () { //check document is loaded

  //Talent Tree object



  //Icon Blue Print
  function Icon(name, element) {
    this.name = name;
    this.element = element;
    this.image = 'https://data.project-ascension.com/files/images/icons/classes/' + name + '.png';
    element.src = this.image;
    element.onclick = function () {
      modal.css('display', 'none');
      modal.isOpen = false;
    }
    this.active = false;
  }

  // Get placeholder divs
  let elements = $('.modal-content').children().toArray();

  let class_names = ['druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior'];
  let Icons = [];
  for (let i = 0; i < class_names.length; i++) {
    let icon = new Icon(class_names[i], elements[i])
    Icons.push(icon);
  }


  let modal = $('.modal');
  modal.isOpen = false;

  //Toggle modal display on icon click
  $('#selected_class').on('click', function () {
    if (modal.isOpen) { //Close Modal
      modal.css('display', 'none');
      modal.isOpen = false;
    }
    else { //Open
      modal.css('display', 'block');
      modal.isOpen = true;
    }
  })


});