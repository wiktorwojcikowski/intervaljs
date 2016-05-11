//     This lib can be freely distributed under the MIT license.

(function() {
  var Period = (function() {
    
    var extend = function(dst, src) {
       for (var i in src) {
          if (src.hasOwnProperty(i)) {
             dst[i] = src[i];
          }
       }
       return dst;
    };
    
    var Endpoint = function(value, open) {
      if(open === 'undefined')
        open = false;
      
      this.value = function() { return value };
      this.isClosed = function() { return open==false };
      this.isOpen = function() { return open==true };
      this.isDatetime = function() { return value instanceof Date };
      this.isInfinite = function() { return Math.abs(value) == Infinity };
      this.__lt__ = function(endpoint) { 
        if(this.isDatetime())
          return this.value().getTime() < endpoint.value().getTime() ||
            ( this.value().getTime() == endpoint.value().getTime() && 
                                      this.isOpen() && endpoint.isClosed() )
        else
          return this.value() < endpoint.value() || 
            ( this.value() == endpoint.value() && 
                                      this.isOpen() && endpoint.isClosed() )
      };
      this.__gt__ = function(endpoint) { 
        if(this.isDatetime())
          return this.value().getTime() > endpoint.value().getTime() ||
            ( this.value().getTime() == endpoint.value().getTime() && 
                                      this.isOpen() && endpoint.isClosed() )
        else
          return this.value() > endpoint.value() || 
            ( this.value() == endpoint.value() && 
                                      this.isClosed() && endpoint.isOpen() )
      };
    }
    
    Endpoint.prototype.value = function value() {
      return this.value;
    }
    
    
    
    var Period = function(start, end) {
      var $$ = this;
      $$.periods = [];
      
      if(arguments.length) {
        if(arguments.length==1)
          end = start;
        if(!(start instanceof Endpoint))
          start = $$.createEndpoint(start);
        if(!(end instanceof Endpoint))
          end = $$.createEndpoint(end);
          
        $$.periods.push({start: start, end: end});
      }
    };

    Period.prototype.parseArgs = function parseArgs() {
      if(!arguments.length)
        return new Period();
      if(arguments[0] instanceof Period)
        return arguments[0];
      if(arguments.length > 1)
        return new Period(arguments[0], arguments[1]);
      else
        return new Period(arguments[0], arguments[0]);
    };

    Period.prototype.union = function union() {
      var $$ = this, period;
      
      period = $$.parseArgs.apply($$, arguments);
      
      period.periods.forEach(function(period) {
        var merged = false, i=0;
        
        if(!$$.periods.length || $$.periods[$$.periods.length-1].end.__lt__(period.start) ) {
          $$.periods.push(period);
          return;
        }
        for(; i<$$.periods.length && period.start.__lt__($$.periods[i].end); i++) {
		      if(period.end.__gt__($$.periods[i].start) && period.start.__lt__($$.periods[i].end) ) {
		        merged = true;
		        if( period.start.__lt__($$.periods[i].start))
    		      $$.periods[i].start = period.start;
		        if( period.end.__gt__($$.periods[i].end))
    		      $$.periods[i].end = period.end;
		        break;
	        }
        }
        if(i<$$.periods.length && period.start.__lt__($$.periods[i].end)) {
          for(i++; i<$$.periods.length && period.start.__lt__($$.periods[i].end);) {
		        if(period.end.__lt__($$.periods[i].end) ) {
		          $$.periods[i-1].end = $$.periods[i].end;
	          }
	          $$.periods.splice(i, 1);
          }
        }
        if(!merged) {
		      $$.periods.splice(Math.max(--i, 0), 0, period);
        }
      });
		  return $$;
    };

    Period.prototype.difference = function diference() {
      var $$ = this, period;
      
      period = $$.parseArgs.apply($$, arguments);

      period.periods.forEach(function(period) {
        var merged=false, i=0;
        for(; i<$$.periods.length && period.start.__lt__($$.periods[i].end); i++) {
	        if(period[0] < $$.periods[i][0] && period.end.__lt__($$.periods[i].end)) {
	          $$.periods.slice(i, 1);
	          i--;
	        }
	        else if(period.start.__lt__($$.periods[i].start) && period.end.__gt__($$.periods[i].start)) {
            $$.periods[i].start = $$.createEndpoint(period.end.value(), !period.end.isOpen());
	        }
	        else if(period.start.__lt__($$.periods[i].end) && period.end.__gt__($$.periods[i].end)) {
            $$.periods[i].end = $$.createEndpoint(period.start.value(), !period.start.isOpen());;
	        }
	        else if(period.start.__gt__($$.periods[i].start) && period.end.__lt__($$.periods[i].end)) {
	          var p = {
	            start: $$.createEndpoint(period.end.value(), !period.end.isOpen()), 
	            end: $$.periods[i].end
            };
	          $$.periods[i].end = $$.createEndpoint(period.start.value(), !period.start.isOpen());;
	          i++;
	          $$.periods.splice(i, 0, p);
	        }

		    };
	    });
		  return $$;
    }

    Period.prototype.intersection = function intersection(periods, period) {
      
    };

    Period.prototype.exclusion = function intersection(periods, period) {
      
    };

    Period.prototype.createEndpoint = function(value, open) {
      return new Endpoint(value, open);
    }
    
    Period.prototype.toString = function() {
      var parts = [];
      this.periods.forEach(function(p) {
        parts.push(
          (p.start.isOpen()?"(":"[")+p.start.value()+";"+p.end.value()+(p.end.isOpen()?")":"]")
        );
      });
      return parts.join(", ");
    }

    return Period;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Period;
  else
    window.Period = Period;
})();
