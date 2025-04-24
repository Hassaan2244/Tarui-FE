import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleLedger } from "../../redux/slices/ledgerSlice";
import { useParams } from "react-router-dom";

export default function LedgerDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ledgerState = useSelector((state) => state.ledger);
  const ledgers = ledgerState?.ledgers?.data;
  console.log(ledgerState);
  useEffect(() => {
    dispatch(fetchSingleLedger(id));
  }, []);

  return <div>LedgerDetail</div>;
}
