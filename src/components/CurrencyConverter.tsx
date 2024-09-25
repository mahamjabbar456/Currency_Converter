'use client';

import { ChangeEvent, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ClipLoader } from "react-spinners";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";


// Define the ExchangeRates type
type ExchangeRates = {
    [key:string] : number;
}

// Define the Currency type
type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR" | "INR";

const CurrencyConverter = () => {
  // State to manage the amount input by the user
  const [amount,setAmount] = useState<number | null>(null);
  // State to manage the source currency selected by the user
  const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
  // State to manage the target currency selected by the user
  const [targetCurrency, setTargetCurrency] = useState<Currency>("PKR");
  // State to manage the fetched exchange rates
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  // State to manage the converted amount
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  // State to manage the loading state during data fetch
  const [loading,setLoading] = useState<boolean>(false);
  // State to manage any error messages
  const [error,setError] = useState<string | null>(null);

  // useEffect to fetch exchange rates when the component mounts
  useEffect(()=>{
      const fetchExchangeRates = async () => {
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(
                'https://api.exchangerate-api.com/v4/latest/USD'
            );
            const data = await response.json();
            setExchangeRates(data.rates)
        } catch (error){
            setError("Error Fetching Exchange rates.");
        } finally{
            setLoading(false);
        }
      }
      fetchExchangeRates();
  },[])

    // Function to handle changes in the amount input field
   const handleAmountChange = (e : ChangeEvent<HTMLInputElement>) => {
       setAmount(parseFloat(e.target.value));
   }

  // Function to handle changes in the source currency select field
   const handleSourceCurrencyChange = (value: Currency) : void => {
       setSourceCurrency(value);
   }

  // Function to handle changes in the target currency select field
  const handleTargetCurrencyChange = (value: Currency) : void => {
    setTargetCurrency(value);
  }

  // Function to calculate the converted amount
   const calculateConvertedAmount = () : void => {
    if(sourceCurrency && targetCurrency && amount && exchangeRates){
        const rate = 
           sourceCurrency === "USD"
           ? exchangeRates[targetCurrency]
           : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];
        const result = amount * rate;
        setConvertedAmount(result.toFixed(2));
    }
   }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
                Currency Converter
            </CardTitle>
            <CardDescription>
                Convert between differnet currencies.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center">
                    <ClipLoader className="h-6 w-6 text-blue-500" />
                </div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div className="grid gap-4">
                    {/* Amount input and source currency selection */}
                    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                        <Label className="font-bold" htmlFor="from" >From</Label>
                        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                            <Input 
                            type="number"
                            placeholder="Amount"
                            value={amount || ""}
                            id="from"
                            onChange={handleAmountChange}
                            className="w-full rounded-2xl"
                            />
                            <Select
                            value={sourceCurrency}
                            onValueChange={handleSourceCurrencyChange}
                            >
                            <SelectTrigger className="w-24 rounded-2xl">
                                <SelectValue placeholder="USD" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="JPY">JPY</SelectItem>
                                    <SelectItem value="AUD">AUD</SelectItem>
                                    <SelectItem value="CAD">CAD</SelectItem>
                                    <SelectItem value="PKR">PKR</SelectItem>
                                    <SelectItem value="INR">INR</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Converted amount display and target currency selection */}
                    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                        <Label className="font-bold" htmlFor="to" >To</Label>
                        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                            <div className="text-2xl font-bold">{convertedAmount}</div>
                            <Select
                            value={targetCurrency}
                            onValueChange={handleTargetCurrencyChange}
                            >
                            <SelectTrigger className="w-24 rounded-2xl">
                                <SelectValue placeholder="USD" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="JPY">JPY</SelectItem>
                                    <SelectItem value="AUD">AUD</SelectItem>
                                    <SelectItem value="CAD">CAD</SelectItem>
                                    <SelectItem value="PKR">PKR</SelectItem>
                                    <SelectItem value="INR">INR</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}
        </CardContent>
        <CardFooter>
          {/* Convert button */}
         <Button
         type="button"
         className="w-full rounded-2xl"
         onClick={calculateConvertedAmount}
         >
            Convert
         </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CurrencyConverter
