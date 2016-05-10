'use strict';

var expect = chai.expect;

describe("Periods", function() {

  describe("init", function() {
    var period = new Period();
    
    it("Should has empty periods", function() {
      expect(period.periods).to.have.lengthOf(0)
    });
  })

  describe("init with initial", function() {
    var period = new Period(2,3);
    
    it("Should has one period", function() {
      expect(period.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(period.periods[0].start.value()).to.be.equal(2)
    });
    it("to 3", function() {
      expect(period.periods[0].end.value()).to.be.equal(3)
    });
  })
  
    
  describe("union()", function() {
    var period = new Period()
      .union(new Period(2,3));
    
    it("Should has one period", function() {
      expect(period.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(period.periods[0].start.value()).to.be.equal(2)
    });
    it("to 3", function() {
      expect(period.periods[0].end.value()).to.be.equal(3)
    });
  });
  
  describe("union()", function() {
    var period = new Period()
      .union(new Period(2,5))
      .union(new Period(3,7));
  
    it("Should has one period", function() {
      expect(period.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(period.periods[0].start.value()).to.be.equal(2)
    });
    it("to 7", function() {
      expect(period.periods[0].end.value()).to.be.equal(7)
    });
  });

  describe("union()", function() {
    var period = new Period(3,7)
      .union(new Period(2,5));
  
    it("Should has one period", function() {
      expect(period.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(period.periods[0].start.value()).to.be.equal(2)
    });
    it("to 7", function() {
      expect(period.periods[0].end.value()).to.be.equal(7)
    });
  });


  describe("union()", function() {
    var period = new Period(3,5)
      .union(new Period(2,7));
  
    it("Should has one period", function() {
      expect(period.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(period.periods[0].start.value()).to.be.equal(2)
    });
    it("to 7", function() {
      expect(period.periods[0].end.value()).to.be.equal(7)
    });
  });

  describe("union()", function() {
    var period = new Period(6,8)
      .union(new Period(2,4));
  
    it("Should has two periods", function() {
      expect(period.periods).to.have.lengthOf(2)
    });
    it("Should has first from 2", function() {
      expect(period.periods[0].start.value()).to.be.equal(2)
    });
  });

  describe("union()", function() {
    var period = new Period(2,4)
      .union(new Period(6,8))
      .union(new Period(1,9));

    it("Should has one period", function() {
      expect(period.periods).to.have.lengthOf(1)
    });
    it("from 1", function() {
      expect(period.periods[0].start.value()).to.be.equal(1)
    });
    it("to 9", function() {
      expect(period.periods[0].end.value()).to.be.equal(9)
    });
  });


  describe("difference()", function() {
    var period = new Period(4,7)
      .difference(new Period(2,5));

    it("Should has one period", function() {
      expect(period.periods).to.have.lengthOf(1)
    });
    it("from 5", function() {
      expect(period.periods[0].start.value()).to.be.equal(5)
    });
    it("to 7", function() {
      expect(period.periods[0].end.value()).to.be.equal(7)
    });
  });

  describe("difference()", function() {
    var period = new Period(2,6)
      .difference(new Period(4,7));

    it("Should has one period", function() {
      expect(period.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(period.periods[0].start.value()).to.be.equal(2)
    });
    it("to 4", function() {
      expect(period.periods[0].end.value()).to.be.equal(4)
    });
  });

  describe("difference()", function() {
    var period = new Period()
      .union(new Period(2,4))
      .union(new Period(7,9))
      .difference(new Period(3,8));
      
    it("Should has two periods", function() {
      expect(period.periods).to.have.lengthOf(2)
    });
    it("first to 3", function() {
      expect(period.periods[0].end.value()).to.be.equal(3)
    });
    it("to 4", function() {
      expect(period.periods[1].start.value()).to.be.equal(8)
    });
  });

  describe("difference()", function() {
    var period = new Period(2,9)
      .difference(new Period(4,5));
      
    it("Should has two periods", function() {
      expect(period.periods).to.have.lengthOf(2)
    });
    it("first to 4", function() {
      expect(period.periods[0].end.value()).to.be.equal(4)
    });
    it("to 5", function() {
      expect(period.periods[1].start.value()).to.be.equal(5)
    });
  });


});
