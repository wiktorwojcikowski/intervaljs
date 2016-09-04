'use strict';

var expect = chai.expect;

describe("Interval", function() {

   describe("init empty", function() {
    var interval = new Interval();
    
    it("Should has empty intervals", function() {
      expect(interval.toString()).to.be.equal('');
    });
  })

  describe("init with data", function() {
    var interval = new Interval(2,3);
    
    it("Should has one interval", function() {
      expect(interval.toString()).to.be.equal('[2;3]');
    });
  })
  
  describe("init single point", function() {
    var interval = new Interval(2,2);
    
    it("Should has one point", function() {
      expect(interval.toString()).to.be.equal('{2}');
    });
  })
  
  describe("init with endpoints", function() {
    var interval = new Interval(
          new Interval.Endpoint(2, false), new Interval.Endpoint(4, true));
    
    it("Should has one point", function() {
      expect(interval.toString()).to.be.equal('[2;4)');
    });
  })

  describe("init with end less then start", function() {
    var interval = new Interval(3, 2);
    
    it("Should be empty", function() {
      expect(interval.toString()).to.be.equal('');
    });
  })

  describe("init with end less then start", function() {
    var interval = new Interval(
          new Interval.Endpoint(2, true), new Interval.Endpoint(2, false));
    
    it("Should be empty", function() {
      expect(interval.toString()).to.be.equal('');
    });
  })

    
  describe("union with empty", function() {
    var interval = new Interval()
      .union(new Interval(2,3));
    
    it("Should has one interval", function() {
      expect(interval.toString()).to.be.equal('[2;3]');
    });
  });
  
  describe("union right overrideing intervals", function() {
    var interval = new Interval()
      .union(new Interval(2,5))
      .union(new Interval(3,7));
  
    it("Should has one interval", function() {
      expect(interval.toString()).to.be.equal('[2;7]');
    });
  });

  describe("union left overrideing intervals", function() {
    var interval = new Interval(3,7)
      .union(new Interval(2,5));
  
    it("Should has one interval", function() {
      expect(interval.toString()).to.be.equal('[2;7]');
    });
  });


  describe("union containing intervals", function() {
    var interval = new Interval(3,5)
      .union(new Interval(2,7));
  
    it("Should has one interval", function() {
      expect(interval.toString()).to.be.equal('[2;7]');
    });
  });

  describe("union separate intervals", function() {
    var interval = new Interval(6,8)
      .union(new Interval(2,4));
  
    it("Should has two intervals", function() {
      expect(interval.toString()).to.be.equal('[2;4], [6;8]');
    });
  });

  describe("union()", function() {
    var interval = new Interval(2,4)
      .union(6,8)
      .union(new Interval(3,7));

    it("Should has one interval", function() {
      expect(interval.toString()).to.be.equal('[2;8]');
    });
  });

  describe("union between", function() {
    var interval = new Interval(2,3)
      .union(7,9)
      .union(4,5);

    it("Should has three intervals", function() {
      expect(interval.toString()).to.be.equal('[2;3], [4;5], [7;9]');
    });
  });
  
  describe("union between with join after", function() {
    var interval = new Interval(0, 2)
      .union(3, 4)
      .union(6, 8)
      .union(4, 8);

    it("Should has two intervals", function() {
      expect(interval.toString()).to.be.equal('[0;2], [3;8]');
    });
  });

  describe("union between with join before", function() {
    var interval = new Interval(0, 2)
      .union(3, 4)
      .union(6, 8)
      .union(2, 4);

    it("Should has two intervals", function() {
      expect(interval.toString()).to.be.equal('[0;4], [6;8]');
    });
  });

  describe("union close", function() {
    var interval = new Interval(2, 9)
      .difference(2, 4)
      .difference(5, 6)
      .union(2, 6);

    it("Should has one interval", function() {
      expect(interval.toString()).to.be.equal('[2;9]');
    });
  });
  

  describe("difference from right", function() {
    var interval = new Interval(4,7)
      .difference(2,5);

    it("Should has one interval", function() {
      expect(interval.toString()).to.be.equal('(5;7]');
    });
  });

  describe("difference from left", function() {
    var interval = new Interval(2,6)
      .difference(new Interval(4,7));

    it("Should has one interval", function() {
      expect(interval.toString()).to.be.equal('[2;4)');
    });
  });

  describe("difference both sides", function() {
    var interval = new Interval()
      .union(new Interval(2,4))
      .union(new Interval(7,9))
      .difference(new Interval(3,8));
      
    it("Should has two intervals", function() {
      expect(interval.toString()).to.be.equal('[2;3), (8;9]');
    });
  });

  describe("difference from inside", function() {
    var interval = new Interval(2,9)
      .difference(new Interval(3,8));
      
    it("Should has two intervals", function() {
      expect(interval.toString()).to.be.equal('[2;3), (8;9]');
    });
  });

  describe("difference single point", function() {
    var interval = new Interval(2,9)
      .difference(3);
      
    it("Should has two intervals", function() {
      expect(interval.toString()).to.be.equal('[2;3), (3;9]');
    });
  });

  describe("difference single point, right border case", function() {
    var interval = new Interval(2,3)
      .difference(3);
      
    it("Should has two intervals", function() {
      expect(interval.toString()).to.be.equal('[2;3)');
    });
  });

  describe("difference single point, left border case", function() {
    var interval = new Interval(2,3)
      .difference(2);
      
    it("Should has two intervals", function() {
      expect(interval.toString()).to.be.equal('(2;3]');
    });
  });

  describe("double difference with single point", function() {
    var big = new Interval(4,6)
      .difference(4);
    var interval = new Interval(4,6)
      .difference(big);
      
    it("Should has two intervals", function() {
      expect(interval.toString()).to.be.equal('{4}');
    });
  });

  describe("superset single point", function() {
    var result = new Interval(2,3)
      .superset(3);
      
    it("interval should contain value", function() {
      expect(result).to.be.equal(true);
    });
  });
  
  describe("superset interval", function() {
    var result = new Interval(2,6)
      .superset(4,6);
      
    it("interval should contain interval", function() {
      expect(result).to.be.equal(true);
    });
  });

  describe("superset interval", function() {
    var result = new Interval(2,8)
      .difference(6)
      .superset(4,7);
      
    it("interval should not contain interval", function() {
      expect(result).to.be.equal(false);
    });
  });

  describe("superset dual", function() {
  
    var i1 = new Interval(1, 4)
      .union(6, 9);
    var i2 = new Interval(1, 9)
      .difference(4, 6);
    var result = i1.superset(i2);
      
    it("interval should contain intervals", function() {
      expect(result).to.be.equal(true);
    });
  });
  
  describe("subset interval", function() {
    var result = new Interval(2,3)
      .subset(1, 9);
      
    it("interval should contain value", function() {
      expect(result).to.be.equal(true);
    });
  });
  
  describe("conatins single point", function() {
    var result = new Interval(2,3)
      .contains(3);
      
    it("interval should contain value", function() {
      expect(result).to.be.equal(true);
    });
  });
  

  describe("infinity intervals", function() {
  
    var interval = new Interval(4, Infinity)
      .union(3, 5)
      .difference(7, 8);
      
    it("interval should contain intervals", function() {
      expect(interval.toString()).to.be.equal('[3;7), (8;Infinity)');
    });
  });

  describe("inversion of interval", function() {
  
    var interval = new Interval(4, 6)
      .inversion();
      
    it("should have two intervals", function() {
      expect(interval.toString()).to.be.equal('(-Infinity;4), (6;Infinity)');
    });
  });

  describe("inversion of infinity interval", function() {
  
    var interval = new Interval(4, Infinity)
      .inversion();
      
    it("should has one inetrval", function() {
      expect(interval.toString()).to.be.equal('(-Infinity;4)');
    });
  });


  describe("intersection", function() {
  
    var interval = new Interval(2, 6)
      .intersection(4, 8);
      
    it("should has one inetrval", function() {
      expect(interval.toString()).to.be.equal('[4;6]');
    });
  });

  describe("exclusion", function() {
  
    var interval = new Interval(2, 6)
      .exclusion(4, 8);
      
    it("should has one inetrval", function() {
      expect(interval.toString()).to.be.equal('[2;4), (6;8]');
    });
  });

  describe("forEach", function() {
  
    var interval = new Interval(2, 6)
      .exclusion(4, 8);
    
    var borders = new Interval();
    interval.forEach(function(start, end) {
      borders.union(start, end);
    }, 1);
      
    it("should has one inetrval", function() {
      expect(borders.toString()).to.be.equal('[2;3], [7;8]');
    });
  });

  describe("forEachPoint", function() {
  
    var interval = new Interval(2, 6)
      .exclusion(4, 8);
    
    var points = new Interval();
    interval.forEachPoint(function(point) {
      points.union(point);
    }, 1);
      
    it("should has one inetrval", function() {
      expect(points.toString()).to.be.equal('{2}, {3}, {7}, {8}');
    });
  });

  describe("diference separate intervals", function() {
  
    var interval = new Interval(2, 4)
      .difference(6, 8);
    
    it("should has one inetrval", function() {
      expect(interval.toString()).to.be.equal('[2;4]');
    });
  });



});
