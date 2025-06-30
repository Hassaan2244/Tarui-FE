import EditSetting from "./EditSetting";
import AddSetting from "./AddSetting";
import { useSelector } from "react-redux";

export default function BillSetting() {
  const state = useSelector((state) => state.billSetting);

  return <div>{state.setting === null ? <AddSetting /> : <EditSetting />}</div>;
}
