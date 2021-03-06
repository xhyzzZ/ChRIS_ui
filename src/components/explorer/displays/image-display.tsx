import * as React from "react";
import { IFileState } from "../../../api/models/file-explorer";

type AllProps = {
  file: IFileState;
};

const ImageDisplay: React.FunctionComponent<AllProps> = (props: AllProps) => {
  const { file } = props;
  const url = (!!file.blob) ? window.URL.createObjectURL(new Blob([file.blob])) : "";
  return (
  <div className="image">
  {
    <img src={url} height={window.innerHeight} width="100%" />
  }
  </div>
  );
};

export default React.memo(ImageDisplay);
