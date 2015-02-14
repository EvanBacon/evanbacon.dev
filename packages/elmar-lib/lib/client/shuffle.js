RandomShuffle = {
    seeder: function() {
       var seed = [];
       return {
        set:function(start, finish){
          if( finish > start && ! seed[finish - 1] ) {
            var numbers = [];
            for( var i = start; i < finish; i++ ){
              numbers.push(i);
            }
            numbers = _.shuffle(numbers);
            seed = seed.concat(numbers);
           }
            return seed;
        },
        get: function(){
          return seed;
        },
        clear: function(){
          seed = []; 
        }
       };
    },
     shuffle: function(items, seed){
        var shuffled = [];
        for( var i = 0, len = items.length; i < len; i++ ){

            shuffled.push(items[seed[i]]);
        }
        return shuffled;
    }

}; 