import type { ReactNode } from "react";
import Header from "../components/header/Header";

interface BaseProps {
  children: ReactNode;
}

const BasePage = ({ children }: BaseProps) => {
  return (
    <>
      <Header />
      <div className="w-full bg-white py-4 max-w-[1400px] flex flex-col gap-7">
        {children}
      </div>
    </>
  );
};

export default BasePage;
