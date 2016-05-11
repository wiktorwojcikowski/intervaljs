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

    it("Should has one intervals", function() {
      expect(interval.toString()).to.be.equal('[2;8]');
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


});
