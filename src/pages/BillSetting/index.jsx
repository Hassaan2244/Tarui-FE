import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSettingState } from "../../redux/slices/billSettingSlice";
import EditSetting from "./EditSetting";
import AddSetting from "./AddSetting";
import { toast } from "react-toastify";

export default function BillSetting() {
  const state = useSelector((state) => state.billSetting);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state.success) {
      dispatch(clearSettingState());
      toast.success(state?.success);
    }
    if (state.error) {
      toast.error(state?.error);
      dispatch(clearSettingState());
    }
  }, [state.success, state.error]);

  return <div>{state.setting === null ? <AddSetting /> : <EditSetting />}</div>;
}
