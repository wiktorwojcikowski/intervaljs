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
    
    var Endpoint = function(value, open, position) {
      if(typeof open == 'undefined')
        open = false;
      if(typeof position == 'undefined')
        position = 'start';

      this.value = function() { return value; };
      this.position = function() { return position; };
      this.setPosition = function(p) { position=p; };
      this.compareValue = function() { return value; };
      this.isClosed = function() { return !this.isInfinite() && open==false; };
      this.isOpen = function() { return this.isInfinite() || open==true; };
      this.isInfinite = function() { return Math.abs(value) == Infinity; };
      this.isLeft = function() { return position == 'start'; };
      this.isRight = function() { return position == 'end'; };
    }
    Endpoint.prototype.__eq__ = function(endpoint) { 
      return this.compareValue() == endpoint.compareValue() && 
                                    this.isOpen() == endpoint.isOpen();
    };
    Endpoint.prototype.__lt__ = function(endpoint) { 
      return this.compareValue() < endpoint.compareValue() ||
          ( this.compareValue() == endpoint.compareValue() && (
            (this.isLeft() && endpoint.isRight() && this.isClosed() && endpoint.isClosed()) || 
            (this.isRight() && endpoint.isLeft() && this.isOpen() && endpoint.isOpen()) || 
            (this.isLeft() && endpoint.isLeft() && this.isClosed() && endpoint.isOpen()) || 
            (this.isRight() && endpoint.isRight() && this.isOpen() && endpoint.isClosed()) ));
    };
    Endpoint.prototype.__lte__ = function(endpoint, orClose) {

      return this.__lt__(endpoint) ||
        ( this.compareValue() == endpoint.compareValue() && 
            (this.isOpen() == endpoint.isOpen() || 
            (orClose == true && (this.isClosed() || endpoint.isClosed())) ));
    };
    Endpoint.prototype.__gt__ = function(endpoint) { 
      return this.compareValue() > endpoint.compareValue() ||
          ( this.compareValue() == endpoint.compareValue() && (
            (this.isLeft() && endpoint.isRight() && this.isOpen() && endpoint.isOpen()) || 
            (this.isRight() && endpoint.isLeft() && this.isClosed() && endpoint.isClosed()) || 
            (this.isLeft() && endpoint.isLeft() && this.isOpen() && endpoint.isClosed()) || 
            (this.isRight() && endpoint.isRight() && this.isClosed() && endpoint.isOpen()) ));
    };
    Endpoint.prototype.__gte__ = function(endpoint, orClose) { 
      return this.__gt__(endpoint) ||
        ( this.compareValue() == endpoint.compareValue() && 
            (this.isOpen() == endpoint.isOpen() || 
            (orClose == true && (this.isClosed() || endpoint.isClosed())) ));
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
          
        start.setPosition('start');
        end.setPosition('end');

        if(end.__gte__(start))
          this._intervals.push({start: start, end: end});
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
      
      interval.intervals().forEach(function(interval) {
        var merged = false, i=0,
            start = interval.start, 
            end = interval.end;
        
        if(!$$._intervals.length) {
          $$._intervals.push({start: start, end: end});
          return;
        }
        var $$last = $$._intervals[$$.count()-1];
        if(!(start.__lte__($$last.end, true))) {
          $$._intervals.push({start: start, end: end});
          return;
        }
        
        for(; i<$$._intervals.length; i++) {
          var $$start = $$._intervals[i].start;
          var $$end = $$._intervals[i].end;
          if(!(end.__gte__($$start, true) || start.__lte__($$end, true)))
            break;
          if(end.__gte__($$start, true) && start.__lte__($$end, true) ) {
            merged = true;
            if( start.__lte__($$start, true))
              $$._intervals[i].start = start;
            if( end.__gte__($$end, true))
              $$._intervals[i].end = end;
            break;
          }
        }
        if(i<$$._intervals.length && (end.__gte__($$._intervals[i].start, true) && 
                                     start.__lte__($$._intervals[i].end, true))) {
          for(i++; i<$$._intervals.length;) {
            if(!(end.__gte__($$._intervals[i].start, true) && start.__lte__($$._intervals[i].end, true))) 
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
      
      interval.intervals().forEach(function(interval) {
        var start = interval.start, 
            end = interval.end;
      
        for(var i=0; $$._intervals.length && i<$$._intervals.length; i++) {
          var $$start = $$._intervals[i].start;
          var $$end = $$._intervals[i].end;

          if(!(end.__gte__($$start) || start.__lte__($$end)))
            break;
            
          if(start.__lte__($$start) && end.__gte__($$end)) {
            $$._intervals.splice(i, 1);
            i--;
          }
          else if(start.__lte__($$start) && end.__gte__($$start)) {
            $$._intervals[i].start = new Interval.Endpoint(end.value(), !end.isOpen(), 'start');
          }
          else if(start.__lte__($$end) && end.__gte__($$end)) {
            $$._intervals[i].end = new Interval.Endpoint(start.value(), !start.isOpen(), 'end');
          }
          else if(start.__gt__($$start) && end.__lt__($$end)) {
            var p = {
              start: new Interval.Endpoint(end.value(), !end.isOpen(), 'start'), 
              end: $$end
            };
            $$._intervals[i].end = new Interval.Endpoint(start.value(), !start.isOpen(), 'end');
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
      
      interval.intervals().forEach(function(interval) {
        var found=false, i=0,
            start = interval.start, 
            end = interval.end;
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
      this.intervals().forEach(function(i) {
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

    
    Interval.prototype.forEach = function(cb, step) {
      step = step || 0;
      this.intervals().forEach(function(i, k) {
        var start = i.start.value();
        if(start % step)
          start = start - (start % step) + step;
        else if(i.start.isOpen())
          start = start + step;
          
        var end = i.end.value();
        if(end % step)
          end = end - (end % step);
        else if(i.end.isOpen())
          end = end - step;
        if(start <= end)
          cb(start, end, k);
      });
    };
    
    Interval.prototype.forEachPoint = function(cb, step) {
      var i;
      if(step<=0) 
        step=1;
      this.forEach(function(s, e) {
        for(i=s; i<=e; i=i+step)
          cb(i);
      }, step);
    };
    
    Interval.prototype.count = function() {
      return this._intervals.length;
    };
    
    Interval.prototype.intervals = function() {
      return this._intervals;
    };


    return Interval;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Interval;
  else
    window.Interval = Interval;
})();
