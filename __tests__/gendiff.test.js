import { readFileSync } from "fs";
import path from "path";
import gendiff from "../src/gendiff";

test("test flat json diff", () => {
  const pathToFixtures = "/__fixtures__/testPack1/";
  const pathToFile1 = path.join(__dirname, pathToFixtures, "before.json");
  const pathToFile2 = path.join(__dirname, pathToFixtures, "after.json");
  const output = readFileSync(
    path.join(__dirname, pathToFixtures, "output.txt"),
    "utf8"
  );
  expect(gendiff(pathToFile1, pathToFile2)).toBe(output);
});

test("test flat yaml diff", () => {
  const pathToFixtures = "/__fixtures__/testPack2/";
  const pathToFile1 = path.join(__dirname, pathToFixtures, "before.yaml");
  const pathToFile2 = path.join(__dirname, pathToFixtures, "after.yaml");
  const output = readFileSync(
    path.join(__dirname, pathToFixtures, "output.txt"),
    "utf8"
  );
  expect(gendiff(pathToFile1, pathToFile2)).toBe(output);
});

test("test flat ini diff", () => {
  const pathToFixtures = "/__fixtures__/testPack3/";
  const pathToFile1 = path.join(__dirname, pathToFixtures, "before.ini");
  const pathToFile2 = path.join(__dirname, pathToFixtures, "after.ini");
  const output = readFileSync(
    path.join(__dirname, pathToFixtures, "output.txt"),
    "utf8"
  );
  expect(gendiff(pathToFile1, pathToFile2)).toBe(output);
});

test("test deep json diff", () => {
  const pathToFixtures = "/__fixtures__/testPack4/";
  const pathToFile1 = path.join(__dirname, pathToFixtures, "before.json");
  const pathToFile2 = path.join(__dirname, pathToFixtures, "after.json");
  const output = readFileSync(
    path.join(__dirname, pathToFixtures, "output.txt"),
    "utf8"
  );
  expect(gendiff(pathToFile1, pathToFile2)).toBe(output);
});

test("test deep yaml diff", () => {
  const pathToFixtures = "/__fixtures__/testPack5/";
  const pathToFile1 = path.join(__dirname, pathToFixtures, "before.yaml");
  const pathToFile2 = path.join(__dirname, pathToFixtures, "after.yaml");
  const output = readFileSync(
    path.join(__dirname, pathToFixtures, "output.txt"),
    "utf8"
  );
  expect(gendiff(pathToFile1, pathToFile2)).toBe(output);
});

test("test deep ini diff", () => {
  const pathToFixtures = "/__fixtures__/testPack6/";
  const pathToFile1 = path.join(__dirname, pathToFixtures, "before.ini");
  const pathToFile2 = path.join(__dirname, pathToFixtures, "after.ini");
  const output = readFileSync(
    path.join(__dirname, pathToFixtures, "output.txt"),
    "utf8"
  );
  expect(gendiff(pathToFile1, pathToFile2)).toBe(output);
});

test("test deep json diff with plain format", () => {
  const pathToFixtures = "/__fixtures__/testPack7/";
  const pathToFile1 = path.join(__dirname, pathToFixtures, "before.json");
  const pathToFile2 = path.join(__dirname, pathToFixtures, "after.json");
  const output = readFileSync(
    path.join(__dirname, pathToFixtures, "output.txt"),
    "utf8"
  );
  expect(gendiff(pathToFile1, pathToFile2, "plain")).toBe(output);
});
