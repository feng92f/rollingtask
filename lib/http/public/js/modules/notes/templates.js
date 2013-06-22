define(function(require){
    "use strict";
    return {
      Item    : require('tpl!./templates/item.tmpl'),
      List    : require('tpl!./templates/list.tmpl'),
      Finish  : require('tpl!./templates/finish.tmpl'),
      Empty   : require('tpl!./templates/empty.tmpl'),
      Edit    : require('tpl!./templates/edit.tmpl')
    };
});
