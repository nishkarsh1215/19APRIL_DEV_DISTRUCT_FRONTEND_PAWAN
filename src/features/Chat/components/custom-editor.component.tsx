import { useActiveCode } from "@codesandbox/sandpack-react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-textmate";

export const CustomAceEditor = () => {
  const { code, updateCode } = useActiveCode();

  return (
    <AceEditor
      mode="javascript"
      defaultValue={code}
      onChange={updateCode}
      fontSize={14}
      height="300px"
      width="100%"
    />
  );
};
