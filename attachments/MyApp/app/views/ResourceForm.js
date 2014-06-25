$(function () {

    App.Views.ResourceForm = Backbone.View.extend({

        className: "form",
        id: 'resourceform',
        hide: false,
        events: {
            "click .save": "saveForm",
            "click #cancel": function () {
                window.history.back()
            },
             "click #add_newCoellection": function () {
                App.Router.AddNewSelect('Add New')
            }
        },

        template: _.template($('#template-form-file').html()),

        render: function () {
            var vars = {}

            // prepare the header
			

            if (_.has(this.model, 'id')) {
                vars.header = 'Details "' + this.model.get('title') + '"';
                var tempAttachments = this.model.get('_attachments');
                var fields = _.map(
                    _.pairs(tempAttachments),
                    function(pair) {
                        return {
                            key: pair[0],
                            value: pair[1]
                        };
                    }
                );
                vars.resourceAttachments = fields;
                vars.resourceTitle = this.model.get('title');
                vars.resourceUrl = this.model.get('url');
              
              
            } else {
                vars.header = 'New Resource';
                vars.resourceAttachments="No File Selected.";
                vars.resourceUrl = "";
            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.form.render()
            this.form.fields['uploadDate'].$el.hide()
            if (this.edit == false) {
                this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
            }
            this.form.fields['addedBy'].$el.attr("disabled", true)
            this.form.fields['averageRating'].$el.hide()
            var that = this
            if (_.has(this.model, 'id')) {
                if (this.model.get("Level") == "All") {
                    that.hide = true
                }
            }
            // @todo Why won't this work?
            vars.form = "" //$(this.form.el).html()
            this.$el.html(this.template(vars))
            // @todo this is hackey, should be the following line or assigned to vars.form
            $('.fields').html(this.form.el)
            this.$el.append('<button class="btn btn-success" id="add_newCoellection" >Add New</button>')
            $('#progressImage').hide();
            //$this.$el.children('.fields').html(this.form.el) // also not working

            return this
        },

        saveForm: function () {
            // @todo validate 
            //if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
            // Put the form's input into the model in memory
            var addtoDb = true
            var previousTitle = this.model.get("title")
            var newTitle
            var isEdit = this.model.get("_id")
            var formContext=this
            this.form.commit()
            
             if(this.model.get('openWith')=='PDF.js'){
				this.model.set('need_optimization',true)
            }
            // Send the updated model to the server
            newTitle = this.model.get("title")
            var that = this
           
            
           
            if (this.model.get("title").length == 0) {
                alert("Resource Title is missing")
            } else if(this.model.get("subject") == null) {
                alert("Resource Subject is missing")
            } else if(this.model.get("Level") == null){
                alert("Resource Level is missing")
            } else if(this.model.get("Tag") == null){
                alert("Resource Tag is missing")
            } else {
				  $('#gressImage').show();
				  if(isEdit){
			         this.model.save(null, {success:function(res){
							formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
							alert("Resource Updated Successfully")
						 }
				  }else{
					 if(!this.titleMatch()){
						 this.model.set("sum", 0)
						 this.model.set("timesRated", 0)
						 this.model.save(null, {success:function(res){
							formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
						 }
						})
					  }
				  }  
            }
          this.model.on('savedAttachment', function () {
                                this.trigger('processed')
                                $('#progressImage').hide();
                            }, that.model)  

        },
        titleMatch:function(){
         var checkTitle = new App.Collections.Resources()
                    checkTitle.title=that.model.get("title")
                    checkTitle.fetch({async: false})
                    checkTitle=checkTitle.first()
                    if(checkTitle!=undefined)
                    if (checkTitle.toJSON().title!=undefined) {
                             alert("Title already exist")
                             return true
                         }
             return false            
        },
        testting:function(){
        
                $('#gressImage').show();
                this.model.set('uploadDate', new Date().getTime()) 
                if (isEdit == undefined) {
                    var that = this
                    var checkTitle = new App.Collections.Resources()
                    checkTitle.title=that.model.get("title")
                    
                    checkTitle.fetch({
                        async: false
                    })
                    checkTitle=checkTitle.first()
                    if(checkTitle!=undefined)
                    if (checkTitle.toJSON().title!=undefined) {
                             alert("Title already exist")
                             addtoDb = false
                         }
                   
                }
                if (addtoDb) {
                    if (isEdit == undefined) {
                        this.model.set("sum", 0)
                    } 
                    console.log(this.model)
                    this.model.save(null, {
                        success: function () {
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                if (isEdit != undefined) {
                                    if (previousTitle != newTitle) {
                                            var new_res = new App.Models.Resource()
                                            new_res.set("title", newTitle)
                                            new_res.set("description", that.model.get("description"))
                                            new_res.set("articleDate", that.model.get("articleDate"))
                                            new_res.set("addedBy", that.model.get("addedBy"))
                                            new_res.set("openWith", that.model.get("openWith"))
                                            new_res.set("subject", that.model.get("subject"))
                                            new_res.set("Level", that.model.get("Level"))
                                            new_res.set("Tag", that.model.get("Tag"))
                                            new_res.set("author", that.model.get("author"))
                                            new_res.set("openWhichFile", that.model.get("openWhichFile"))
                                            new_res.set("uploadDate", that.model.get("uploadDate"))
                                            new_res.set("openUrl", that.model.get("openUrl"))
                                            new_res.set("averageRating", that.model.get("averageRating"))
                                            new_res.set("sum", 0)
                                            new_res.set("timesRated", 0)
                                            new_res.save()
                                            new_res.on('sync', function () {
                                                new_res.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                                new_res.on('savedAttachment', function () {
                                                    alert("Resource Updated Successfully")
                                                    Backbone.history.navigate("#resources", {
                                                        trigger: true
                                                    })
                                                    that.trigger('processed')
                                                    $('#progressImage').hide();
                                                }, new_res)
                                            })
                                            
                                    } else {
                                        alert("Cannot update model due to identical title")
                                        window.location.reload()
                                    }
                                } else {
                                    App.startActivityIndicator()
                                    that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                }
                            } else {
                                that.model.trigger('processed')
                            }

                            that.model.on('savedAttachment', function () {
                                this.trigger('processed')
                                $('#progressImage').hide();
                            }, that.model)
                        }
                    })
                }
            
        
        },
        statusLoading: function () {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

})