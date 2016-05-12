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
  
  describe("init single poinnt", function() {
    var interval = new Interval(2,2);
    
    it("Should has one point", function() {
      expect(interval.toString()).to.be.equal('{2}');
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

  describe("contain single point", function() {
    var result = new Interval(2,3)
      .contain(3);
      
    it("interval should contain value", function() {
      expect(result).to.be.equal(true);
    });
  });
  
  describe("contain interval", function() {
    var result = new Interval(2,6)
      .contain(4,6);
      
    it("interval should contain interval", function() {
      expect(result).to.be.equal(true);
    });
  });

  describe("contain interval", function() {
    var result = new Interval(2,8)
      .difference(6)
      .contain(4,7);
      
    it("interval should not contain interval", function() {
      expect(result).to.be.equal(false);
    });
  });

  describe("contain dual", function() {
  
    var i1 = new Interval(1, 4)
      .union(6, 9);
    var i2 = new Interval(1, 9)
      .difference(4, 6);
    var result = i1.contain(i2);
      
    it("interval should contain intervals", function() {
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



});
