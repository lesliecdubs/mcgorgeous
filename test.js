import test from "ava";
import check from "./dist/mcgorgeous.common";

test("Correct string type", t => {
  const sitesSchema = [{ name: "string" }];
  const sitesData = [{ name: "Jeff" }, { name: "Gary" }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong string type", t => {
  const sitesSchema = [{ name: "string" }];
  const sitesData = [{ name: 0 }, { name: "Gary" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"0" is not a string.');
});

test("Correct numeric type", t => {
  const sitesSchema = [{ id: "number" }];
  const sitesData = [{ id: 3 }, { id: 4 }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong numeric type", t => {
  const sitesSchema = [{ id: "number" }];
  const sitesData = [{ id: 0 }, { id: "Gary" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"Gary" is not a number.');
});

test("Correct boolean type", t => {
  const sitesSchema = [{ has_power: "boolean" }];
  const sitesData = [{ has_power: true }, { has_power: false }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong boolean type", t => {
  const sitesSchema = [{ has_power: "boolean" }];
  const sitesData = [{ has_power: true }, { has_power: "false" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"false" is not a boolean.');
});

test("Correct base object structure", t => {
  const sitesSchema = [{ id: "number", name: "string", has_power: "boolean" }];
  const sitesData = [
    { id: 24601, name: "Janice", has_power: false },
    { id: 24602, name: "Gary", has_power: true }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong base object structure", t => {
  const sitesSchema = [{ id: "number", name: "string", has_power: "boolean" }];
  const sitesData = [[1, 2, 3]];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, `Schema is looking for "object", data is [1,2,3]`);
});

test("Correct base array structure", t => {
  const sitesSchema = [{ id: "number", name: "string", powers: ["string"] }];
  const sitesData = [
    { id: 24601, name: "Janice", powers: ["fire", "ice"] },
    { id: 24602, name: "Gary", powers: ["fire", "magic"] }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong base array structure", t => {
  const sitesSchema = [{ id: "number", name: "string", powers: ["string"] }];
  const sitesData = [
    { id: 24601, name: "Janice", powers: { power1: "fire", power2: "ice" } },
    { id: 24602, name: "Gary", powers: { power1: "fire", power2: "magic" } }
  ];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(
    error.message,
    'Schema is looking for "array", data is {"power1":"fire","power2":"ice"}'
  );
});

test("Correct Array of ints", t => {
  const sitesSchema = [{ ratings: ["number"] }];
  const sitesData = [
    { ratings: [0, 5, 3, 8, 7, 9] },
    { ratings: [0, 5, 2, 9] }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong Array of ints", t => {
  const sitesSchema = [{ ratings: ["number"] }];
  const sitesData = [
    { ratings: [0, 5, "3", 8, 7, 9] },
    { ratings: [0, 5, 2, 9] }
  ];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"3" is not a number.');
});

test("Correct Array of booleans", t => {
  const sitesSchema = [{ ratings: ["boolean"] }];
  const sitesData = [
    { ratings: [true, false, true, false, true] },
    { ratings: [true, false, false, true] }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong Array of booleans", t => {
  const sitesSchema = [{ ratings: ["boolean"] }];
  const sitesData = [
    { ratings: [true, false, true, false, true] },
    { ratings: [true, false, 9, true] }
  ];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"9" is not a boolean.');
});

test("Order of keys does not matter", t => {
  const sitesSchema = [{ powers: ["string"], name: "string", id: "number" }];
  const sitesData = [
    { id: 24601, name: "Janice", powers: ["fire", "ice"] },
    { powers: ["fire", "magic"], id: 24602, name: "Gary" }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Correctly deeply nested", t => {
  const sitesSchema = [
    {
      powers: [
        {
          id: "string",
          name: [{ id: "string", num: "number", avail: "boolean" }]
        }
      ],
      name: "string",
      id: "number"
    }
  ];
  const sitesData = [
    {
      powers: [
        { id: "fjeijd", name: [{ id: "239jrj", num: 443, avail: false }] }
      ],
      name: "Gary",
      id: 232333
    },
    {
      powers: [
        { id: "dfdf33e", name: [{ id: "dsds", num: 3232, avail: true }] }
      ],
      name: "Susan",
      id: 22233344556
    },
    {
      powers: [
        { id: "2wk2wk", name: [{ id: "k2kw2", num: 398574, avail: false }] },
        {
          id: "2wk2wk",
          name: [
            { id: "33dfd", num: 398574, avail: true },
            { id: "dfkdf", num: 398574, avail: false },
            { id: "nvnfvnf", num: 398574, avail: true }
          ]
        },
        { id: "2wk2wk", name: [{ id: "k2kw2", num: 398574, avail: false }] }
      ],
      name: "Vivian",
      id: 3984574874
    }
  ];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong deeply nested", t => {
  const sitesSchema = [
    {
      powers: [
        {
          id: "string",
          name: [{ id: "string", num: "number", avail: "boolean" }]
        }
      ],
      name: "string",
      id: "number"
    }
  ];
  const sitesData = [
    {
      powers: [
        { id: "fjeijd", name: [{ id: "239jrj", num: 443, avail: false }] }
      ],
      name: "Gary",
      id: 232333
    },
    {
      powers: [
        { id: "dfdf33e", name: [{ id: "dsds", num: 3232, avail: true }] }
      ],
      name: "Susan",
      id: 22233344556
    },
    {
      powers: [
        { id: "2wk2wk", name: [{ id: "k2kw2", num: 398574, avail: false }] },
        {
          id: "2wk2wk",
          name: [
            { id: "33dfd", num: 398574, avail: true },
            { id: "dfkdf", num: "398574", avail: false },
            { id: "nvnfvnf", num: 398574, avail: true }
          ]
        },
        { id: "2wk2wk", name: [{ id: "k2kw2", num: 398574, avail: false }] }
      ],
      name: "Vivian",
      id: 3984574874
    }
  ];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"398574" is not a number.');
});

test("Unknown schema type", t => {
  const sitesSchema = [{ name: "array" }];
  const sitesData = [{ name: "Jeff" }, { name: "Gary" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, 'Unknown schema type: "array"');
});
