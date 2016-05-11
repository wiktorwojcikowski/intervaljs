'use strict';

var expect = chai.expect;

describe("Periods", function() {

  describe("init empty", function() {
    var period = new Period();
    
    it("Should has empty periods", function() {
      expect(period.toString()).to.be.equal('');
    });
  })

  describe("init with data", function() {
    var period = new Period(2,3);
    
    it("Should has one period", function() {
      expect(period.toString()).to.be.equal('[2;3]');
    });
  })
  
    
  describe("union with empty", function() {
    var period = new Period()
      .union(new Period(2,3));
    
    it("Should has one period", function() {
      expect(period.toString()).to.be.equal('[2;3]');
    });
  });
  
  describe("union right overrideing intervals", function() {
    var period = new Period()
      .union(new Period(2,5))
      .union(new Period(3,7));
  
    it("Should has one period", function() {
      expect(period.toString()).to.be.equal('[2;7]');
    });
  });

  describe("union left overrideing intervals", function() {
    var period = new Period(3,7)
      .union(new Period(2,5));
  
    it("Should has one period", function() {
      expect(period.toString()).to.be.equal('[2;7]');
    });
  });


  describe("union containing intervals", function() {
    var period = new Period(3,5)
      .union(new Period(2,7));
  
    it("Should has one period", function() {
      expect(period.toString()).to.be.equal('[2;7]');
    });
  });

  describe("union separate intervals", function() {
    var period = new Period(6,8)
      .union(new Period(2,4));
  
    it("Should has two periods", function() {
      expect(period.toString()).to.be.equal('[2;4], [6;8]');
    });
  });

  describe("union()", function() {
    var period = new Period(2,4)
      .union(6,8)
      .union(new Period(3,7));

    it("Should has one periods", function() {
      expect(period.toString()).to.be.equal('[2;8]');
    });
  });


  describe("difference from right", function() {
    var period = new Period(4,7)
      .difference(2,5);

    it("Should has one period", function() {
      expect(period.toString()).to.be.equal('(5;7]');
    });
  });

  describe("difference from left", function() {
    var period = new Period(2,6)
      .difference(new Period(4,7));

    it("Should has one period", function() {
      expect(period.toString()).to.be.equal('[2;4)');
    });
  });

  describe("difference both sides", function() {
    var period = new Period()
      .union(new Period(2,4))
      .union(new Period(7,9))
      .difference(new Period(3,8));
      
    it("Should has two periods", function() {
      expect(period.toString()).to.be.equal('[2;3), (8;9]');
    });
  });

  describe("difference from inside", function() {
    var period = new Period(2,9)
      .difference(new Period(3,8));
      
    it("Should has two periods", function() {
      expect(period.toString()).to.be.equal('[2;3), (8;9]');
    });
  });

  describe("difference single point", function() {
    var period = new Period(2,9)
      .difference(3);
      
    it("Should has two periods", function() {
      expect(period.toString()).to.be.equal('[2;3), (3;9]');
    });
  });


});
