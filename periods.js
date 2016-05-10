//     This lib can be freely distributed under the MIT license.

(function() {
  var Periods = (function() {
    
    var Periods = function(initialPeriods, options) {
      var $$ = this;
      $$.periods = [];
      if(initialPeriods) {
        initialPeriods.forEach(function(p) {
          $$.union(p);
        });
      }
    };

    Periods.prototype.union = function union(period) {
      var $$ = this, merged = false, i=0;
      
      if(!$$.periods.length || $$.periods[$$.periods.length-1][1] < period[0]) {
        $$.periods.push(period);
        return $$;
      }

      for(; i<$$.periods.length && period[0] < $$.periods[i][1]; i++) {
		    if(period[1] > $$.periods[i][0] && period[0] < $$.periods[i][1] ) {
		      merged = true;
		      if( period[0] < $$.periods[i][0])
  		      $$.periods[i][0] = period[0];
		      if( period[1] > $$.periods[i][1])
  		      $$.periods[i][1] = period[1];
		      break;
	      }
      }
      if(i<$$.periods.length && period[0] < $$.periods[i][1]) {
        for(i++; i<$$.periods.length && period[0] < $$.periods[i][1];) {
		      if(period[1] < $$.periods[i][1]) {
		        $$.periods[i-1][1] = $$.periods[i][1];
	        }
	        $$.periods.splice(i, 1);
        }
      }
      if(!merged) {
		    $$.periods.splice(Math.max(--i, 0), 0, period);
      }
		  return $$;
    };

    Periods.prototype.difference = function diference(period) {
      var $$ = this, merged = false, i=0;

      for(; i<$$.periods.length && period[0] < $$.periods[i][1]; i++) {
	      if(period[0] < $$.periods[i][0] && period[1] > $$.periods[i][1]) {
	        $$.periods.slice(i, 1);
	        i--;
	      }
	      else if(period[0] < $$.periods[i][0] && period[1] > $$.periods[i][0]) {
          $$.periods[i][0] = period[1];
	      }
	      else if(period[0] < $$.periods[i][1] && period[1] > $$.periods[i][1]) {
          $$.periods[i][1] = period[0];
	      }
	      else if(period[0] > $$.periods[i][0] && period[1] < $$.periods[i][1]) {
	        var p = [period[1], $$.periods[i][1]]
	        $$.periods[i][1] = period[0];
	        i++;
	        $$.periods.splice(i, 0, p);
	      }

		  };
		  return $$;
    }

    Periods.prototype.intersection = function intersection(periods, period) {
      
    };

    Periods.prototype.exclusion = function intersection(periods, period) {
      
    };



    return Periods;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Periods;
  else
    window.Periods = Periods;
})();
