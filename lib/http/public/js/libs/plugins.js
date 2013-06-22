define('plugins',['jquery'],function (jQuery) {

!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (content, options) {
    this.options = options
    this.$element = $(content)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        escape.call(this)
        backdrop.call(this, function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        escape.call(this)

        this.$element.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          hideWithTransition.call(this) :
          hideModal.call(this)
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function hideWithTransition() {
    var that = this
      , timeout = setTimeout(function () {
          that.$element.off($.support.transition.end)
          hideModal.call(that)
        }, 500)

    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout)
      hideModal.call(that)
    })
  }

  function hideModal(that) {
    this.$element
      .hide()
      .trigger('hidden')

    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop2' + animate + '" />')
        .appendTo(document.body)

      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
        removeBackdrop.call(this)

    } else if (callback) {
      callback()
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove()
    this.$backdrop = null
  }

  function escape() {
    var that = this
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function ( e ) {
        e.which == 27 && that.hide()
      })
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      e.preventDefault()
      $target.modal(option)
    })
  })

}(jQuery);

!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , isHTML: function(text) {
      // html string detection logic adapted from jQuery
      return typeof text != 'string'
        || ( text.charAt(0) === "<"
          && text.charAt( text.length - 1 ) === ">"
          && text.length >= 3
        ) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  }

}(jQuery);

!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function ( element, options ) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(jQuery);

!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  console.log('-----------');
  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    });
  })

}(jQuery);


/**
 *  Ajax Autocomplete for jQuery, version 1.1.5
 *  (c) 2010 Tomas Kirda, Vytautas Pranskunas
 *
 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
 *
 *  Last Review: 07/24/2012
 */

/*jslint onevar: true, evil: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*global window: true, document: true, clearInterval: true, setInterval: true, jQuery: true */

(function ($) {

  var reEscape = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g');

    function fnFormatResult(value, data, currentValue) {
      var pattern = '(' + currentValue.replace(reEscape, '\\$1') + ')';
      return value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
    }

    function Autocomplete(el, options) {
      this.el = $(el);
      this.el.attr('autocomplete', 'off');
      this.suggestions = [];
      this.data = [];
      this.badQueries = [];
      this.selectedIndex = -1;
      this.currentValue = this.el.val();
      this.intervalId = 0;
      this.cachedResponse = [];
      this.onChangeInterval = null;
      this.onChange = null;
      this.ignoreValueChange = false;
      this.serviceUrl = options.serviceUrl;
      this.isLocal = false;
      this.options = {
        autoSubmit: false,
        minChars: 1,
        maxHeight: 300,
        deferRequestBy: 0,
        width: 0,
        highlight: true,
        params: {},
        fnFormatResult: fnFormatResult,
        delimiter: null,
        zIndex: 9999
      };
      this.initialize();
      this.setOptions(options);
      this.el.data('autocomplete', this);
    }

    $.fn.autocomplete = function (options, optionName) {

      var autocompleteControl;

      if (typeof options == 'string') {
        autocompleteControl = this.data('autocomplete');
        if (typeof autocompleteControl[options] == 'function') {
          autocompleteControl[options](optionName);
        }
      } else {
        autocompleteControl = new Autocomplete(this.get(0) || $('<input />'), options);
      }
      return autocompleteControl;
    };


    Autocomplete.prototype = {

      killerFn: null,

      initialize: function () {

        var me, uid, autocompleteElId;
        me = this;
        uid = Math.floor(Math.random() * 0x100000).toString(16);
        autocompleteElId = 'Autocomplete_' + uid;

        this.killerFn = function (e) {
          if ($(e.target).parents('.autocomplete').size() === 0) {
            me.killSuggestions();
            me.disableKillerFn();
          }
        };

        if (!this.options.width) { this.options.width = this.el.width(); }
        this.mainContainerId = 'AutocompleteContainter_' + uid;

        $('<div id="' + this.mainContainerId + '" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="' + autocompleteElId + '" style="display:none; width:300px;"></div></div></div>').appendTo('body');

        this.container = $('#' + autocompleteElId);
        this.fixPosition();
        if (window.opera) {
          this.el.keypress(function (e) { me.onKeyPress(e); });
        } else {
          this.el.keydown(function (e) { me.onKeyPress(e); });
        }
        this.el.keyup(function (e) { me.onKeyUp(e); });
        this.el.blur(function () { me.enableKillerFn(); });
        this.el.focus(function () { me.fixPosition(); });
        this.el.change(function () { me.onValueChanged(); });
      },

      extendOptions: function (options) {
        $.extend(this.options, options);
      },

      setOptions: function (options) {
        var o = this.options;
        this.extendOptions(options);
        if (o.lookup || o.isLocal) {
          this.isLocal = true;
          if ($.isArray(o.lookup)) { o.lookup = { suggestions: o.lookup, data: [] }; }
        }
        $('#' + this.mainContainerId).css({ zIndex: o.zIndex });
        this.container.css({ maxHeight: o.maxHeight + 'px', width: o.width });
      },

      clearCache: function () {
        this.cachedResponse = [];
        this.badQueries = [];
      },

      disable: function () {
        this.disabled = true;
      },

      enable: function () {
        this.disabled = false;
      },

      fixPosition: function () {
        var offset = this.el.offset();
        $('#' + this.mainContainerId).css({ top: (offset.top + this.el.innerHeight()) + 'px', left: offset.left + 'px' });
      },

      enableKillerFn: function () {
        var me = this;
        $(document).bind('click', me.killerFn);
      },

      disableKillerFn: function () {
        var me = this;
        $(document).unbind('click', me.killerFn);
      },

      killSuggestions: function () {
        var me = this;
        this.stopKillSuggestions();
        this.intervalId = window.setInterval(function () { me.hide(); me.stopKillSuggestions(); }, 300);
      },

      stopKillSuggestions: function () {
        window.clearInterval(this.intervalId);
      },

      onValueChanged: function () {
        this.change(this.selectedIndex);
      },

      onKeyPress: function (e) {
        if (this.disabled || !this.enabled) { return; }
        // return will exit the function
        // and event will not be prevented
        switch (e.keyCode) {
          case 27: //KEY_ESC:
            this.el.val(this.currentValue);
            this.hide();
            break;
          case 9: //KEY_TAB:
          case 13: //KEY_RETURN:
            if (this.selectedIndex === -1) {
              this.hide();
              return;
            }
            this.select(this.selectedIndex);
            if (e.keyCode === 9) { return; }
            break;
          case 38: //KEY_UP:
            this.moveUp();
            break;
          case 40: //KEY_DOWN:
            this.moveDown();
            break;
          default:
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
      },

      onKeyUp: function (e) {
        if (this.disabled) { return; }
        switch (e.keyCode) {
          case 38: //KEY_UP:
          case 40: //KEY_DOWN:
            return;
        }
        clearInterval(this.onChangeInterval);
        if (this.currentValue !== this.el.val()) {
          if (this.options.deferRequestBy > 0) {
            // Defer lookup in case when value changes very quickly:
            var me = this;
            this.onChangeInterval = setInterval(function () { me.onValueChange(); }, this.options.deferRequestBy);
          } else {
            this.onValueChange();
          }
        }
      },

      onValueChange: function () {
        clearInterval(this.onChangeInterval);
        this.currentValue = this.el.val();
        var q = this.getQuery(this.currentValue);
        this.selectedIndex = -1;
        if (this.ignoreValueChange) {
          this.ignoreValueChange = false;
          return;
        }
        if (q === '' || q.length < this.options.minChars) {
          this.hide();
        } else {
          this.getSuggestions(q);
        }
      },

      getQuery: function (val) {
        var d, arr;
        d = this.options.delimiter;
        if (!d) { return $.trim(val); }
        arr = val.split(d);
        return $.trim(arr[arr.length - 1]);
      },

      getSuggestionsLocal: function (q) {
        var ret, arr, len, val, i;
        arr = this.options.lookup;
        len = arr.suggestions.length;
        ret = { suggestions: [], data: [] };
        q = q.toLowerCase();
        for (i = 0; i < len; i++) {
          val = arr.suggestions[i];
          if (val.toLowerCase().indexOf(q) === 0) {
            ret.suggestions.push(val);
            ret.data.push(arr.data[i]);
          }
        }
        return ret;
      },

      getSuggestions: function (q) {

        var cr, me;
        cr = this.isLocal ? this.getSuggestionsLocal(q) : this.cachedResponse[q]; //dadeta this.options.isLocal ||
        if (cr && $.isArray(cr.suggestions)) {
          this.suggestions = cr.suggestions;
          this.data = cr.data;
          this.suggest();
        } else if (!this.isBadQuery(q)) {
          me = this;
          me.options.params.query = q;
          $.get(this.serviceUrl, me.options.params, function (txt) { me.processResponse(txt); }, 'text');
        }
      },

      isBadQuery: function (q) {
        var i = this.badQueries.length;
        while (i--) {
          if (q.indexOf(this.badQueries[i]) === 0) { return true; }
        }
        return false;
      },

      hide: function () {
        this.enabled = false;
        this.selectedIndex = -1;
        this.container.hide();
      },

      suggest: function () {

        if (this.suggestions.length === 0) {
          this.hide();
          return;
        }

        var me, len, div, f, v, i, s, mOver, mClick;
        me = this;
        len = this.suggestions.length;
        f = this.options.fnFormatResult;
        v = this.getQuery(this.currentValue);
        mOver = function (xi) { return function () { me.activate(xi); }; };
        mClick = function (xi) { return function () { me.select(xi); }; };
        this.container.hide().empty();
        for (i = 0; i < len; i++) {
          s = this.suggestions[i];
          div = $((me.selectedIndex === i ? '<div class="selected"' : '<div') + ' title="' + s + '">' + f(s, this.data[i], v) + '</div>');
          div.mouseover(mOver(i));
          div.click(mClick(i));
          this.container.append(div);
        }
        this.enabled = true;
        this.container.show();
      },

      processResponse: function (text) {
        var response;
        try {
          response = eval('(' + text + ')');
        } catch (err) { return; }
        if (!$.isArray(response.data)) { response.data = []; }
        if (!this.options.noCache) {
          this.cachedResponse[response.query] = response;
          if (response.suggestions.length === 0) { this.badQueries.push(response.query); }
        }
        if (response.query === this.getQuery(this.currentValue)) {
          this.suggestions = response.suggestions;
          this.data = response.data;
          this.suggest();
        }
      },

      activate: function (index) {
        var divs, activeItem;
        divs = this.container.children();
        // Clear previous selection:
        if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
          $(divs.get(this.selectedIndex)).removeClass();
        }
        this.selectedIndex = index;
        if (this.selectedIndex !== -1 && divs.length > this.selectedIndex) {
          activeItem = divs.get(this.selectedIndex);
          $(activeItem).addClass('selected');
        }
        return activeItem;
      },

      deactivate: function (div, index) {
        div.className = '';
        if (this.selectedIndex === index) { this.selectedIndex = -1; }
      },

      select: function (i) {
        var selectedValue, f;
        selectedValue = this.suggestions[i];
        if (selectedValue) {
          this.el.val(selectedValue);
          if (this.options.autoSubmit) {
            f = this.el.parents('form');
            if (f.length > 0) { f.get(0).submit(); }
          }
          this.ignoreValueChange = true;
          this.hide();
          this.onSelect(i);
        }
      },

      change: function (i) {
        var selectedValue, fn, me;
        me = this;
        selectedValue = this.suggestions[i];
        if (selectedValue) {
          var s, d;
          s = me.suggestions[i];
          d = me.data[i];
          me.el.val(me.getValue(s));
        }
        else {
          s = '';
          d = -1;
        }

        fn = me.options.onChange;
        if ($.isFunction(fn)) { fn(s, d, me.el); }
      },

      moveUp: function () {
        if (this.selectedIndex === -1) { return; }
        if (this.selectedIndex === 0) {
          this.container.children().get(0).className = '';
          this.selectedIndex = -1;
          this.el.val(this.currentValue);
          return;
        }
        this.adjustScroll(this.selectedIndex - 1);
      },

      moveDown: function () {
        if (this.selectedIndex === (this.suggestions.length - 1)) { return; }
        this.adjustScroll(this.selectedIndex + 1);
      },

      adjustScroll: function (i) {
        var activeItem, offsetTop, upperBound, lowerBound;
        activeItem = this.activate(i);
        offsetTop = activeItem.offsetTop;
        upperBound = this.container.scrollTop();
        lowerBound = upperBound + this.options.maxHeight - 25;
        if (offsetTop < upperBound) {
          this.container.scrollTop(offsetTop);
        } else if (offsetTop > lowerBound) {
          this.container.scrollTop(offsetTop - this.options.maxHeight + 25);
        }
        this.el.val(this.getValue(this.suggestions[i]));
      },

      onSelect: function (i) {
        var me, fn, s, d;
        me = this;
        fn = me.options.onSelect;
        s = me.suggestions[i];
        d = me.data[i];
        me.el.val(me.getValue(s));
        if ($.isFunction(fn)) { fn(s, d, me.el); }
      },

      getValue: function (value) {
        var del, currVal, arr, me;
        me = this;
        del = me.options.delimiter;
        if (!del) { return value; }
        currVal = me.currentValue;
        arr = currVal.split(del);
        if (arr.length === 1) { return value; }
        return currVal.substr(0, currVal.length - arr[arr.length - 1].length) + value;
      }

    };

} (jQuery));

!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var that = this
        , items
        , q

      this.query = this.$element.val()

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(this.source, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , keypress: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(jQuery);

!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="dropdown"]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , selector
        , isActive

      if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

      return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })

}(jQuery);


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(jQuery);

/*!
	fancyInput v1
	(c) 2013 Yair Even Or <http://dropthebit.com>
	
	MIT-style license.
*/

;(function($){
	"use strict";
	var isIe = !!window.ActiveXObject,
		letterHeight;

	$.fn.fancyInput = function(){
		if( !isIe )
			init( this );
		return this;
	}

	var fancyInput = {
		classToggler : 'state1',

		keypress : function(e){
			var charString = String.fromCharCode(e.charCode),
				textCont = this.nextElementSibling,
				appendIndex = this.selectionEnd,
				newLine = this.tagName == 'TEXTAREA' && e.keyCode == 13;

			if( (this.selectionEnd - this.selectionStart) > 0 && e.charCode && !e.ctrlKey ){
				var rangeToDel = [this.selectionStart, this.selectionEnd];
				appendIndex = this.selectionStart;

				if( charDir.lastDir == 'rtl' ){ // BIDI support
					rangeToDel = [this.value.length - this.selectionEnd, this.value.length - this.selectionStart + 1];
					//appendIndex = this.value.length;
				}

				fancyInput.removeChars(textCont, rangeToDel);
			}

			if( e.charCode && !e.ctrlKey || newLine ){
				var dir = charDir.check(charString); // BIDI support
				if( dir == 'rtl' || (dir == '' && charDir.lastDir == 'rtl' ) )
					appendIndex = this.value.length - this.selectionStart;

				if( newLine )
					charString = '';

				fancyInput.writer(charString, this, appendIndex);
			}
		},

		// Clalculate letter height for the Carot, after first letter have been typed, or text pasted (only once)
		setCaretHeight : function(input){
			var lettersWrap = $(input.nextElementSibling);
			if( !lettersWrap.find('span').length )
				return false;
			letterHeight = lettersWrap.find('span')[0].clientHeight;
			lettersWrap.find('b').height(letterHeight);
		},

		writer : function(charString, input, appendIndex){
			var chars = $(input.nextElementSibling).children().not('b'),  // select all characters including <br> (which is a new line)
				newCharElm = document.createElement('span');

			if( charString == ' ' ) // space
				charString = '&nbsp;';

			if( charString ){
				newCharElm.innerHTML = charString;
				this.classToggler = this.classToggler == 'state2' ? 'state1' : 'state2';
				newCharElm.className = this.classToggler;
			}
			else
				newCharElm = document.createElement('br');

			if( chars.length ){
				if( appendIndex == 0 ) 
					$(input.nextElementSibling).prepend(newCharElm);
				else{
					var appendPos = chars.eq(--appendIndex);
					appendPos.after(newCharElm);
				}
			}
			else
				input.nextElementSibling.appendChild(newCharElm);

			// let the render tree settle down with the new class, then remove it
			if( charString)
				setTimeout(function(){
					newCharElm.removeAttribute("class");
				},20);

			return this;
		},

		clear : function(textCont){
			var caret = $(textCont.parentNode).find('.caret');
			$(textCont).html(caret);
		},

		// insert bulk text (unlike the "writer" fucntion which is for single character only)
		fillText : function(text, input){
			var charsCont = input.nextElementSibling, 
				newCharElm,
				frag = document.createDocumentFragment();

			fancyInput.clear( input.nextElementSibling );

			setTimeout( function(){
				var length = text.length;

				for( var i=0; i < length; i++ ){
					var newElm = 'span';
					//fancyInput.writer( text[i], input, i);
					if( text[i] == '\n' )
						newElm = 'br';
					newCharElm = document.createElement(newElm);
					newCharElm.innerHTML = (text[i] == ' ') ? '&nbsp;' : text[i];
					frag.appendChild(newCharElm);
				}
				charsCont.appendChild(frag);
			},0);
		},

		// Handles characters removal from the fake text input
		removeChars : function(el, range){
			var allChars = $(el).children().not('b').not('.deleted'), 
				caret = $(el).find('b'),
				charsToRemove;

			if( range[0] == range[1] )
				range[0]--;

			charsToRemove = allChars.slice(range[0], range[1]);

			if( range[1] - range[0] == 1 ){
				charsToRemove.css('position','absolute');
				setTimeout(function(){ // Chrome must wait for the position:absolute to be rendered
					charsToRemove.addClass('deleted');
				},0);
				setTimeout(function(){
					charsToRemove.remove();
				},140);
			}
			else
				charsToRemove.remove();
		},

		// recalculate textarea height or input width
		inputResize : function(el){
			if( el.tagName == 'TEXTAREA' ){
				el.style.top = '-999px';
				var newHeight = el.parentNode.scrollHeight;

				if( $(el).outerHeight() < el.parentNode.scrollHeight )
					newHeight += 10;

				el.style.height = newHeight + 'px';
				el.style.top = '0';

				// must re-adjust scrollTop after pasting long text
				setTimeout(function(){
					el.scrollTop = 0;
					el.parentNode.scrollTop = 9999;
				},50);
			}
			if( el.tagName == 'INPUT' && el.type == 'text' ){
				el.style.width = 0;
				var newWidth = el.parentNode.scrollWidth
				// if there is a scroll (or should be) adjust with some extra width
				if( el.parentNode.scrollWidth > el.parentNode.clientWidth )
					newWidth += 20;

				el.style.width = newWidth + 'px';
				// re-adjustment
				//el.scrollLeft = 9999;
				//el.parentNode.scrollLeft += offset;
			}
		},

		keydown : function(e){
			var charString = String.fromCharCode(e.charCode),
				textCont = this.nextElementSibling,  // text container DIV
				appendIndex = this.selectionEnd,
				undo = (e.ctrlKey && e.keyCode == 90) || (e.altKey && e.keyCode == 8),
				redo = e.ctrlKey && e.keyCode == 89,
				selectAll = e.ctrlKey && e.keyCode == 65;

			fancyInput.textLength = this.value.length; // save a referece to later check if text was added in the "allEvents" callback
			fancyInput.setCaret(this);

			if( selectAll )
				return true;

			if( undo || redo ){
				// give the undo time actually remove the text from the DOM
				setTimeout( function(){
					fancyInput.fillText(e.target.value, e.target);
				}, 50);
				return true;
			}

			// if BACKSPACE or DELETE

			if( e.keyCode == 8 || (e.keyCode == 46 && this.selectionEnd > this.selectionStart) ){
				var selectionRange = [this.selectionStart, this.selectionEnd];

				if( charDir.lastDir == 'rtl' ) // BIDI support
					selectionRange = [this.value.length - this.selectionEnd, this.value.length - this.selectionStart + 1];

				setTimeout(function(){ 
					if( e.ctrlKey ) // when doing CTRL + BACKSPACE, needs to wait until the text was actually removed
						selectionRange = [e.target.selectionStart, selectionRange[0]];
					fancyInput.removeChars(textCont, selectionRange);
				},0);
			}

			// make sure to reset the container scrollLeft when caret is the the START or ar the END
			if( this.selectionStart == 0 )
				this.parentNode.scrollLeft = 0;

			return true;
		},

		allEvents : function(e){
			fancyInput.setCaret(this);

			if( e.type == 'paste' ){
				setTimeout(function(){
					fancyInput.fillText(e.target.value, e.target);
					fancyInput.inputResize(e.target);
				},20);
			}
			if( e.type == 'cut' ){
				fancyInput.removeChars(this.nextElementSibling, [this.selectionStart, this.selectionEnd]);
			}

			if( e.type == 'select' ){
			}

			if( fancyInput.textLength != e.target.value.length ) // only resize if text was changed
				fancyInput.inputResize(e.target);

			// The caret height should be set. only once after the first character was entered.
			if( !letterHeight ){
				// in case text was pasted, wait for it to actually render
				setTimeout(function(){ fancyInput.setCaretHeight(e.target) }, 150);
			}

			if( this.selectionStart == this.value.length )
				this.parentNode.scrollLeft = 999999; // this.parentNode.scrollLeftMax
		},

		setCaret : function(input){
			var caret = $(input.parentNode).find('.caret'),
				allChars =  $(input.nextElementSibling).children().not('b'),
				chars = allChars.not('.deleted'),
				pos = fancyInput.getCaretPosition(input);

				if( charDir.lastDir == 'rtl' ) // BIDI support
					pos = input.value.length - pos;

			var	insertPos = chars.eq(pos);

			if(pos == input.value.length ){
				//if( !chars.length )
				//	caret.prependTo( input.nextElementSibling );
				//else
					caret.appendTo( input.nextElementSibling );
			}
			else
				caret.insertBefore( insertPos );
		},

		getCaretPosition : function(input){
			var caretPos, direction = getSelectionDirection.direction || 'right';
			if( input.selectionStart || input.selectionStart == '0' )
				caretPos = direction == 'left' ? input.selectionStart : input.selectionEnd;

			return caretPos || 0;
		}
	},

	getSelectionDirection = {
		direction : null,
		lastOffset : null,
		set : function(e){
			var d;
			if( e.shiftKey && e.keyCode == 37 )
				d = 'left';
			else if( e.shiftKey && e.keyCode == 39 )
				d = 'right';
			if( e.type == 'mousedown' )
				getSelectionDirection.lastOffset = e.clientX;
			else if( e.type == 'mouseup' )
				d = e.clientX < getSelectionDirection.lastOffset ? 'left' : 'right';

			getSelectionDirection.direction = d;
		}
	}, 

	charDir = {
		lastDir : null,
		check : function(s){
			var ltrChars        = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
				rtlChars        = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
				ltrDirCheck     = new RegExp('^[^'+rtlChars+']*['+ltrChars+']'),
				rtlDirCheck     = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

			var dir = rtlDirCheck.test(s) ? 'rtl' : (ltrDirCheck.test(s) ? 'ltr' : '');
			if( dir ) this.lastDir = dir;
			return dir;
		}
	}

	function init(inputs){
		var selector = inputs.selector;

		inputs.each(function(){
			var className = 'fancyInput',
				template = $('<div><b class="caret">&#8203;</b></div>');

			if( this.tagName == 'TEXTAREA' )
				className += ' textarea';
			// add need DOM for the plugin to work
			$(this.parentNode).append(template).addClass(className);

			// populate the fake field if there was any text in the real input
			if( this.value )
				fancyInput.fillText(this.value, this);
		});

		// bind all the events to simulate an input type text (yes, alot)
    $('.fancyInput').off('keypress.fi')
      .off('keyup.fi select.fi mouseup.fi cut.fi paste.fi')
      .off('mousedown.fi mouseup.fi keydown.fi')
      .off('keydown.fi')

      $('.fancyInput')
      .on('keypress.fi', selector, fancyInput.keypress)
      .on('keyup.fi select.fi mouseup.fi cut.fi paste.fi',selector, fancyInput.allEvents)
      .on('mousedown.fi mouseup.fi keydown.fi',selector , getSelectionDirection.set)
      .on('keydown.fi', selector , fancyInput.keydown);
  }

	window.fancyInput = fancyInput;
})(jQuery);

/*
 * transform: A jQuery cssHooks adding cross-browser 2d transform capabilities to $.fn.css() and $.fn.animate()
 *
 * limitations:
 * - requires jQuery 1.4.3+
 * - Should you use the *translate* property, then your elements need to be absolutely positionned in a relatively positionned wrapper **or it will fail in IE678**.
 * - transformOrigin is not accessible
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery.transform.js
 *
 * Copyright 2011 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 *
 */
(function( $, window, document, Math, undefined ) {

/*
 * Feature tests and global variables
 */
var div = document.createElement("div"),
	divStyle = div.style,
	suffix = "Transform",
	testProperties = [
		"O" + suffix,
		"ms" + suffix,
		"Webkit" + suffix,
		"Moz" + suffix
	],
	i = testProperties.length,
	supportProperty,
	supportMatrixFilter,
	supportFloat32Array = "Float32Array" in window,
	propertyHook,
	propertyGet,
	rMatrix = /Matrix([^)]*)/,
	rAffine = /^\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*(?:,\s*0(?:px)?\s*){2}\)\s*$/,
	_transform = "transform",
	_transformOrigin = "transformOrigin",
	_translate = "translate",
	_rotate = "rotate",
	_scale = "scale",
	_skew = "skew",
	_matrix = "matrix";

// test different vendor prefixes of these properties
while ( i-- ) {
	if ( testProperties[i] in divStyle ) {
		$.support[_transform] = supportProperty = testProperties[i];
		$.support[_transformOrigin] = supportProperty + "Origin";
		continue;
	}
}
// IE678 alternative
if ( !supportProperty ) {
	$.support.matrixFilter = supportMatrixFilter = divStyle.filter === "";
}

// px isn't the default unit of these properties
$.cssNumber[_transform] = $.cssNumber[_transformOrigin] = true;

/*
 * fn.css() hooks
 */
if ( supportProperty && supportProperty != _transform ) {
	// Modern browsers can use jQuery.cssProps as a basic hook
	$.cssProps[_transform] = supportProperty;
	$.cssProps[_transformOrigin] = supportProperty + "Origin";

	// Firefox needs a complete hook because it stuffs matrix with "px"
	if ( supportProperty == "Moz" + suffix ) {
		propertyHook = {
			get: function( elem, computed ) {
				return (computed ?
					// remove "px" from the computed matrix
					$.css( elem, supportProperty ).split("px").join(""):
					elem.style[supportProperty]
				);
			},
			set: function( elem, value ) {
				// add "px" to matrices
				elem.style[supportProperty] = /matrix\([^)p]*\)/.test(value) ?
					value.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/, _matrix+"$1$2px,$3px"):
					value;
			}
		};
	/* Fix two jQuery bugs still present in 1.5.1
	 * - rupper is incompatible with IE9, see http://jqbug.com/8346
	 * - jQuery.css is not really jQuery.cssProps aware, see http://jqbug.com/8402
	 */
	} else if ( /^1\.[0-5](?:\.|$)/.test($.fn.jquery) ) {
		propertyHook = {
			get: function( elem, computed ) {
				return (computed ?
					$.css( elem, supportProperty.replace(/^ms/, "Ms") ):
					elem.style[supportProperty]
				);
			}
		};
	}
	/* TODO: leverage hardware acceleration of 3d transform in Webkit only
	else if ( supportProperty == "Webkit" + suffix && support3dTransform ) {
		propertyHook = {
			set: function( elem, value ) {
				elem.style[supportProperty] = 
					value.replace();
			}
		}
	}*/

} else if ( supportMatrixFilter ) {
	propertyHook = {
		get: function( elem, computed, asArray ) {
			var elemStyle = ( computed && elem.currentStyle ? elem.currentStyle : elem.style ),
				matrix, data;

			if ( elemStyle && rMatrix.test( elemStyle.filter ) ) {
				matrix = RegExp.$1.split(",");
				matrix = [
					matrix[0].split("=")[1],
					matrix[2].split("=")[1],
					matrix[1].split("=")[1],
					matrix[3].split("=")[1]
				];
			} else {
				matrix = [1,0,0,1];
			}

			if ( ! $.cssHooks[_transformOrigin] ) {
				matrix[4] = elemStyle ? parseInt(elemStyle.left, 10) || 0 : 0;
				matrix[5] = elemStyle ? parseInt(elemStyle.top, 10) || 0 : 0;

			} else {
				data = $._data( elem, "transformTranslate", undefined );
				matrix[4] = data ? data[0] : 0;
				matrix[5] = data ? data[1] : 0;
			}

			return asArray ? matrix : _matrix+"(" + matrix + ")";
		},
		set: function( elem, value, animate ) {
			var elemStyle = elem.style,
				currentStyle,
				Matrix,
				filter,
				centerOrigin;

			if ( !animate ) {
				elemStyle.zoom = 1;
			}

			value = matrix(value);

			// rotate, scale and skew
			Matrix = [
				"Matrix("+
					"M11="+value[0],
					"M12="+value[2],
					"M21="+value[1],
					"M22="+value[3],
					"SizingMethod='auto expand'"
			].join();
			filter = ( currentStyle = elem.currentStyle ) && currentStyle.filter || elemStyle.filter || "";

			elemStyle.filter = rMatrix.test(filter) ?
				filter.replace(rMatrix, Matrix) :
				filter + " progid:DXImageTransform.Microsoft." + Matrix + ")";

			if ( ! $.cssHooks[_transformOrigin] ) {

				// center the transform origin, from pbakaus's Transformie http://github.com/pbakaus/transformie
				if ( (centerOrigin = $.transform.centerOrigin) ) {
					elemStyle[centerOrigin == "margin" ? "marginLeft" : "left"] = -(elem.offsetWidth/2) + (elem.clientWidth/2) + "px";
					elemStyle[centerOrigin == "margin" ? "marginTop" : "top"] = -(elem.offsetHeight/2) + (elem.clientHeight/2) + "px";
				}

				// translate
				// We assume that the elements are absolute positionned inside a relative positionned wrapper
				elemStyle.left = value[4] + "px";
				elemStyle.top = value[5] + "px";

			} else {
				$.cssHooks[_transformOrigin].set( elem, value );
			}
		}
	};
}
// populate jQuery.cssHooks with the appropriate hook if necessary
if ( propertyHook ) {
	$.cssHooks[_transform] = propertyHook;
}
// we need a unique setter for the animation logic
propertyGet = propertyHook && propertyHook.get || $.css;

/*
 * fn.animate() hooks
 */
$.fx.step.transform = function( fx ) {
	var elem = fx.elem,
		start = fx.start,
		end = fx.end,
		pos = fx.pos,
		transform = "",
		precision = 1E5,
		i, startVal, endVal, unit;

	// fx.end and fx.start need to be converted to interpolation lists
	if ( !start || typeof start === "string" ) {

		// the following block can be commented out with jQuery 1.5.1+, see #7912
		if ( !start ) {
			start = propertyGet( elem, supportProperty );
		}

		// force layout only once per animation
		if ( supportMatrixFilter ) {
			elem.style.zoom = 1;
		}

		// replace "+=" in relative animations (-= is meaningless with transforms)
		end = end.split("+=").join(start);

		// parse both transform to generate interpolation list of same length
		$.extend( fx, interpolationList( start, end ) );
		start = fx.start;
		end = fx.end;
	}

	i = start.length;

	// interpolate functions of the list one by one
	while ( i-- ) {
		startVal = start[i];
		endVal = end[i];
		unit = +false;

		switch ( startVal[0] ) {

			case _translate:
				unit = "px";
			case _scale:
				unit || ( unit = "");

				transform = startVal[0] + "(" +
					Math.round( (startVal[1][0] + (endVal[1][0] - startVal[1][0]) * pos) * precision ) / precision + unit +","+
					Math.round( (startVal[1][1] + (endVal[1][1] - startVal[1][1]) * pos) * precision ) / precision + unit + ")"+
					transform;
				break;

			case _skew + "X":
			case _skew + "Y":
			case _rotate:
				transform = startVal[0] + "(" +
					Math.round( (startVal[1] + (endVal[1] - startVal[1]) * pos) * precision ) / precision +"rad)"+
					transform;
				break;
		}
	}

	fx.origin && ( transform = fx.origin + transform );

	propertyHook && propertyHook.set ?
		propertyHook.set( elem, transform, +true ):
		elem.style[supportProperty] = transform;
};

/*
 * Utility functions
 */

// turns a transform string into its "matrix(A,B,C,D,X,Y)" form (as an array, though)
function matrix( transform ) {
	transform = transform.split(")");
	var
			trim = $.trim
		, i = -1
		// last element of the array is an empty string, get rid of it
		, l = transform.length -1
		, split, prop, val
		, prev = supportFloat32Array ? new Float32Array(6) : []
		, curr = supportFloat32Array ? new Float32Array(6) : []
		, rslt = supportFloat32Array ? new Float32Array(6) : [1,0,0,1,0,0]
		;

	prev[0] = prev[3] = rslt[0] = rslt[3] = 1;
	prev[1] = prev[2] = prev[4] = prev[5] = 0;

	// Loop through the transform properties, parse and multiply them
	while ( ++i < l ) {
		split = transform[i].split("(");
		prop = trim(split[0]);
		val = split[1];
		curr[0] = curr[3] = 1;
		curr[1] = curr[2] = curr[4] = curr[5] = 0;

		switch (prop) {
			case _translate+"X":
				curr[4] = parseInt(val, 10);
				break;

			case _translate+"Y":
				curr[5] = parseInt(val, 10);
				break;

			case _translate:
				val = val.split(",");
				curr[4] = parseInt(val[0], 10);
				curr[5] = parseInt(val[1] || 0, 10);
				break;

			case _rotate:
				val = toRadian(val);
				curr[0] = Math.cos(val);
				curr[1] = Math.sin(val);
				curr[2] = -Math.sin(val);
				curr[3] = Math.cos(val);
				break;

			case _scale+"X":
				curr[0] = +val;
				break;

			case _scale+"Y":
				curr[3] = val;
				break;

			case _scale:
				val = val.split(",");
				curr[0] = val[0];
				curr[3] = val.length>1 ? val[1] : val[0];
				break;

			case _skew+"X":
				curr[2] = Math.tan(toRadian(val));
				break;

			case _skew+"Y":
				curr[1] = Math.tan(toRadian(val));
				break;

			case _matrix:
				val = val.split(",");
				curr[0] = val[0];
				curr[1] = val[1];
				curr[2] = val[2];
				curr[3] = val[3];
				curr[4] = parseInt(val[4], 10);
				curr[5] = parseInt(val[5], 10);
				break;
		}

		// Matrix product (array in column-major order)
		rslt[0] = prev[0] * curr[0] + prev[2] * curr[1];
		rslt[1] = prev[1] * curr[0] + prev[3] * curr[1];
		rslt[2] = prev[0] * curr[2] + prev[2] * curr[3];
		rslt[3] = prev[1] * curr[2] + prev[3] * curr[3];
		rslt[4] = prev[0] * curr[4] + prev[2] * curr[5] + prev[4];
		rslt[5] = prev[1] * curr[4] + prev[3] * curr[5] + prev[5];

		prev = [rslt[0],rslt[1],rslt[2],rslt[3],rslt[4],rslt[5]];
	}
	return rslt;
}

// turns a matrix into its rotate, scale and skew components
// algorithm from http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp
function unmatrix(matrix) {
	var
			scaleX
		, scaleY
		, skew
		, A = matrix[0]
		, B = matrix[1]
		, C = matrix[2]
		, D = matrix[3]
		;

	// Make sure matrix is not singular
	if ( A * D - B * C ) {
		// step (3)
		scaleX = Math.sqrt( A * A + B * B );
		A /= scaleX;
		B /= scaleX;
		// step (4)
		skew = A * C + B * D;
		C -= A * skew;
		D -= B * skew;
		// step (5)
		scaleY = Math.sqrt( C * C + D * D );
		C /= scaleY;
		D /= scaleY;
		skew /= scaleY;
		// step (6)
		if ( A * D < B * C ) {
			A = -A;
			B = -B;
			skew = -skew;
			scaleX = -scaleX;
		}

	// matrix is singular and cannot be interpolated
	} else {
		// In this case the elem shouldn't be rendered, hence scale == 0
		scaleX = scaleY = skew = 0;
	}

	// The recomposition order is very important
	// see http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
	return [
		[_translate, [+matrix[4], +matrix[5]]],
		[_rotate, Math.atan2(B, A)],
		[_skew + "X", Math.atan(skew)],
		[_scale, [scaleX, scaleY]]
	];
}

// build the list of transform functions to interpolate
// use the algorithm described at http://dev.w3.org/csswg/css3-2d-transforms/#animation
function interpolationList( start, end ) {
	var list = {
			start: [],
			end: []
		},
		i = -1, l,
		currStart, currEnd, currType;

	// get rid of affine transform matrix
	( start == "none" || isAffine( start ) ) && ( start = "" );
	( end == "none" || isAffine( end ) ) && ( end = "" );

	// if end starts with the current computed style, this is a relative animation
	// store computed style as the origin, remove it from start and end
	if ( start && end && !end.indexOf("matrix") && toArray( start ).join() == toArray( end.split(")")[0] ).join() ) {
		list.origin = start;
		start = "";
		end = end.slice( end.indexOf(")") +1 );
	}

	if ( !start && !end ) { return; }

	// start or end are affine, or list of transform functions are identical
	// => functions will be interpolated individually
	if ( !start || !end || functionList(start) == functionList(end) ) {

		start && ( start = start.split(")") ) && ( l = start.length );
		end && ( end = end.split(")") ) && ( l = end.length );

		while ( ++i < l-1 ) {
			start[i] && ( currStart = start[i].split("(") );
			end[i] && ( currEnd = end[i].split("(") );
			currType = $.trim( ( currStart || currEnd )[0] );

			append( list.start, parseFunction( currType, currStart ? currStart[1] : 0 ) );
			append( list.end, parseFunction( currType, currEnd ? currEnd[1] : 0 ) );
		}

	// otherwise, functions will be composed to a single matrix
	} else {
		list.start = unmatrix(matrix(start));
		list.end = unmatrix(matrix(end))
	}

	return list;
}

function parseFunction( type, value ) {
	var
		// default value is 1 for scale, 0 otherwise
		defaultValue = +(!type.indexOf(_scale)),
		scaleX,
		// remove X/Y from scaleX/Y & translateX/Y, not from skew
		cat = type.replace( /e[XY]/, "e" );

	switch ( type ) {
		case _translate+"Y":
		case _scale+"Y":

			value = [
				defaultValue,
				value ?
					parseFloat( value ):
					defaultValue
			];
			break;

		case _translate+"X":
		case _translate:
		case _scale+"X":
			scaleX = 1;
		case _scale:

			value = value ?
				( value = value.split(",") ) &&	[
					parseFloat( value[0] ),
					parseFloat( value.length>1 ? value[1] : type == _scale ? scaleX || value[0] : defaultValue+"" )
				]:
				[defaultValue, defaultValue];
			break;

		case _skew+"X":
		case _skew+"Y":
		case _rotate:
			value = value ? toRadian( value ) : 0;
			break;

		case _matrix:
			return unmatrix( value ? toArray(value) : [1,0,0,1,0,0] );
			break;
	}

	return [[ cat, value ]];
}

function isAffine( matrix ) {
	return rAffine.test(matrix);
}

function functionList( transform ) {
	return transform.replace(/(?:\([^)]*\))|\s/g, "");
}

function append( arr1, arr2, value ) {
	while ( value = arr2.shift() ) {
		arr1.push( value );
	}
}

// converts an angle string in any unit to a radian Float
function toRadian(value) {
	return ~value.indexOf("deg") ?
		parseInt(value,10) * (Math.PI * 2 / 360):
		~value.indexOf("grad") ?
			parseInt(value,10) * (Math.PI/200):
			parseFloat(value);
}

// Converts "matrix(A,B,C,D,X,Y)" to [A,B,C,D,X,Y]
function toArray(matrix) {
	// remove the unit of X and Y for Firefox
	matrix = /([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(matrix);
	return [matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6]];
}

$.transform = {
	centerOrigin: "margin"
};

})( jQuery, window, document, Math );


});
