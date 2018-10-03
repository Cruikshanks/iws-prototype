function ShowHideContent() {
  var self = this;

  self.escapeElementName = function(str) {
    result = str.replace('[', '\\[').replace(']', '\\]')
    return(result);
  };

  self.showHideRadioToggledContent = function () {
    $(".block-label input[type='radio']").each(function () {

      var $radio = $(this);
      var $radioGroupName = $radio.attr('name');
      var $radioLabel = $radio.parent('label');

      var dataTarget = $radioLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (dataTarget) {

        // Set aria-controls
        $radio.attr('aria-controls', dataTarget);

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $radio.closest('form').find(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {
            var $this = $(this);

            var groupDataTarget = $this.parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.addClass('js-hidden');
            // Set aria-expanded and aria-hidden for hidden content
            $this.attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

          var $dataTarget = $('#' + dataTarget);
          $dataTarget.removeClass('js-hidden');
          // Set aria-expanded and aria-hidden for clicked radio
          $radio.attr('aria-expanded', 'true');
          $dataTarget.attr('aria-hidden', 'false');

        });

      } else {
        // If the data-target attribute is undefined for a radio button,
        // hide visible data-target content for radio buttons in the same group

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {

            var groupDataTarget = $(this).parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.addClass('js-hidden');
            // Set aria-expanded and aria-hidden for hidden content
            $(this).attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

        });
      }

    });
  }
  self.showHideCheckboxToggledContent = function () {

    $(".block-label input[type='checkbox']").each(function() {

      var $checkbox = $(this);
      var $checkboxLabel = $(this).parent();

      var $dataTarget = $checkboxLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

        // Set aria-controls
        $checkbox.attr('aria-controls', $dataTarget);

        // Set aria-expanded and aria-hidden
        $checkbox.attr('aria-expanded', 'false');
        $('#'+$dataTarget).attr('aria-hidden', 'true');

        // For checkboxes revealing hidden content
        $checkbox.on('click', function() {

          var state = $(this).attr('aria-expanded') === 'false' ? true : false;

          // Toggle hidden content
          $('#'+$dataTarget).toggleClass('js-hidden');

          // Update aria-expanded and aria-hidden attributes
          $(this).attr('aria-expanded', state);
          $('#'+$dataTarget).attr('aria-hidden', !state);

        });
      }

    });
  }
}

function select2Init() {
  $("select[data-select-box='true']").removeClass("form-control").select2({
      placeholder: "Please select...",
      sortResults: function (results, container, query) {
          return results.sort(function (a, b) {
              a = a.text.toLowerCase();
              b = b.text.toLowerCase();

              var ax = [], bx = [];

              a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
              b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

              while (ax.length && bx.length) {
                  var an = ax.shift();
                  var bn = bx.shift();
                  var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                  if (nn) return nn;
              }

              return ax.length - bx.length;
          });
      }
  }).each(function () {
      var selectBox = $(this);
      $("a[href='#" + selectBox.attr("id") + "']").click(function () {
          selectBox.select2("focus");
      });

      selectBox.next(":button").click(function () {
        var data = selectBox.select2('data');

        $("#carriersTable").each(function () {
          var tds = '<tr>';
          jQuery.each($('tr:last td', this), function () {
            tds += '<td>' + $(this).html() + '</td>';
          });
          tds += '</tr>';
          if ($('tbody', this).length > 0) {
            $('tbody', this).append(tds);
          } else {
            $(this).append(tds);
          }
        });
      });
    })

  $("select[data-select-allow-clear='true']").select2({
      allowClear: true
  });
}

$(document).ready(function() {

  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
  new GOVUK.SelectionButtons($blockLabels);

  // Show and hide toggled content
  // Where .block-label uses the data-target attribute
  var toggleContent = new ShowHideContent();
  toggleContent.showHideRadioToggledContent();
  toggleContent.showHideCheckboxToggledContent();

  select2Init();

});



// Prototype only

$(document).ready(function() {
  $('.searchable').multiSelect({
  keepOrder: true,
  selectableHeader: "<input type='text' class='search-input form-control' autocomplete='off' placeholder='Start typing to search address book'>",
  selectionHeader: "<h2 class='heading-medium visuallyhidden'>Your chosen carriers</h2>",
  afterInit: function(ms){
    var that = this,
        $selectableSearch = that.$selectableUl.prev(),
        $selectionSearch = that.$selectionUl.prev(),
        selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
        selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

    that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
    .on('keydown', function(e){
      if (e.which === 40){
        that.$selectableUl.focus();
        return false;
      }
    });

    that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
    .on('keydown', function(e){
      if (e.which == 40){
        that.$selectionUl.focus();
        return false;
      }
    });
  },
  afterSelect: function(){
    this.qs1.cache();
    this.qs2.cache();
    $( "h2" ).removeClass( "visuallyhidden" );
  },
  afterDeselect: function(){
    this.qs1.cache();
    this.qs2.cache();
  }
});
});

$(document).ready(function() {
  $(".ms-selection").insertBefore(".ms-selectable");
  $("li.ms-elem-selection").append("<span class=\"iws-remove\">Remove</span>");
});


$(".change-value a.link").click(function(){
    $(".initial").hide();
    $(".editable").show();
    $(".editable-wrap").addClass('edit');
    $(".total-intended-shipments").focus().select();
});

$("input.save").click(function(){
    $(".initial").show();
    $(".editable").hide();
    $(".editable-wrap").removeClass('edit');
});
