define(['underscore', 'jquery'], function(_, $){
"use strict";

function Model(){
    this.services = ['weather', 'traffic'];
    this.service_data = {};
}

Model.prototype.addService = function(serv){
    this.services.push(serv);
};

Model.prototype.gather = function(cb){
    var retrieved = {};
    _.each(this.services, function(val){
        retrieved[val] = false;
    });

    function allRetrieved(){
        return _.every(_.values(retrieved), _.identity);
    };
    var __this = this;
    function getServ(service){
        var url = 'api/'+service;
        $.get(url, function(data){
            __this.service_data[service] = data;
            retrieved[service] = true;
            if (allRetrieved()){
                cb(__this);
            }
        });
    };
    _.each(this.services, function(val){
        getServ(val);
    });
};

Model.prototype.enumerateEntries = function(){
    var entries = [];
    _.each(this.service_data, function(service, serv_name){
        _.each(service, function(source, src_name){
            _.each(source, function(entry, ent_name){
                var ent = {};
                ent.service = serv_name;
                ent.source = src_name;
                ent.name = ent_name;
                ent.contents = entry;
                entries.push(ent);
            });
        });
    });
    return entries;
};


// Create a kind of "singleton" for our model.
if (!window.__dashboard_model){
    window.__dashboard_model = new Model();
}
return window.__dashboard_model;

});
