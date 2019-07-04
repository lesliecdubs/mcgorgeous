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
  const sitesSchema = [{ id: 0 }];
  const sitesData = [{ id: 3 }, { id: 4 }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong numeric type", t => {
  const sitesSchema = [{ id: 0 }];
  const sitesData = [{ id: 0 }, { id: "Gary" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"Gary" is not numeric.');
});

test("Correct boolean type", t => {
  const sitesSchema = [{ has_power: true }];
  const sitesData = [{ has_power: true }, { has_power: false }];
  const checkData = check(sitesSchema, sitesData);
  t.true(checkData);
});

test("Wrong boolean type", t => {
  const sitesSchema = [{ has_power: true }];
  const sitesData = [{ has_power: true }, { has_power: "false" }];
  const error = t.throws(() => {
    check(sitesSchema, sitesData);
  }, Error);
  t.is(error.message, '"false" is not a boolean.');
});
