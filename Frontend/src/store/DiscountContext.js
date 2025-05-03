import React, { createContext, useContext, useEffect, useState } from "react";
import customerService from "../services/customerService";

const DiscountContext = createContext();

export const DiscountProvider = ({ children }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await customerService.getDiscounts();
        setDiscounts(response);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  return (
    <DiscountContext.Provider value={{ discounts, loading }}>
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscounts = () => {
  return useContext(DiscountContext);
};