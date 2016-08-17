Template.experience.rendered = function() {
  $(document).ready(function($){
    var dif = function(date1, date2) {
      var year1=date1.getFullYear();
      var year2=date2.getFullYear();
      var month1=date1.getMonth();
      var month2=date2.getMonth();
      if(month1===0){ //Have to take into account
        month1++;
        month2++;
      }
      var numberOfMonths = (year2 - year1) * 12 + (month2 - month1) + 1;
      return numberOfMonths;
    };

    var date1=new Date(2013,5,21);//Remember, months are 0 based in JS
    var date2=new Date();
    var months = dif(date1, date2);
    var frog = new Date(2015,4,12);
    var bakery = new Date(2013,0,0);
    var vyvanse = new Date(2014,0,8);

    var colors = ["#64d9ee", "#52678f", "#0a4e63", "#073350", "#0e82b1", "#87b0e6", "#6b86bd", "#2aa1b7", "#416389"];
    var drawIt = function(animate = true) {
      let width = $(document).width();
      let chartWidth = Math.min(450, width);
      $('#doughnutChart').width(chartWidth);
      $('#doughnutChart').height(chartWidth);

      $("#doughnutChart").drawDoughnutChart([
        { title: "Lego Artist",         	value : 	dif(new Date(2012,7,4), date2),  color: colors[0] },
        { title: "Beta Tester", 	value:  5,   color:  colors[1] },
        { title: "Game Developer",      value:  dif(vyvanse, date2),   color:  colors[2] },
        { title: "Chef",        value : dif(bakery, frog),   color:  colors[3] },
        { title: "Frog Design",        value : dif(frog, date2),   color:  colors[4] },
        { title: "Web Developer",        value : dif(new Date(2016,0,0), date2),   color:  colors[5] },
        { title: "Android",        value : dif(frog, new Date(2016,0,4)),   color:  colors[6] },
        { title: "Design", value: dif(frog, date2), color: colors[7] },
        { title: "iOS", value: dif(vyvanse, date2), color: colors[8] },
      ]);
    };
    jQuery.fn.drawDoughnutChart = function(data, options) {
      var $this = this,
      W = $this.width(),
      H = $this.height(),
      centerX = W/2,
      centerY = H/2,
      cos = Math.cos,
      sin = Math.sin,
      PI = Math.PI,
      settings = $.extend({
        segmentShowStroke : true,
        segmentStrokeColor : "#0C1013",
        segmentStrokeWidth : 1,
        baseColor: "rgba(0,0,0,0.5)",
        baseOffset: 4,
        edgeOffset : 10,//offset from edge of $this
        percentageInnerCutout : 75,
        animation : true,
        animationSteps : 90,
        animationEasing : "easeInOutExpo",
        animateRotate : true,
        tipOffsetX: -8,
        tipOffsetY: -45,
        tipClass: "doughnutTip",
        summaryClass: "doughnutSummary",
        summaryTitle: "MONTHS:",
        summaryTitleClass: "doughnutSummaryTitle",
        summaryNumberClass: "doughnutSummaryNumber",
        beforeDraw: function() {  },
        afterDrawed : function() {  },
        onPathEnter : function(e,data) {  },
        onPathLeave : function(e,data) {  }
      }, options),
      animationOptions = {
        linear : function (t) {
          return t;
        },
        easeInOutExpo: function (t) {
          var v = t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
          return (v>1) ? 1 : v;
        }
      },
      requestAnimFrame = function() {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      }();

      settings.beforeDraw.call($this);

      var $svg = $('<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>').appendTo($this),
      $paths = [],
      easingFunction = animationOptions[settings.animationEasing],
      doughnutRadius = Min([H / 2,W / 2]) - settings.edgeOffset,
      cutoutRadius = doughnutRadius * (settings.percentageInnerCutout / 100),
      segmentTotal = 0;

      //Draw base doughnut
      var baseDoughnutRadius = doughnutRadius + settings.baseOffset,
      baseCutoutRadius = cutoutRadius - settings.baseOffset;
      $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
      .attr({
        "d": getHollowCirclePath(baseDoughnutRadius, baseCutoutRadius),
        "fill": settings.baseColor
      })
      .appendTo($svg);

      //Set up pie segments wrapper
      var $pathGroup = $(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
      $pathGroup.attr({opacity: 0}).appendTo($svg);

      //Set up tooltip
      var $tip = $('<div class="' + settings.tipClass + '" />').appendTo('body').hide(),
      tipW = $tip.width(),
      tipH = $tip.height();

      //Set up center text area
      var summarySize = (cutoutRadius - (doughnutRadius - cutoutRadius)) * 2,
      $summary = $('<div class="' + settings.summaryClass + '" />')
      .appendTo($this)
      .css({
        width: summarySize + "px",
        height: summarySize + "px",
        "margin-left": -(summarySize / 2) + "px",
        "margin-top": -(summarySize / 2) + "px"
      });
      var $summaryTitle = $('<p class="' + settings.summaryTitleClass + '">' + settings.summaryTitle + '</p>').appendTo($summary);
      var $summaryNumber = $('<p class="' + settings.summaryNumberClass + '"></p>').appendTo($summary).css({opacity: 0});

      for (var i = 0, len = data.length; i < len; i++) {
        segmentTotal += data[i].value;
        $paths[i] = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
        .attr({
          "stroke-width": settings.segmentStrokeWidth,
          "stroke": settings.segmentStrokeColor,
          "fill": data[i].color,
          "data-order": i
        })
        .appendTo($pathGroup)
        .on("mouseenter", pathMouseEnter)
        .on("mouseleave", pathMouseLeave)
        .on("mousemove", pathMouseMove);
      }

      //Animation start
      animationLoop(drawPieSegments);

      //Functions
      function getHollowCirclePath(doughnutRadius, cutoutRadius) {
        //Calculate values for the path.
        //We needn't calculate startRadius, segmentAngle and endRadius, because base doughnut doesn't animate.
        var startRadius = -1.570,// -Math.PI/2
        segmentAngle = 6.2831,// 1 * ((99.9999/100) * (PI*2)),
        endRadius = 4.7131,// startRadius + segmentAngle
        startX = centerX + cos(startRadius) * doughnutRadius,
        startY = centerY + sin(startRadius) * doughnutRadius,
        endX2 = centerX + cos(startRadius) * cutoutRadius,
        endY2 = centerY + sin(startRadius) * cutoutRadius,
        endX = centerX + cos(endRadius) * doughnutRadius,
        endY = centerY + sin(endRadius) * doughnutRadius,
        startX2 = centerX + cos(endRadius) * cutoutRadius,
        startY2 = centerY + sin(endRadius) * cutoutRadius;
        var cmd = [
          'M', startX, startY,
          'A', doughnutRadius, doughnutRadius, 0, 1, 1, endX, endY,//Draw outer circle
          'Z',//Close path
          'M', startX2, startY2,//Move pointer
          'A', cutoutRadius, cutoutRadius, 0, 1, 0, endX2, endY2,//Draw inner circle
          'Z'
        ];
        cmd = cmd.join(' ');
        return cmd;
      };
      function pathMouseEnter(e) {
        var order = $(this).data().order;
        // $tip.text(data[order].title + ": " + data[order].value)
        // .fadeIn(200);
        settings.onPathEnter.apply($(this),[e,data]);
        $('.' + settings.summaryTitleClass).text( data[order].title.toUpperCase());
        $('.' + settings.summaryNumberClass).text(data[order].value);

        $('#doughnutWrapper').css({'background-color': data[order].color});
      }
      function pathMouseLeave(e) {
        // $tip.hide();
        settings.onPathLeave.apply($(this),[e,data]);
        $('#doughnutWrapper').css({'background-color': '#FFFFFF'});
        $('.' + settings.summaryTitleClass).text( "MONTHS");
        $('.' + settings.summaryNumberClass).text(segmentTotal);

      }
      function pathMouseMove(e) {
        $tip.css({
          top: e.pageY + settings.tipOffsetY,
          left: e.pageX - $tip.width() / 2 + settings.tipOffsetX
        });
      }
      function drawPieSegments (animationDecimal) {
        var startRadius = -PI / 2,//-90 degree
        rotateAnimation = 1;
        if (settings.animation && settings.animateRotate) rotateAnimation = animationDecimal;//count up between0~1

        drawDoughnutText(animationDecimal, segmentTotal);

        $pathGroup.attr("opacity", animationDecimal);

        //If data have only one value, we draw hollow circle(#1).
        if (data.length === 1 && (4.7122 < (rotateAnimation * ((data[0].value / segmentTotal) * (PI * 2)) + startRadius))) {
          $paths[0].attr("d", getHollowCirclePath(doughnutRadius, cutoutRadius));
          return;
        }
        for (var i = 0, len = data.length; i < len; i++) {
          var segmentAngle = rotateAnimation * ((data[i].value / segmentTotal) * (PI * 2)),
          endRadius = startRadius + segmentAngle,
          largeArc = ((endRadius - startRadius) % (PI * 2)) > PI ? 1 : 0,
          startX = centerX + cos(startRadius) * doughnutRadius,
          startY = centerY + sin(startRadius) * doughnutRadius,
          endX2 = centerX + cos(startRadius) * cutoutRadius,
          endY2 = centerY + sin(startRadius) * cutoutRadius,
          endX = centerX + cos(endRadius) * doughnutRadius,
          endY = centerY + sin(endRadius) * doughnutRadius,
          startX2 = centerX + cos(endRadius) * cutoutRadius,
          startY2 = centerY + sin(endRadius) * cutoutRadius;
          var cmd = [
            'M', startX, startY,//Move pointer
            'A', doughnutRadius, doughnutRadius, 0, largeArc, 1, endX, endY,//Draw outer arc path
            'L', startX2, startY2,//Draw line path(this line connects outer and innner arc paths)
            'A', cutoutRadius, cutoutRadius, 0, largeArc, 0, endX2, endY2,//Draw inner arc path
            'Z'//Cloth path
          ];
          $paths[i].attr("d", cmd.join(' '));
          startRadius += segmentAngle;
        }
      }
      function drawDoughnutText(animationDecimal, segmentTotal) {
        $summaryNumber
        .css({opacity: animationDecimal})
        .text((parseInt(segmentTotal * animationDecimal, 10)));
      }
      function animateFrame(cnt, drawData) {
        var easeAdjustedAnimationPercent =(settings.animation)? CapValue(easingFunction(cnt), null, 0) : 1;
        drawData(easeAdjustedAnimationPercent);
      }
      function animationLoop(drawData) {
        var animFrameAmount = (settings.animation)? 1 / CapValue(settings.animationSteps, Number.MAX_VALUE, 1) : 1,
        cnt =(settings.animation)? 0 : 1;
        requestAnimFrame(function() {
          cnt += animFrameAmount;
          animateFrame(cnt, drawData);
          if (cnt <= 1) {
            requestAnimFrame(arguments.callee);
          } else {
            settings.afterDrawed.call($this);
          }
        });
      }
      function Max(arr) {
        return Math.max.apply(null, arr);
      }
      function Min(arr) {
        return Math.min.apply(null, arr);
      }
      function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
      function CapValue(valueToCap, maxValue, minValue) {
        if (isNumber(maxValue) && valueToCap > maxValue) return maxValue;
        if (isNumber(minValue) && valueToCap < minValue) return minValue;
        return valueToCap;
      }
      return $this;
    };
    drawIt();
  });
};
