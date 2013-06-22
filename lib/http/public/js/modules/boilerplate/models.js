define(['Backbone'],function(Backbone){

  var Note = Backbone.Model.extend({

    initialize: function() {
    }

  });

  var PrivateNote = Note.extend({

    allowedToEdit: function(account) {
      return account.owns(this);
    }

  });


  return {
    Note        : Note,
    PrivateNote : PrivateNote
  }


});
