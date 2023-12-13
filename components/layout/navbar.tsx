"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { Session } from "next-auth";
import React, { useEffect, useState } from 'react';

interface IWallet {
  Balance   : number;
  CO2:number; 
}

export default function NavBar({ session }: { session: Session | null }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  const [wallet, setWallet] = useState<IWallet|null>(null);

  const fetchWalletData = async () => {
    if (session) {
      
      try {
        const response = await fetch('/api/wallet/get');
        if (response.ok) {
          const data = await response.json();
          if(data.UserWallet){
            setWallet({
                Balance: data.UserWallet.balance,
                CO2:data.UserWallet.co2Saved
              })
          }
          else {
            if(data.id){
              createWallet(data.id);
            }
          }
        } else {
          // Handle errors
        }
      } catch (error) {
        // Handle errors
      }
    }
  };

  const createWallet = async (id:any) => {
    // Assuming you have the user's ID in the session
    if (session && session.user) {
      const userId = id; // or however you store the user ID in the session
      const co2Saved = 0; // Default value
      const balance = 0; // Default value
  
      try {
        const response = await fetch('/api/wallet/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, co2Saved, balance }),
        });
  
        if (response.ok) {
          const walletData = await response.json();
          setWallet({
            Balance: walletData.balance,
            CO2:walletData.co2Saved
          })
        } else {
          // Handle errors
        }
      } catch (error) {
        // Handle errors
      }
    }
  };


  useEffect(() => {
    const handleWalletUpdate = () => {
      fetchWalletData(); // Refetch wallet data
    };

    const prepareWallet = () => {
      setWallet(null)
    }

    document.addEventListener('prepareWalletUpdate', prepareWallet);
    document.addEventListener('walletUpdated', handleWalletUpdate);
  
    return () => {
      document.addEventListener('prepareWalletUpdate', prepareWallet);
      document.removeEventListener('walletUpdated', handleWalletUpdate);
    };
  }, [fetchWalletData]);

  useEffect(() => {
    fetchWalletData();
  }, [session, fetchWalletData]);



  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 w-full flex justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full">
          {
            session ?
            (
              wallet ?
              (
                <div className="WalletInformation">
                  <div className="WalletEmissions">
                    CO2 Saved: {(wallet.CO2/1000).toFixed(2) ?? "0"}kg
                  </div>
                  <div className="WalletBalance">
                    Machlear Balance: {wallet.Balance.toFixed(2) ?? "0"}$
                  </div>
                </div> 
              ):
              <div>Loading...</div>
            ):
          <div></div>
          }
          <div>
            {session ? (
              <UserDropdown session={session} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
