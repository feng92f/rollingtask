define(function(require){
    "use strict";
    return {
      dashboard : require('tpl!./templates/dashboard.tmpl'),
      guide     : require('tpl!./templates/guide.tmpl'),
      detail    : require('tpl!./templates/detail.tmpl')
    };
});
