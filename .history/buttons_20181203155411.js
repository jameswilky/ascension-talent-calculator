
$(document).ready(function () { //check document is loaded
  let modal = $('.modal');
  modal.isOpen = false;




  //Toggle modal display on icon click
  $('#selected_class').on('click', function () {
    if (modal.isOpen) { //Close Modal
      modal.css('display', 'none');
    }
    else { //Open
      modal.css('display', 'block');
      modal
    }
  })

  //close modal when cross is pressed
  $('.close').on('click', function () {
    $('.modal').css('display', 'none');
  })
});