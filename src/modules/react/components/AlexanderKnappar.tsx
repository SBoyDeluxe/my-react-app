
export type BtnTypeTest = {
  text: string;
  testFunction: () => void;
};

export function ButtonTest({ text, testFunction }: BtnTypeTest) {
  return <button onClick={testFunction}>{text}</button>;
}
