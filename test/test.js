'use strict';

var expect = chai.expect;

describe("Periods", function() {

  describe("init", function() {
    var periods = new Periods();
    
    it("Should has empty periods", function() {
      expect(periods.periods).to.have.lengthOf(0)
    });
  })

  describe("init with initial", function() {
    var periods = new Periods([[2,3]]);
    
    it("Should has one period", function() {
      expect(periods.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(periods.periods[0][0]).to.be.equal(2)
    });
    it("to 3", function() {
      expect(periods.periods[0][1]).to.be.equal(3)
    });
  })
    
  describe("union()", function() {
    var periods = new Periods()
      .union([2,5]);
    
    it("Should has one period", function() {
      expect(periods.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(periods.periods[0][0]).to.be.equal(2)
    });
    it("to 5", function() {
      expect(periods.periods[0][1]).to.be.equal(5)
    });
    
  });
  
  describe("union()", function() {
    var periods = new Periods()
      .union([2,5])
      .union([3,7]);
  
    it("Should has one period", function() {
      expect(periods.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(periods.periods[0][0]).to.be.equal(2)
    });
    it("to 7", function() {
      expect(periods.periods[0][1]).to.be.equal(7)
    });
  });

  describe("union()", function() {
    var periods = new Periods()
      .union([3,7])
      .union([2,5]);
  
    it("Should has one period", function() {
      expect(periods.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(periods.periods[0][0]).to.be.equal(2)
    });
    it("to 7", function() {
      expect(periods.periods[0][1]).to.be.equal(7)
    });
  });


  describe("union()", function() {
    var periods = new Periods()  
      .union([3,5])
      .union([2,7]);
  
    it("Should has one period", function() {
      expect(periods.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(periods.periods[0][0]).to.be.equal(2)
    });
    it("to 7", function() {
      expect(periods.periods[0][1]).to.be.equal(7)
    });
  });

  describe("union()", function() {
    var periods = new Periods()
      .union([6,8])
      .union([2,4]);
  
    it("Should has two periods", function() {
      expect(periods.periods).to.have.lengthOf(2)
    });
    it("Should has first from 2", function() {
      expect(periods.periods[0][0]).to.be.equal(2)
    });
  });

  describe("union()", function() {
    var periods = new Periods()
      .union([2,4])
      .union([6,8])
      .union([1,9]);

    it("Should has one period", function() {
      expect(periods.periods).to.have.lengthOf(1)
    });
    it("from 1", function() {
      expect(periods.periods[0][0]).to.be.equal(1)
    });
    it("to 9", function() {
      expect(periods.periods[0][1]).to.be.equal(9)
    });
  });


  describe("difference()", function() {
    var periods = new Periods()
      .union([4,7])
      .difference([2,5]);

    it("Should has one period", function() {
      expect(periods.periods).to.have.lengthOf(1)
    });
    it("from 5", function() {
      expect(periods.periods[0][0]).to.be.equal(5)
    });
    it("to 7", function() {
      expect(periods.periods[0][1]).to.be.equal(7)
    });
  });

  describe("difference()", function() {
    var periods = new Periods()
      .union([2,6])
      .difference([4,7]);

    it("Should has one period", function() {
      expect(periods.periods).to.have.lengthOf(1)
    });
    it("from 2", function() {
      expect(periods.periods[0][0]).to.be.equal(2)
    });
    it("to 4", function() {
      expect(periods.periods[0][1]).to.be.equal(4)
    });
  });

  describe("difference()", function() {
    var periods = new Periods()
      .union([2,4])
      .union([7,9])
      .difference([3,8]);
      
    it("Should has two periods", function() {
      expect(periods.periods).to.have.lengthOf(2)
    });
    it("first to 3", function() {
      expect(periods.periods[0][1]).to.be.equal(3)
    });
    it("to 4", function() {
      expect(periods.periods[1][0]).to.be.equal(8)
    });
  });

  describe("difference()", function() {
    var periods = new Periods()
      .union([2,9])
      .difference([4,5]);
      
    it("Should has two periods", function() {
      expect(periods.periods).to.have.lengthOf(2)
    });
    it("first to 4", function() {
      expect(periods.periods[0][1]).to.be.equal(4)
    });
    it("to 5", function() {
      expect(periods.periods[1][0]).to.be.equal(5)
    });
  });


});
