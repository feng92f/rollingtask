define(function(require){
    "use strict";
    return {
      Item    : require('tpl!./templates/item.tmpl'),
      List    : require('tpl!./templates/list.tmpl'),
      Welcome : require('tpl!./templates/welcome.tmpl'),
      Edit    : require('tpl!./templates/edit.tmpl'),
      Finish  : require('tpl!./templates/finish.tmpl'),
      Detail  : require('tpl!./templates/details.tmpl')
    };
});
