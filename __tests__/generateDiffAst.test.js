import { generateAstDiff } from "../src/gendiff";

test("test parse changed", () => {
  const beforeObj = {
    a: 1
  };

  const afterObj = {
    a: 2
  };
  const expected = [
    {
      key: "a",
      newValue: 2,
      oldValue: 1,
      type: "changed"
    }
  ];

  expect(generateAstDiff([beforeObj, afterObj])).toStrictEqual(expected);
});

test("test parse add", () => {
  const beforeObj = {};

  const afterObj = {
    a: 2
  };
  const expected = [
    {
      key: "a",
      newValue: 2,
      type: "added"
    }
  ];

  expect(generateAstDiff([beforeObj, afterObj])).toStrictEqual(expected);
});

test("test parse remove", () => {
  const beforeObj = {
    a: 2
  };

  const afterObj = {};
  const expected = [
    {
      key: "a",
      oldValue: 2,
      type: "removed"
    }
  ];

  expect(generateAstDiff([beforeObj, afterObj])).toStrictEqual(expected);
});

test("test parse equal", () => {
  const beforeObj = {
    a: 2
  };

  const afterObj = {
    a: 2
  };
  const expected = [
    {
      key: "a",
      value: 2,
      type: "equal"
    }
  ];

  expect(generateAstDiff([beforeObj, afterObj])).toStrictEqual(expected);
});

test("test parse deep equal", () => {
  const beforeObj = {
    a: 2,
    b: {
      c: 1
    }
  };

  const afterObj = {
    a: 2,
    b: {
      c: 1
    }
  };
  const expected = [
    {
      key: "a",
      value: 2,
      type: "equal"
    },
    {
      key: "b",
      type: "children",
      value: [
        {
          key: "c",
          type: "equal",
          value: 1
        }
      ]
    }
  ];

  expect(generateAstDiff([beforeObj, afterObj])).toStrictEqual(expected);
});

test("test parse deep added", () => {
  const beforeObj = {
    a: 2
  };

  const afterObj = {
    a: 2,
    b: {
      c: 1
    }
  };
  const expected = [
    {
      key: "a",
      value: 2,
      type: "equal"
    },
    {
      key: "b",
      type: "added",
      newValue: { c: 1 }
    }
  ];

  expect(generateAstDiff([beforeObj, afterObj])).toStrictEqual(expected);
});

test("test parse deep removed", () => {
  const beforeObj = {
    a: 2,
    b: {
      c: 1
    }
  };

  const afterObj = {
    a: 2
  };
  const expected = [
    {
      key: "a",
      value: 2,
      type: "equal"
    },
    {
      key: "b",
      type: "removed",
      oldValue: { c: 1 }
    }
  ];

  expect(generateAstDiff([beforeObj, afterObj])).toStrictEqual(expected);
});

test("test parse deep changed", () => {
  const beforeObj = {
    a: 2,
    b: {
      c: 1
    }
  };

  const afterObj = {
    a: 2,
    b: {
      c: 2
    }
  };
  const expected = [
    {
      key: "a",
      value: 2,
      type: "equal"
    },
    {
      key: "b",
      type: "children",
      value: [
        {
          key: "c",
          type: "changed",
          oldValue: 1,
          newValue: 2
        }
      ]
    }
  ];

  expect(generateAstDiff([beforeObj, afterObj])).toStrictEqual(expected);
});
