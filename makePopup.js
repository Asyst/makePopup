;(function ($) {
  $.fn.makePopup = function ( options ) {

    var
      $that = $(this),
      // contentID = $that.data('content'),
      $template = $( '<div />', { class: 'popup-maked' } ),
      $popupHolder = $( '<div />', { class: 'popup__holder' } ),
      $popupContent = $( '<div />', { class: 'popup__content' } ),
      $overlay = $('<div />', { class: 'popup__overlay' }),
      $buttonClose = $('<a />', { class: 'popup__close' }),
      initEvents, removeEvents,
      setMapPopup, buildPopup, initPopup, renderPopup;

    var options = $.extend({}, $.fn.makePopup.defaults, options);

    $template.css({
      display: 'inline-block',
      width: options.width,
      height: options.height,
      verticalAlign: 'middle',
      pointerEvents: 'all'
    });

    $popupHolder.css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 10001,
      pointerEvents: 'none'
    });

    $overlay.css({
      display: 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: options.overlayColor,
      textAlign: 'center',
      zIndex: 9999
    });

    // Events

    // start /initEvents/
    initEvents = function ( $trigger, callbacks ) {
      var
        id = $trigger.data('content') + '-popup',
        cls = $trigger.attr('class').substring( $trigger.attr('class').indexOf('_') ),
        closePopup;

        if ( options.debug ) {
          console.info('trigger class: ', cls);
        }

      $(document).on('click.popup', '.' + cls, function (e) {

        if ( options.debug ) {
          console.info('popups object: ', $.fn.makePopup.mapPopups[id]);
        }

        $('body').append($.fn.makePopup.mapPopups[id])

        if ( options.isOverlay ) {
          $('body').append( $overlay );
        }

        $overlay.fadeIn(300);
        $('.popup__holder')
          .attr('id', id.slice(1))
          .addClass(id.slice(1))
          .addClass('popup__holder--active')
          .fadeIn(300);

        callbacks.onShow();

        closePopup = function (e) {
          if ( options.debug ) {
            console.info('popup id: ', id);
          }

          $(id).fadeOut(300);
          $overlay.fadeOut(300);

          callbacks.onHide();

          setTimeout(function () {
            $(id).remove();
            $overlay.remove();
          }, 300);

          $(document).off('click.close-popup');
        };

        $(document).on('click.close-popup', '.popup__overlay', closePopup);
        $(document).on('click.close-popup', '.popup__close', closePopup);

        return false;
      });
    };
    // end /initEvents/

    // Service Methods
    // start /setMapPopup/
    setMapPopup = function ( id, popup ) {
      if ( $.fn.makePopup.mapPopups[id] === undefined ) {

        $.fn.makePopup.mapPopups[id] = popup;

        if ( options.debug ) {
          console.info('popup ', $.fn.makePopup.mapPopups[id], ' added to map');
        }

      }
    };
    // end /setMapPopup/

    // start /buildPopup/
    buildPopup = function ( $trigger ) {
      var contentID = $trigger.data('content');
      var popup = $popupHolder.append( $template.append( $buttonClose ).append($popupContent) );

      var $content = options.$content_template;

      $popupContent.append($content);

      setMapPopup( contentID + '-popup', popup );
    };
    // end /buildPopup/

    return this.each(function () {

      var callbacks = {
        onShow: options.onShow.bind(this),
        onHide: options.onHide.bind(this)
      }

      // console.log('each: ', this);

      buildPopup($(this));
      initEvents($(this), callbacks);

      // console.log('mapPopups', $.fn.makePopup.mapPopups);

    });

  };

  $.fn.makePopup.mapPopups = {};

  // debug - include console info messages
  $.fn.makePopup.defaults = {
    // width: 'auto',
    // height: 'auto',
    isOverlay: true,
    overlayColor: 'rgba(0, 0, 0, .5)',
    debug: false,
    onShow: function () {
      return false;
    },
    onHide: function () {
      return false;
    }
  };

}(jQuery));
