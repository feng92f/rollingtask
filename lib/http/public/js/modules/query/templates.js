define(function(require){
    "use strict";
    return {
      Item      : require('tpl!./templates/item.tmpl'),
      List      : require('tpl!./templates/list.tmpl'),
      Empty     : require('tpl!./templates/empty.tmpl'),
      Loading   : require('tpl!./templates/loading.tmpl'),
      Detail    : require('tpl!./templates/details-mobile.tmpl'),
      Detail2   : require('tpl!./templates/details.tmpl')
    };
});
