
const generateJsonFormatOutputText = (diffTree) => {
  const outputText = {
    diffs: diffTree,
  };

  return JSON.stringify(outputText);
};

export default generateJsonFormatOutputText;
