import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting } from "../../redux/slices/billSettingSlice";
import EditSetting from "./EditSetting";
import AddSetting from "./AddSetting";

export default function BillSetting() {
  const state = useSelector((state) => state.billSetting);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSetting());
  }, [state?.success]);

  return <div>{state.setting === null ? <AddSetting /> : <EditSetting />}</div>;
}
