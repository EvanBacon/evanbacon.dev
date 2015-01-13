
    getSiteUrl = function () {
      return getSetting('siteUrl', Meteor.absoluteUrl());
    };

    getSetting = function(setting, defaultValue){
      var settings = Settings.find().fetch()[0];
      if(settings && (typeof settings[setting] !== 'undefined')){
        return settings[setting];
      }else{
        return typeof defaultValue === 'undefined' ? '' : defaultValue;
      }
      return defaultValue;
    };

    trimWords = function(s, numWords) {
      expString = s.split(/\s+/,numWords);
      if(expString.length >= numWords)
        return expString.join(" ")+"…";
      return s;
    };

    capitalizeFirst = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    capitalize = function(words) {
        var parts = words.toString().split(' ');
        var caps = _.map(parts, function (w) {
          return w.substr(0, 1).toUpperCase() + w.substr(1);
        });
        return caps.join(' '); //str.substr(0, 1).toUpperCase() + str.substr(1);
    };

    String.prototype.replaceAll = function(target, replacement) {
      return this.split(target).join(replacement);
    };

    randomStr = function(length)
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    appendToFileName = function(filename, str) {
        var parts = filename.split('.');
        var ext = parts.pop();
        return parts.join('.') + str + '.' + ext;
    };

    currentPath = function () {
      var c=window.location.pathname;
      var b=c.slice(0,-1);
      var a=c.slice(-1);
      if(b=="") { 
        return"/"
      } else {
        if(a=="/") {
          return b;
        } else { 
          return c; 
        }
      }

    };

    currentURL = function () {
      return window.location.host;

    };

    getIndexOf = function (arr, itemId) {
      for(var i = 0, len = arr.length; i < len; i++) {
          if (arr[i]._id === itemId) return i;
      }
      return -1;
    };
