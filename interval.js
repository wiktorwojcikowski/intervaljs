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
      var $$ = this;
      $$.intervals = [];
      
      if(arguments.length) {
        if(arguments.length==1)
          end = start;
        if(!(start instanceof Endpoint))
          start = new Interval.Endpoint(start);
        if(!(end instanceof Endpoint))
          end = new Interval.Endpoint(end);
          
        if(end.__gt__(start) || (end.__eq__(start) && start.isClosed()))
          $$.intervals.push({start: start, end: end});
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
      var $$ = this, Interval;
      interval = $$.parseArgs.apply($$, arguments);
      
      interval.intervals.forEach(function(interval) {
        var merged = false, i=0;
        
        if(!$$.intervals.length || 
            $$.intervals[$$.intervals.length-1].end.__lt__(interval.start) ) {
          $$.intervals.push({start: interval.start, end: interval.end});
          return;
        }
        for(; i<$$.intervals.length && 
                (interval.end.__gte__($$.intervals[i].start) || 
                interval.start.__lte__($$.intervals[i].end)); i++) {
          if(interval.end.__gte__($$.intervals[i].start) && 
                        interval.start.__lte__($$.intervals[i].end) ) {
            merged = true;
            if( interval.start.__lte__($$.intervals[i].start))
              $$.intervals[i].start = interval.start;
            if( interval.end.__gte__($$.intervals[i].end))
              $$.intervals[i].end = interval.end;
            break;
          }
        }
        if(i<$$.intervals.length && 
              (interval.end.__gte__($$.intervals[i].start) && 
              interval.start.__lte__($$.intervals[i].end))) {
          for(i++; i<$$.intervals.length && 
                    (interval.end.__gte__($$.intervals[i].start) && 
                    interval.start.__lte__($$.intervals[i].end));) {
            if(interval.end.__lt__($$.intervals[i].end) ) {
              $$.intervals[i-1].end = $$.intervals[i].end;
            }
            $$.intervals.splice(i, 1);
          }
        }
        if(!merged) {
          $$.intervals.splice(Math.max(--i, 0), 0, {start: interval.start, end: interval.end});
        }
      });
      return $$;
    };


    Interval.prototype.difference = function diference(interval) {
      var $$ = this, interval;
      interval = $$.parseArgs.apply($$, arguments);
      
      interval.intervals.forEach(function(interval) {
        var merged=false, i=0;
        for(; i<$$.intervals.length && (interval.end.__gte__($$.intervals[i].start) || 
                interval.start.__lte__($$.intervals[i].end)); i++) {
          if(interval.start.__lte__($$.intervals[i].start) && 
                              interval.end.__gte__($$.intervals[i].end)) {
            $$.intervals.slice(i, 1);
            i--;
          }
          else if(interval.start.__lte__($$.intervals[i].start) && 
                              interval.end.__gte__($$.intervals[i].start)) {
            $$.intervals[i].start = 
                new Interval.Endpoint(interval.end.value(), !interval.end.isOpen());
          }
          else if(interval.start.__lte__($$.intervals[i].end) && 
                              interval.end.__gte__($$.intervals[i].end)) {
            $$.intervals[i].end = 
                new Interval.Endpoint(interval.start.value(), !interval.start.isOpen());
          }
          else if(interval.start.__gt__($$.intervals[i].start) && 
                              interval.end.__lt__($$.intervals[i].end)) {
            var p = {
              start: new Interval.Endpoint(interval.end.value(), !interval.end.isOpen()), 
              end: $$.intervals[i].end
            };
            $$.intervals[i].end = 
                new Interval.Endpoint(interval.start.value(), !interval.start.isOpen());;
            i++;
            $$.intervals.splice(i, 0, p);
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
      
      interval.intervals.forEach(function(interval) {
        var found=false, i=0;
        if(!result)
          return;
        for(; i<$$.intervals.length && (interval.end.__gte__($$.intervals[i].start) || 
                interval.start.__lte__($$.intervals[i].end)); i++) {
          if(interval.start.__gte__($$.intervals[i].start) 
                          && interval.end.__lte__($$.intervals[i].end)) {
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
      this.intervals.forEach(function(i) {
        if( i.start.__eq__(i.end) )
          parts.push("{"+i.start.value()+"}");
        else
          parts.push(
            (i.start.isOpen()?"(":"[") +
            i.start.value()+";"+i.end.value() +
            (i.end.isOpen()?")":"]")
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
