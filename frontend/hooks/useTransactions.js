import { useCallback } from "react";
import { useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api.js";

const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions ", err);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error("Error fetching the summary : ", err);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (err) {
      console.error("Error loading the data : ", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSummary, fetchTransactions, loadData]);

  const deleteTrans = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete the transaction");

      loadData();
      Alert.alert("Success", "Transaction deleted successfully.");
    } catch (err) {
      console.error("Error deleting the transaction : ", err);
      Alert.alert("Error", err.message);
    }
  };

  return { transactions, isLoading, summary, loadData, deleteTrans };
};

export default useTransactions;
