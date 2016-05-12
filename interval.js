//     This lib can be freely distributed under the MIT license.

(function() {
  var Interval = (function() {
    
    var extend = function(dst, src) {
       for (var i in src) {
          if (src.hasOwnProperty(i)) {
             dst[i] = src[i];
          }
       }
       return dst;
    };
    
    var Endpoint = function(value, open) {
      if(typeof open == 'undefined')
        open = false;
      
      this.value = function() { return value };
      this.compareValue = function() { 
        if(this.isDatetime())
          return value.getTime();
        else
          return value;
      };
      this.isClosed = function() { return !this.isInfinite() && open==false };
      this.isOpen = function() { return this.isInfinite() || open==true };
      this.isDatetime = function() { return value instanceof Date };
      this.isInfinite = function() { return Math.abs(value) == Infinity };
    }
    Endpoint.prototype.__eq__ = function(endpoint) { 
      return this.compareValue() == endpoint.compareValue() && 
                                    this.isOpen() == endpoint.isOpen();
    };
    Endpoint.prototype.__lt__ = function(endpoint) { 
      return this.compareValue() < endpoint.compareValue() ||
          ( this.compareValue() == endpoint.compareValue() && 
                                    this.isOpen() && endpoint.isClosed() );
    };
    Endpoint.prototype.__lte__ = function(endpoint) {
      return this.__lt__(endpoint) ||
        ( this.compareValue() == endpoint.compareValue() && 
                                this.isOpen() == endpoint.isOpen() );
    };
    Endpoint.prototype.__gt__ = function(endpoint) { 
      return this.compareValue() > endpoint.compareValue() ||
          ( this.compareValue() == endpoint.compareValue() && 
                                    this.isOpen() && endpoint.isClosed() );
    };
    Endpoint.prototype.__gte__ = function(endpoint) { 
      return this.__gt__(endpoint) ||
          ( this.compareValue() == endpoint.compareValue() && 
                                  this.isOpen() == endpoint.isOpen() );
    };
    
    Endpoint.prototype.value = function value() {
      return this.value;
    }
    
    
    
    var Interval = function(start, end) {
      this._intervals = [];
      
      if(arguments.length) {
        if(arguments.length==1)
          end = start;
        if(!(start instanceof Endpoint))
          start = new Interval.Endpoint(start);
        if(!(end instanceof Endpoint))
          end = new Interval.Endpoint(end);
          
        if(end.__gt__(start) || (end.__eq__(start) && start.isClosed()))
          this._intervals.push({start: start, end: end});
      }
      this.forEach = function(cb) {
        this._intervals.forEach(function(i, k) {
          cb(i.start, i.end, k);
        });
      }
      this.count = function() {
        return this._intervals.length;
      }
      this.intervals = function() {
        return this._intervals;
      }
    };
    
    
    Interval.Endpoint = Endpoint;


    Interval.prototype.parseArgs = function parseArgs() {
      if(!arguments.length)
        return new Interval();
      if(arguments[0] instanceof Interval)
        return arguments[0];
      if(arguments.length > 1)
        return new Interval(arguments[0], arguments[1]);
      else
        return new Interval(arguments[0], arguments[0]);
    };


    Interval.prototype.union = function union(interval) {
      var $$ = this, interval;
      interval = $$.parseArgs.apply($$, arguments);
      
      interval.forEach(function(start, end) {
        var merged = false, i=0;
        
        if(!$$._intervals.length || $$._intervals[$$.count()-1].end.__lt__(start) ) {
          $$._intervals.push({start: start, end: end});
          return;
        }
        
        for(; i<$$._intervals.length; i++) {
          var $$start = $$._intervals[i].start;
          var $$end = $$._intervals[i].end;
          if(!(end.__gte__($$start) || start.__lte__($$end)))
            break;
          if(end.__gte__($$start) && start.__lte__($$end) ) {
            merged = true;
            if( start.__lte__($$start))
              $$._intervals[i].start = start;
            if( end.__gte__($$end))
              $$._intervals[i].end = end;
            break;
          }
        }
        if(i<$$._intervals.length && (end.__gte__($$._intervals[i].start) && 
                                     start.__lte__($$._intervals[i].end))) {
          for(i++; i<$$._intervals.length;) {
            if(!(end.__gte__($$._intervals[i].start) && start.__lte__($$._intervals[i].end))) 
              break;
            if(end.__lt__($$._intervals[i].end) ) {
              $$._intervals[i-1].end = $$._intervals[i].end;
            }
            $$._intervals.splice(i, 1);
          }
        }
        if(!merged) {
          $$._intervals.splice(Math.max(--i, 0), 0, {start: start, end: end});
        }
      });
      return $$;
    };


    Interval.prototype.difference = function diference(interval) {
      var $$ = this;
      interval = $$.parseArgs.apply($$, arguments);
      
      interval.forEach(function(start, end) {
        for(var i=0; i<$$._intervals.length; i++) {
          var $$start = $$._intervals[i].start;
          var $$end = $$._intervals[i].end;

          if(!(end.__gte__($$start) || start.__lte__($$end)))
            break;
            
          if(start.__lte__($$start) && end.__gte__($$end)) {
            $$._intervals.slice(i, 1);
            i--;
          }
          else if(start.__lte__($$start) && end.__gte__($$start)) {
            $$._intervals[i].start = new Interval.Endpoint(end.value(), !end.isOpen());
          }
          else if(start.__lte__($$end) && end.__gte__($$end)) {
            $$._intervals[i].end = new Interval.Endpoint(start.value(), !start.isOpen());
          }
          else if(start.__gt__($$start) && end.__lt__($$end)) {
            var p = {
              start: new Interval.Endpoint(end.value(), !end.isOpen()), 
              end: $$end
            };
            $$._intervals[i].end = new Interval.Endpoint(start.value(), !start.isOpen());
            i++;
            $$._intervals.splice(i, 0, p);
          }
        };
      });
      return $$;
    }


    Interval.prototype.intersection = function intersection(interval) {
      var $$ = this, interval;
      interval = $$.parseArgs.apply($$, arguments);

      return new Interval()
        .union($$)
        .union(interval)
        .difference($$.inversion())
        .difference(interval.inversion());
    };


    Interval.prototype.exclusion = function intersection(interval) {
      var $$ = this, interval;
      interval = $$.parseArgs.apply($$, arguments);
      
      return new Interval().union($$).difference(interval)
        .union(new Interval().union(interval).difference($$))
    };


    Interval.prototype.inversion = function inversion() {
      return new Interval(-Infinity, Infinity).difference(this);
    };


    Interval.prototype.superset = function superset(interval) {
      var $$ = this, result=true;
      interval = $$.parseArgs.apply($$, arguments);
      
      interval.forEach(function(start, end) {
        var found=false, i=0;
        if(!result)
          return;
        for(; i<$$._intervals.length && (end.__gte__($$._intervals[i].start) || 
                start.__lte__($$._intervals[i].end)); i++) {
          if(start.__gte__($$._intervals[i].start) 
                          && end.__lte__($$._intervals[i].end)) {
            found = true;
            break;
          }
        }
        
        result = result && found;
      });
      return result;
    };
    
    
    Interval.prototype.subset = function subset(interval) {
      var $$ = this, result=true;
      interval = $$.parseArgs.apply($$, arguments);
      
      return interval.superset(this);
    }


    Interval.prototype.contains = function contains(point) {
      return this.superset(point);
    };


    Interval.prototype.toString = function() {
      var parts = [];
      this.forEach(function(start, end) {
        if( start.__eq__(end) )
          parts.push("{"+start.value()+"}");
        else
          parts.push(
            (start.isOpen()?"(":"[") +
            start.value()+";"+end.value() +
            (end.isOpen()?")":"]")
          );
      });
      return parts.join(", ");
    };


    return Interval;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Interval;
  else
    window.Interval = Interval;
})();
