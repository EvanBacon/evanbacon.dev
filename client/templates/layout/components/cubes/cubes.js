var perlinAPI = function() {
};

var guiAPI = function() {
};

Meteor.startup(function() { // dom is ready

  Meteor.Loader.loadJs("//cdn.rawgit.com/josephg/noisejs/master/perlin.js", perlinAPI);
  Meteor.Loader.loadJs("//cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5/dat.gui.min.js", guiAPI);
  Meteor.Loader.loadJs("//cdn.rawgit.com/nosir/obelisk.js/master/build/obelisk.js", function() {});

});


Template.works.rendered = function() {

  $(function() {
    (function() {
      console.log("In cubes");
      $(".owl-carousel").owlCarousel({
        navigation : true, // Show next and prev buttons
        slideSpeed : 300,
        paginationSpeed : 400,
        autoPlay: 3000, //Set AutoPlay to 3 seconds
        items : 1, // THIS IS IMPORTANT
        responsive : {
          480 : { items : 1  }, // from zero to 480 screen width 4 items
          768 : { items : 2  }, // from 480 screen widthto 768 6 items
          1024 : { items : 3   // from 768 screen width to 1024 8 items
          }
        },
      });

      var gui, perlin;

      $(function() {
        perlin.init();
      });

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
      }

      if (!window.requestAnimationFrame) {
        throw new Error('Unable to use this map without support for requestAnimationFrame');
      }

      perlin = {
        init: function() {
          this.cubeSize = 24;
          this.mapSize = 80;
          this.timeshift = true;
          this.timeshiftSpeed = 0.0005;
          this.zAmplify = 0.5;
          this.noiseScale = 20;
          console.log('#perlin-' + $('.cubes').data( "name" ));
          this.canvas = $('#perlin-' + $('.cubes').data( "name" ));
          this.context = this.canvas[0].getContext('2d');
          this.setContextSize();
          this.setResizeHandler();
          this.origin = new obelisk.Point(this.canvas.width() / 2, this.cubeSize * -15);
          this.pixelView = new obelisk.PixelView(this.canvas, this.origin);
          this.generateNoiseMachine();
          this.generateCubes();
          this.generatePoints();
          this.setDraggable(true, this.canvas);
          return this.animateLoop();
        },
        regenerate: function() {
          this.generateNoiseMachine();
          return this.generatePoints();
        },
        generateNoiseMachine: function() {
          return noise.seed(Math.random());
        },
        time: 0,
        animateLoop: function() {
          window.requestAnimationFrame(this.animateLoop.bind(this));
          if (this.timeshift) {
            this.time += this.timeshiftSpeed;
            this.generatePoints();
          }
          return this.drawMap();
        },
        setContextSize: function() {
          var canvSize;
          canvSize = {
            width: this.canvas.width(),
            height: this.canvas.height()
          };
          this.context.canvas.width = canvSize.width;
          return this.context.canvas.height = canvSize.height;
        },
        setResizeHandler: function() {
          if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
          }
          this.resizeTimer = null;
          return $(window).off('resize.perlin').on('resize.perlin', (function(_this) {
            return function() {
              clearTimeout(_this.resizeTimer);
              return _this.resizeTimer = setTimeout((function() {
                return _this.setContextSize();
              }), 50);
            };
          })(this));
        },
        getLevelAt: function(x, y) {
          var noiseVal;
          noiseVal = (noise.simplex3(x / this.noiseScale, y / this.noiseScale, this.time) + 1) / 2;
          return Math.floor((this.cubes.length - 1) * noiseVal);
        },
        getZForLevel: function(level) {
          return level * (this.cubeSize * this.zAmplify);
        },
        generatePoints: function() {
          var i, level, ref, results, x, y;
          this.points = [];
          results = [];
          for (x = i = 0, ref = this.mapSize; 0 <= ref ? i < ref : i > ref; x = 0 <= ref ? ++i : --i) {
            this.points[x] = [];
            results.push((function() {
              var j, ref1, results1;
              results1 = [];
              for (y = j = 0, ref1 = this.mapSize; 0 <= ref1 ? j < ref1 : j > ref1; y = 0 <= ref1 ? ++j : --j) {
                level = this.getLevelAt(x, y);
                results1.push(this.points[x][y] = new obelisk.Point3D(x * this.cubeSize, y * this.cubeSize, this.getZForLevel(level)));
              }
              return results1;
            }).call(this));
          }
          return results;
        },
        generateCubes: function() {
          var color, i, len,rawColors, results;
          rawColors = $( ".cubes" ).data( "colors" ).split(",");
          console.log("colors", rawColors);
          // rawColors = [0x003399, 0x003399, 0x3366CC, 0x3366CC, 0x6699FF, 0x6699FF, 0xFFFFFF, 0xFFFFFF];
          // rawColors = [0xffffff, 0x4285f4, 0x34a853, 0xfbbc05, 0xea4335, 0xffffff, 0x4285f4, 0x34a853];
          this.dimension = new obelisk.CubeDimension(this.cubeSize, this.cubeSize, this.cubeSize * 3);
          this.cubes = [];
          results = [];
          for (i = 0, len = rawColors.length; i < len; i++) {
            color = parseInt(rawColors[i]);
            results.push(this.cubes.push(new obelisk.Cube(this.dimension, new obelisk.CubeColor().getByHorizontalColor(color), false)));
          }
          return results;
        },
        drawMap: function() {
          var i, level, ref, results, x, y;
          this.pixelView.clear();
          results = [];
          for (x = i = 0, ref = this.points.length; 0 <= ref ? i < ref : i > ref; x = 0 <= ref ? ++i : --i) {
            results.push((function() {
              var j, ref1, results1;
              results1 = [];
              for (y = j = 0, ref1 = this.points[x].length; 0 <= ref1 ? j < ref1 : j > ref1; y = 0 <= ref1 ? ++j : --j) {
                level = this.getLevelAt(x, y);
                results1.push(this.pixelView.renderObject(this.cubes[level], this.points[x][y]));
              }
              return results1;
            }).call(this));
          }
          return results;
        },
        setDraggable: function(bool, $target) {
          var originPoint;
          if (!bool && this.scopedDrag) {
            this.scopedDrag.cleanup();
          } else {
            originPoint = this.origin;
            this.scopedDrag = {
              mousedown: function(event) {
                event.preventDefault();
                this.startX = event.pageX;
                this.startY = event.pageY;
                return this.win.on('mouseup.isoDrag', this.mouseup.bind(this)).on('mousemove.isoDrag', this.mousemove.bind(this));
              },
              mouseup: function(event) {
                event.preventDefault();
                this.win.off('.isoDrag');
                delete this.startX;
                return delete this.startY;
              },
              mousemove: function(event) {
                event.preventDefault();
                if ((this.startX != null) && this.startX !== event.pageX) {
                  originPoint.x -= this.startX - event.pageX;
                }
                if ((this.startY != null) && this.startY !== event.pageY) {
                  originPoint.y -= this.startY - event.pageY;
                }
                this.startX = event.pageX;
                return this.startY = event.pageY;
              },
              init: function() {
                this.win = $(window);
                return $target.on('mousedown.isoDrag', this.mousedown.bind(this));
              },
              cleanup: function() {
                $target.off('.isoDrag');
                this.win.off('.isoDrag');
                return delete this.win;
              }
            };
          }
          return this.scopedDrag.init();
        }
      };
    }).call(this);
  });
};
